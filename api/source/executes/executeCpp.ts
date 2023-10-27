import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const outputPath = path.join(__dirname.slice(0, __dirname.indexOf("\executes")), "outputs");

if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
}

export const excuteCpp = (filePath: string) => {
      const subId = path.basename(filePath).split('.')[0];
      const outputDir = `${outputPath}/cpp`;
      if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
      }
      const outPath = path.join(outputDir, `${subId}.exe`);
      return new Promise((resolve, reject) => {
            exec(
                  `g++ ${filePath} -o "${outPath}"`,
                  (compileError, compileStdout, compileStderr) => {
                        if (compileError) {
                              reject({ error: compileError, stderr: compileStderr });
                        } else {
                              console.log('C++ compilation successful.');
                              exec(
                                    `"${outPath}"`,
                                    (runError, runStdout, runStderr) => {
                                          if (runError) {
                                                reject({ error: runError, stderr: runStderr });
                                          } else {
                                                resolve(runStdout);
                                          }
                                    }
                              );
                        }
                  }
            );
      })
            .catch((error) => {
                  console.error('Error executing C++:', error);
            });
};