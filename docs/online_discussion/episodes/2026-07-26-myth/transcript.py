#!/usr/bin/env python3
"""
parse_transcript.py
把读书会录音文稿（txt）解析成 JSON 格式。

用法：
    python parse_transcript.py input.txt output.json

输入格式（支持两种时间戳格式）：
    雀 06:23
    这是发言内容……

    说话人 5 01:07:22
    这是发言内容……
"""

import re
import json
import sys
from pathlib import Path


def time_to_seconds(time_str: str) -> int:
    """把时间字符串转成秒数。支持 mm:ss 和 hh:mm:ss 两种格式。"""
    parts = time_str.strip().split(":")
    parts = [int(p) for p in parts]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0


def parse_transcript(txt: str) -> list[dict]:
    """
    解析文稿，返回 segment 列表。
    每个 segment：{ speaker, time, seconds, text }
    """
    lines = txt.splitlines()
    segments = []

    # 匹配发言人行：说话人名字 + 时间戳
    # 支持：雀 06:23 / 说话人 5 01:07:22 / 蒋闪闪 08:34
    header_pattern = re.compile(
        r'^(.+?)\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*$'
    )

    current_speaker = None
    current_time = None
    current_seconds = None
    current_lines = []

    def flush():
        if current_speaker is None:
            return
        text = " ".join(
            line.strip()
            for line in current_lines
            if line.strip()
        )
        if text:
            segments.append({
                "speaker": current_speaker,
                "time": current_time,
                "seconds": current_seconds,
                "text": text,
            })

    for line in lines:
        m = header_pattern.match(line)
        if m:
            flush()
            current_speaker = m.group(1).strip()
            current_time = m.group(2).strip()
            current_seconds = time_to_seconds(current_time)
            current_lines = []
        else:
            # 跳过文件头的元数据（关键词、日期等）
            if current_speaker is not None:
                current_lines.append(line)

    flush()
    return segments


def main():
    if len(sys.argv) < 3:
        print("用法：python parse_transcript.py input.txt output.json")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not input_path.exists():
        print(f"错误：找不到文件 {input_path}")
        sys.exit(1)

    txt = input_path.read_text(encoding="utf-8")
    segments = parse_transcript(txt)

    output_path.write_text(
        json.dumps(segments, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"✓ 解析完成：共 {len(segments)} 个段落")
    print(f"✓ 已写入：{output_path}")

    # 打印前3条预览
    print("\n── 前3条预览 ──")
    for seg in segments[:3]:
        preview = seg["text"][:40] + "…" if len(seg["text"]) > 40 else seg["text"]
        print(f"  [{seg['time']}] {seg['speaker']}：{preview}")


if __name__ == "__main__":
    main()