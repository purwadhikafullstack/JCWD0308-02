import path from 'path';
import { fileURLToPath } from 'url';
import { unlink } from "fs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export function deleteFile(fileUrl: string) {
  const filename = getFilenameFromUrl(fileUrl);
  const filePath = path.join(__dirname, `../../public/images/${filename}`)
  unlink(filePath,
    (err => {
      if (err) console.log(err);
      else {
        console.log(`\nDeleted file: ${filePath}`);
      }
    }));
}

function getFilenameFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

function getBaseUrl(url: string): string {
  const urlObj = new URL(url);
  return urlObj.origin;
}