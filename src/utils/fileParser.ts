import JSZip from 'jszip';

export interface ParsedFileResult {
  fileName: string;
  fileSize: number;
  mimeType: string;
  extractedText: string;
  fileList?: string[];
}

/**
 * Safely extracts text or inspects files uploaded by the user on the client side
 */
export async function parseUploadedFile(file: File): Promise<ParsedFileResult> {
  const fileName = file.name;
  const fileSize = file.size;
  const mimeType = file.type || 'application/octet-stream';

  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // Plain text / Markdown / JSON / Code
  if (['txt', 'md', 'json', 'csv', 'py', 'ts', 'js', 'html', 'css', 'yaml', 'yml', 'log'].includes(ext) || file.type.startsWith('text/')) {
    const text = await file.text();
    return {
      fileName,
      fileSize,
      mimeType,
      extractedText: text.slice(0, 50000)
    };
  }

  // ZIP archive safe inspection
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
          // Extract text from text/code files inside the zip
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
      return {
        fileName,
        fileSize,
        mimeType: 'application/zip',
        extractedText: `Uploaded ZIP file: ${fileName} (${(fileSize / 1024).toFixed(1)} KB)`
      };
    }
  }

  // PDF or binary document: Read raw bytes as text or data preview
  if (ext === 'pdf' || ext === 'doc' || ext === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Basic text extraction from binary stream (printable characters)
      const uint8 = new Uint8Array(arrayBuffer);
      let text = '';
      for (let i = 0; i < Math.min(uint8.length, 60000); i++) {
        const charCode = uint8[i];
        if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
          text += String.fromCharCode(charCode);
        } else if (charCode === 0 && text.length > 0 && text[text.length - 1] !== ' ') {
          text += ' ';
        }
      }
      
      // Clean up extracted printable strings
      const cleaned = text
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleaned.length > 100) {
        return {
          fileName,
          fileSize,
          mimeType,
          extractedText: cleaned.slice(0, 30000)
        };
      }
    } catch (e) {
      console.warn('Binary read failed, using fallback text');
    }
  }

  // Generic fallback
  return {
    fileName,
    fileSize,
    mimeType,
    extractedText: `Document: ${fileName} (${(fileSize / 1024).toFixed(1)} KB)`
  };
}
