import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if available in browser
if (typeof window !== 'undefined') {
  try {
    // Provide reliable worker source
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Could not set pdfjs workerSrc:', e);
  }
}

export interface ParsedFileResult {
  fileName: string;
  fileSize: number;
  mimeType: string;
  extractedText: string;
  fileList?: string[];
}

/**
 * Extracts text from PDF using pdfjs-dist with defensive fallbacks
 */
async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedarray = new Uint8Array(arrayBuffer);

    // 1. Try standard pdfjs-dist getDocument
    const loadingTask = (pdfjsLib as any).getDocument({
      data: typedarray,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 10);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .filter((str: string) => str.trim().length > 0);
      
      fullText += pageStrings.join(' ') + '\n\n';
    }

    if (fullText.trim().length > 30) {
      return fullText.trim();
    }
  } catch (pdfErr) {
    console.warn('pdfjs-dist parsing failed or unavailable, using stream text scanner:', pdfErr);
  }

  // 2. Secondary fallback: Stream scan printable characters & PDF text tokens
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let rawStr = '';
    const scanLimit = Math.min(uint8.length, 100000);
    
    for (let i = 0; i < scanLimit; i++) {
      const c = uint8[i];
      if ((c >= 32 && c <= 126) || c === 10 || c === 13 || c === 9) {
        rawStr += String.fromCharCode(c);
      } else if (c === 0 && rawStr.length > 0 && rawStr[rawStr.length - 1] !== ' ') {
        rawStr += ' ';
      }
    }

    // Extract text inside parentheses (PDF string literals like `(John Doe) Tj`)
    const pdfTextMatches = rawStr.match(/\(([^\(\)\\]{2,100})\)\s*(?:Tj|TJ|\')/g);
    if (pdfTextMatches && pdfTextMatches.length > 5) {
      const extractedLiterals = pdfTextMatches
        .map(m => m.replace(/^\(/, '').replace(/\)\s*(?:Tj|TJ|\')$/, ''))
        .join(' ');
      if (extractedLiterals.trim().length > 40) {
        return extractedLiterals.trim();
      }
    }

    // Filter printable chunks
    const chunks = rawStr
      .split(/[\r\n\x00]+/)
      .map(s => s.trim())
      .filter(s => s.length > 3 && !s.startsWith('/Filter') && !s.startsWith('<<') && !s.includes('endobj'));

    if (chunks.length > 5) {
      return chunks.join('\n').slice(0, 20000);
    }
  } catch (err) {
    console.warn('PDF stream scanner fallback failed:', err);
  }

  return '';
}

/**
 * Extracts plain text from DOCX (Office Open XML) file
 */
async function extractDocxText(file: File): Promise<string> {
  try {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);
    const docEntry = loadedZip.file('word/document.xml') || loadedZip.file('word/document2.xml');
    
    if (docEntry) {
      const xmlString = await docEntry.async('string');
      // Simple regex parser for XML text tags (<w:t>...</w:t> and <w:p>...</w:p>)
      const paragraphs = xmlString.split(/<\/w:p>/gi);
      const textLines: string[] = [];

      for (const p of paragraphs) {
        const textMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/gi);
        if (textMatches) {
          const line = textMatches
            .map(t => t.replace(/<[^>]+>/g, ''))
            .join('');
          if (line.trim().length > 0) {
            textLines.push(line.trim());
          }
        }
      }

      if (textLines.length > 0) {
        return textLines.join('\n');
      }

      // Stripped XML fallback
      const clean = xmlString.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.length > 30) {
        return clean;
      }
    }
  } catch (e) {
    console.warn('Failed to parse DOCX:', e);
  }
  return '';
}

/**
 * Safely extracts text or inspects files uploaded by the user on the client side
 */
export async function parseUploadedFile(file: File): Promise<ParsedFileResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const mimeType = file.type || 'application/octet-stream';
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // 1. Plain text / Markdown / JSON / Code
  if (['txt', 'md', 'json', 'csv', 'py', 'ts', 'js', 'html', 'css', 'yaml', 'yml', 'log', 'rtf'].includes(ext) || file.type.startsWith('text/')) {
    try {
      const text = await file.text();
      // If RTF, strip control words
      const cleanText = ext === 'rtf' ? text.replace(/\\par/g, '\n').replace(/\\[a-zA-Z0-9\-]+/g, '').replace(/[{}\\]/g, '').trim() : text;
      return {
        fileName,
        fileSize,
        mimeType,
        extractedText: cleanText.slice(0, 50000)
      };
    } catch (e) {
      console.warn('Text file read error:', e);
    }
  }

  // 2. PDF Document
  if (ext === 'pdf' || mimeType.includes('pdf')) {
    const pdfText = await extractPdfText(file);
    if (pdfText && pdfText.trim().length > 20) {
      return {
        fileName,
        fileSize,
        mimeType: 'application/pdf',
        extractedText: pdfText
      };
    }
  }

  // 3. DOCX Document
  if (ext === 'docx' || mimeType.includes('wordprocessingml') || mimeType.includes('officedocument')) {
    const docxText = await extractDocxText(file);
    if (docxText && docxText.trim().length > 20) {
      return {
        fileName,
        fileSize,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extractedText: docxText
      };
    }
  }

  // 4. Legacy DOC or binary document fallback
  if (ext === 'doc') {
    try {
      const docText = await extractDocxText(file);
      if (docText) {
        return { fileName, fileSize, mimeType, extractedText: docText };
      }
    } catch (e) {
      // Ignore
    }
  }

  // 5. ZIP archive inspection
  if (ext === 'zip' || mimeType.includes('zip')) {
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file);
      const fileList: string[] = [];
      let combinedCodeText = '';
      let fileCount = 0;

      for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
        if (!zipEntry.dir) {
          fileList.push(relativePath);
          fileCount++;
          const innerExt = relativePath.split('.').pop()?.toLowerCase();
          if (fileCount <= 15 && innerExt && ['py', 'ts', 'js', 'json', 'md', 'txt', 'html', 'css', 'yaml', 'yml', 'sql', 'tf', 'hcl', 'log'].includes(innerExt)) {
            const content = await zipEntry.async('string');
            combinedCodeText += `\n--- File: ${relativePath} ---\n${content.slice(0, 4000)}\n`;
          }
        }
      }

      return {
        fileName,
        fileSize,
        mimeType: 'application/zip',
        fileList,
        extractedText: `ZIP Archive: ${fileName}\nContained Files (${fileList.length}):\n${fileList.slice(0, 20).join('\n')}\n\nKey File Contents:\n${combinedCodeText}`
      };
    } catch (err) {
      console.warn('Failed to inspect zip file:', err);
    }
  }

  // Final fallback: Read raw printable string
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    let str = '';
    for (let i = 0; i < Math.min(uint8.length, 30000); i++) {
      const c = uint8[i];
      if ((c >= 32 && c <= 126) || c === 10 || c === 13) {
        str += String.fromCharCode(c);
      }
    }
    const cleaned = str.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleaned.length > 30) {
      return {
        fileName,
        fileSize,
        mimeType,
        extractedText: cleaned
      };
    }
  } catch (e) {
    console.warn('Raw byte reader failed:', e);
  }

  return {
    fileName,
    fileSize,
    mimeType,
    extractedText: `Document: ${fileName} (${(fileSize / 1024).toFixed(1)} KB)`
  };
}
