from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import io
import fitz

# def parse_pdf(file_path):
#     """Extract text and images from a PDF file."""
#     texts, images = [], []
#     reader = PdfReader(file_path)

#     for page in reader.pages:
#         if page.extract_text():
#             texts.append(page.extract_text())

#     # Extract images
#     for page in reader.pages:
#         if "/XObject" in page["/Resources"]:
#             xObject = page["/Resources"]["/XObject"].get_object()
#             for obj in xObject:
#                 if xObject[obj]["/Subtype"] == "/Image":
#                     size = (xObject[obj]["/Width"], xObject[obj]["/Height"])
#                     data = xObject[obj].get_data()
#                     mode = "RGB"
#                     if xObject[obj]["/ColorSpace"] == "/DeviceRGB":
#                         mode = "RGB"
#                     img = Image.frombytes(mode, size, data)
#                     images.append(img)

#     return texts, images


# def parse_pdf(file_path):
#     """Extract text and images from PDF with error handling."""
#     texts = []
#     images = []
    
#     try:
#         doc = fitz.open(file_path)
        
#         for page_num, page in enumerate(doc, start=1):
#             # Extract text
#             text = page.get_text()
#             if text.strip():
#                 texts.append({
#                     'page': page_num,
#                     'content': text.strip()
#                 })
            
#             # Extract images with error handling
#             try:
#                 image_list = page.get_images(full=True)
                
#                 for img_index, img_info in enumerate(image_list):
#                     try:
#                         xref = img_info[0]
#                         base_image = doc.extract_image(xref)
                        
#                         if base_image:
#                             image_bytes = base_image["image"]
#                             # Use PIL to open the image directly from bytes
#                             image = Image.open(io.BytesIO(image_bytes))
                            
#                             images.append({
#                                 'page': page_num,
#                                 'image': image,
#                                 'index': img_index
#                             })
#                     except Exception as img_err:
#                         print(f"Warning: Could not extract image {img_index} from page {page_num}: {img_err}")
#                         continue
                        
#             except Exception as page_img_err:
#                 print(f"Warning: Could not process images from page {page_num}: {page_img_err}")
#                 continue
        
#         doc.close()
        
#     except Exception as e:
#         print(f"Error parsing PDF: {e}")
#         raise
    
#     return texts, images

def parse_pdf(file_path):
    """Extract only text from PDF (skip problematic images)."""
    texts = []
    images = []  # Return empty list
    
    doc = fitz.open(file_path)
    
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()
        if text.strip():
            texts.append({
                'page': page_num,
                'content': text.strip()
            })
    
    doc.close()
    return texts, images


def parse_docx(file_path):
    """Extract text and images from a DOCX file."""
    texts, images = [], []
    doc = Document(file_path)

    for para in doc.paragraphs:
        if para.text.strip():
            texts.append(para.text)

    # Extract images
    for rel in doc.part.rels.values():
        if "image" in rel.target_ref:
            img_bytes = rel.target_part.blob
            images.append(Image.open(io.BytesIO(img_bytes)))

    return texts, images
