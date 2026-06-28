#!/usr/bin/env python3
"""
parse_reviews.py
把书评 Excel（A列作者名，B列正文）转成 reviews.json

用法：
    python parse_reviews.py 工作簿2.xlsx reviews.json
"""

import json
import sys
from pathlib import Path
import openpyxl


def parse_reviews(xlsx_path: str) -> list[dict]:
    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb.active
    reviews = []

    for row in ws.iter_rows(min_row=1, values_only=True):
        author = row[0]
        text   = row[1] if len(row) > 1 else None

        # 跳过空行或缺字段的行
        if not author or not text:
            continue

        reviews.append({
            "author": str(author).strip(),
            "text":   str(text).strip(),
        })

    wb.close()
    return reviews


def main():
    if len(sys.argv) < 3:
        print("用法：python parse_reviews.py input.xlsx output.json")
        sys.exit(1)

    input_path  = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not input_path.exists():
        print(f"错误：找不到文件 {input_path}")
        sys.exit(1)

    reviews = parse_reviews(str(input_path))
    output_path.write_text(
        json.dumps(reviews, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"✓ 共解析 {len(reviews)} 条书评")
    print(f"✓ 已写入：{output_path}")
    print("\n── 预览 ──")
    for r in reviews[:3]:
        preview = r["text"][:40] + "…" if len(r["text"]) > 40 else r["text"]
        print(f"  {r['author']}：{preview}")


if __name__ == "__main__":
    main()
