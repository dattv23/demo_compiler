import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

const outputPath = path.join(__dirname.slice(0, __dirname.indexOf("\executes")), "outputs");

if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
}

export const executeCpp = async (filePath: string, inputParamsArray: string[][]) => {
      const subId = path.basename(filePath).split('.')[0];
      const outputDir = `${outputPath}/cpp`;
      if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
      }
      const outPath = path.join(outputDir, `${subId}.exe`);

      return new Promise((resolve, reject) => {
            exec(`g++ ${filePath} -o "${outPath}"`, (compileError, compileStdout, compileStderr) => {
                  if (compileError || compileStderr) {
                        reject({ error: compileError, stderr: compileStderr });
                        return;
                  }

                  const results: string[] = [];

                  const processInputParams = (index: number) => {
                        if (index < inputParamsArray.length) {
                              const cppProcess = spawn(outPath, [], { stdio: 'pipe' });

                              for (const param of inputParamsArray[index]) {
                                    cppProcess.stdin.write(param + '\n');
                              }

                              cppProcess.stdin.end();

                              let output = '';
                              let error = '';

                              cppProcess.stdout.on('data', (data) => {
                                    output += data;
                              });

                              cppProcess.stderr.on('data', (data) => {
                                    error += data;
                              });

                              cppProcess.on('close', (code) => {
                                    if (code === 0) {
                                          results.push(output);
                                          processInputParams(index + 1);
                                    } else {
                                          reject({ error: `C++ process exited with code ${code}`, stderr: error });
                                    }
                              });
                        } else {
                              resolve(results);
                        }
                  };

                  processInputParams(0);
            });
      })
            .catch((error) => {
                  // console.error('Error executing C++:', error);
                  throw error.stderr;
            });
};
