import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const outputPath = path.join(__dirname.slice(0, __dirname.indexOf("\executes")), "outputs");

if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
}

export const executeCpp = async (filePath: string) => {
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
                        compileError && reject({ error: compileError, stderr: compileStderr });
                        compileStderr && reject(compileStderr);
                        exec(
                              `"${outPath}"`,
                              (runError, runStdout, runStderr) => {
                                    runError && reject({ runError, runStderr });
                                    runStderr && reject(runStderr);
                                    resolve(runStdout);
                              }
                        )

                  }
            );
      })
            .catch((error) => {
                  // console.error('Error executing C++:', error);
                  throw error.stderr;
            });
};