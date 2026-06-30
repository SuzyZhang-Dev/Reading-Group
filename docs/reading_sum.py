import pandas as pd
import re
from collections import Counter

# Load the specific CSV file
file_path = "/Users/yue/moonlight/docs/抽查归档（请勿自填）.csv"
df = pd.read_csv(file_path)

# Column C is the 3rd column (index 2)
col_c_name = df.columns[2]
col_c_data = df[col_c_name].dropna()

# 1. How many people completed check-in (not empty)
num_people_checked_in = len(col_c_data[col_c_data.astype(str).str.strip() != ''])

# 2. How many books appeared (number of 《》 pairs)
all_books = []
for text in col_c_data.astype(str):
    books = re.findall(r'《(.*?)》', text)
    all_books.extend(books)

total_books = len(all_books)

# 3. How many duplicate books & their names
book_counts = Counter(all_books)
duplicate_books = {book: count for book, count in book_counts.items() if count > 1}
duplicate_book_types = len(duplicate_books)

print(f"Number of people checked in: {num_people_checked_in}")
print(f"Total books appeared: {total_books}")
print(f"Number of duplicate books: {duplicate_book_types}")
print("Duplicate books list:")
for book, count in duplicate_books.items():
    print(f"《{book}》: {count}次")

#4 total books in whole csv
# Get all cells from column C onwards, flatten to a single Series, then drop NaN
all_cells = df.iloc[:, 2:21].stack().dropna().astype(str)  # Column C (index 2) to T (index 19)
all_cells = all_cells[all_cells.str.strip() != '']

all_books_csv = []
for text in all_cells:
    books = re.findall(r'《(.*?)》', text)
    all_books_csv.extend(books)

total_books_csv = len(all_books_csv)
print(f"Total books in whole csv: {total_books_csv}")