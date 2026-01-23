import os
from pypdf import PdfReader

# Use relative path since we are running from C:\Users\sumeetmehra\Desktop\ncahp
docs_dir = os.path.join("docs", "required_changes")
output_file = "requirements_extracted.txt"

print(f"Looking for PDFs in: {os.path.abspath(docs_dir)}")

if not os.path.exists(docs_dir):
    print(f"Directory not found: {docs_dir}")
    exit(1)

pdf_files = [f for f in os.listdir(docs_dir) if f.endswith('.pdf')]
print(f"Found {len(pdf_files)} PDF files.")

with open(output_file, "w", encoding="utf-8") as out:
    for pdf_file in pdf_files:
        path = os.path.join(docs_dir, pdf_file)
        out.write(f"\n--- START OF FILE: {pdf_file} ---\n")
        try:
            reader = PdfReader(path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    out.write(text + "\n")
        except Exception as e:
            out.write(f"Error reading {pdf_file}: {e}\n")
        out.write(f"--- END OF FILE: {pdf_file} ---\n")
        
print(f"Extraction complete. Check {output_file}")
