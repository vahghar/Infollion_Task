import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.PDFParse || pdfParseLib.default || pdfParseLib;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

async function extractText(file) {
  if (file.mimetype === 'application/pdf') {
    const parser = new pdfParse({ data: file.buffer });
    const data = await parser.getText();
    return data.text;
  } else if (file.mimetype === 'text/plain') {
    return file.buffer.toString('utf-8');
  }
  return "";
}

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}
export {
  model,
  extractText,
  fileToGenerativePart
};