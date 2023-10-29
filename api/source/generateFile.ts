import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';

const uuid = v4;
const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
      fs.mkdirSync(dirCodes, { recursive: true });
}

export const generateFile = async (language: string, code: string) => {
      let subId = uuid();
      if (language === "javascript") language = "js";
      if (language === "c") language = "cpp";
      if (language == "java") subId = "Main";
      const filename = `${subId}.${language}`;
      const dirPath = `${dirCodes}/${language}`;
      if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
      }
      const filepath = path.join(dirPath, filename);
      await fs.writeFileSync(filepath, code);
      return filepath;
}

