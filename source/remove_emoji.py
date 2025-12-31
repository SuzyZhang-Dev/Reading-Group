import pandas as pd
import emoji

def clean_emojis(text):
    # 检查是否为字符串，因为表格里可能有数字或日期，不需要处理
    if isinstance(text, str):
        # replace_emoji 是核心方法，将识别到的 emoji 替换为空字符串
        return emoji.replace_emoji(text, replace='')
    return text

# 1. 读取文件
input_file = 'Book1.xlsx'
output_file = 'no_emoji.csv'

print("正在读取 Excel...")
df = pd.read_excel(input_file)

# 2. 清理数据
# Applymap (或新版 pandas 的 map) 会将函数应用到每一个单元格
print("正在清理 Emoji...")
# 注意：如果你的 pandas 版本较新，用 df.map；如果较旧，用 df.applymap
df_clean = df.map(clean_emojis) 

# 3. 保存结果
df_clean.to_csv(output_file, index=False)
print(f"搞定！文件已保存为: {output_file}")