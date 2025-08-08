// server/services/ocrService.js

const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process'); // Import Node.js's built-in tool
const util = require('util');

// Promisify execFile to use it with async/await
const execFilePromise = util.promisify(execFile);

const fileTypeFromFile = import('file-type').then(module => module.fileTypeFromFile);

// --- PASTE YOUR POPPLER BIN FOLDER PATH HERE ---
// IMPORTANT: Use double backslashes (\\) for the path.
const popplerBinaryPath = 'C:\\poppler\\poppler-24.02.0\\bin';


const extractTextFromFile = async (filePath) => {
  const type = await (await fileTypeFromFile)(filePath);

  if (type && type.mime === 'application/pdf') {
    const outputImageName = `${path.basename(filePath, '.pdf')}_page_1`;
    const outputImagePrefix = path.join(path.dirname(filePath), outputImageName);
    const outputImagePath = `${outputImagePrefix}.png`;

    // Define the exact command and its arguments
    const command = path.join(popplerBinaryPath, 'pdftocairo.exe');
    const args = [
      '-f', '1',          // First page to convert
      '-l', '1',          // Last page to convert
      '-png',             // Output as a PNG file
      filePath,           // The input file path
      outputImagePrefix,  // The output file path (without extension)
    ];

    try {
      console.log('True PDF file detected. Executing pdftocairo.exe directly...');

      // Execute the command directly
      await execFilePromise(command, args);

      if (!fs.existsSync(outputImagePath)) {
        throw new Error('Poppler command executed, but the output image was not created. Check permissions and the Poppler installation.');
      }

      console.log('Conversion successful. Starting OCR on the new image...');
      const { data: { text } } = await Tesseract.recognize(outputImagePath, 'eng');
      return text;

    } catch (error) {
      console.error('Error during direct PDF conversion or OCR:', error);
      throw new Error('Failed to process PDF file.');
    } finally {
      if (fs.existsSync(outputImagePath)) {
        fs.unlinkSync(outputImagePath);
        console.log(`Cleaned up temporary image: ${outputImagePath}`);
      }
    }
  } else {
    console.log('Image file detected. Starting OCR process...');
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
      return text;
    } catch (error) {
      console.error('Error during image OCR:', error);
      throw new Error('Failed to extract text from image.');
    }
  }
};

module.exports = {
  extractTextFromFile};