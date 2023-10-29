import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const outputPath = path.join(__dirname.slice(0, __dirname.indexOf("\executes")), "outputs");

if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
}

export const executePython = async (filePath: string) => {
      const outputDir = `${outputPath}/python`;
      if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
      }
      return new Promise((resolve, reject) => {
            exec(
                  `py ${filePath}"`,
                  (error, stdout, stderr) => {
                        error && reject({ error, stderr });
                        stderr && reject(stderr);
                        resolve(stdout);
                  }
            );
      })
};