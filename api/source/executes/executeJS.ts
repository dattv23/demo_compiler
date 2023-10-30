import { exec } from 'child_process';
import { spawn } from 'child_process';

export const executeJS = async (filePath: string, inputParamsArray: string[][]) => {
      const results = [];

      for (const inputParams of inputParamsArray) {
            const input = inputParams.join(" ");
            const command = `node ${filePath}`;

            const jsProcess = spawn('node', [filePath], { stdio: 'pipe' });

            for (const param of inputParams) {
                  jsProcess.stdin.write(param + '\n');
            }

            jsProcess.stdin.end();

            const result = await new Promise((resolve, reject) => {
                  let output = '';
                  let error = '';

                  jsProcess.stdout.on('data', (data) => {
                        output += data;
                  });

                  jsProcess.stderr.on('data', (data) => {
                        error += data;
                  });

                  jsProcess.on('close', (code) => {
                        if (code === 0) {
                              resolve(output);
                        } else {
                              reject({ error: `Node.js process exited with code ${code}`, stderr: error });
                        }
                  });
            });

            results.push(result);
      }

      return results;
};
