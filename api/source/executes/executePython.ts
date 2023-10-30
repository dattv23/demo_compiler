import { exec } from 'child_process';
import { spawn } from 'child_process';

export const executePython = async (filePath: string, inputParamsArray: string[][]) => {
      const results = [];

      for (const inputParams of inputParamsArray) {
            const input = inputParams.join(" ");
            const command = `py ${filePath}`;

            const pythonProcess = spawn('py', [filePath], { stdio: 'pipe' });

            for (const param of inputParams) {
                  pythonProcess.stdin.write(param + '\n');
            }

            pythonProcess.stdin.end();

            const result = await new Promise((resolve, reject) => {
                  let output = '';
                  let error = '';

                  pythonProcess.stdout.on('data', (data) => {
                        output += data;
                  });

                  pythonProcess.stderr.on('data', (data) => {
                        error += data;
                  });

                  pythonProcess.on('close', (code) => {
                        if (code === 0) {
                              resolve(output);
                        } else {
                              reject({ error: `Python process exited with code ${code}`, stderr: error });
                        }
                  });
            });

            results.push(result);
      }

      return results;
};
