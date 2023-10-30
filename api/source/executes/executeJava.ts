import { exec } from 'child_process';
import path from 'path';
import { spawn } from 'child_process';

export const executeJava = async (filePath: string, inputParamsArray: string[][]) => {
      const name = path.basename(filePath).split('.')[0];

      return new Promise((resolve, reject) => {
            // Step 1: Compile the Java source code
            exec(`javac ${filePath}`, (compileError, compileStdout, compileStderr) => {
                  if (compileError || compileStderr) {
                        reject({ error: compileError, stderr: compileStderr });
                        return;
                  }

                  // Step 2: Change directory to where the Java file is
                  const javaDir = path.join(__dirname.slice(0, __dirname.indexOf("\\executes")), "codes", "java");
                  process.chdir(javaDir);

                  const results: string[] = [];

                  const processInputParams = (index: number) => {
                        if (index < inputParamsArray.length) {
                              const javaProcess = spawn('java', [name], { stdio: 'pipe' });

                              for (const param of inputParamsArray[index]) {
                                    javaProcess.stdin.write(param + '\n');
                              }

                              javaProcess.stdin.end();

                              let output = '';
                              let error = '';

                              javaProcess.stdout.on('data', (data) => {
                                    output += data;
                              });

                              javaProcess.stderr.on('data', (data) => {
                                    error += data;
                              });

                              javaProcess.on('close', (code) => {
                                    if (code === 0) {
                                          results.push(output);
                                          processInputParams(index + 1);
                                    } else {
                                          reject({ error: `Java process exited with code ${code}`, stderr: error });
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
                  throw error.stderr;
            });
};
