import { PDFDocument } from 'pdf-lib';

export async function processPDF(
  file: File, 
  onProgress?: (progress: number, status: string) => void
): Promise<Uint8Array> {
  onProgress?.(0, 'Loading PDF...');
  
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer);
  
  onProgress?.(10, 'Initializing output PDF...');
  const newPdf = await PDFDocument.create();
  
  const pageCount = originalPdf.getPageCount();
  
  // Copy all pages. We'll copy each page twice to the new document.
  // Wait, it's safer to loop through each page.
  for (let i = 0; i < pageCount; i++) {
    onProgress?.(10 + Math.round((i / pageCount) * 80), `Splitting page ${i + 1} of ${pageCount}...`);
    
    // Copy the current page twice
    const [leftPage, rightPage] = await newPdf.copyPages(originalPdf, [i, i]);
    
    // Get original dimensions and origin
    const originalBox = leftPage.getCropBox(); // This handles PDFs where origin is not (0,0)
    const halfWidth = originalBox.width / 2;
    
    // Set crop box and media box for left page
    leftPage.setCropBox(originalBox.x, originalBox.y, halfWidth, originalBox.height);
    leftPage.setMediaBox(originalBox.x, originalBox.y, halfWidth, originalBox.height);
    
    // Set crop box and media box for right page
    rightPage.setCropBox(originalBox.x + halfWidth, originalBox.y, halfWidth, originalBox.height);
    rightPage.setMediaBox(originalBox.x + halfWidth, originalBox.y, halfWidth, originalBox.height);
    
    // Add them to the new document
    newPdf.addPage(leftPage);
    newPdf.addPage(rightPage);
  }
  
  onProgress?.(95, 'Saving finalized PDF...');
  const pdfBytes = await newPdf.save();
  
  onProgress?.(100, 'Done!');
  return pdfBytes;
}
