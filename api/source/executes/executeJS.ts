import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export const executeJS = async (filePath: string) => {
      return new Promise((resolve, reject) => {
            exec(
                  `node ${filePath}`,
                  (error, stdout, stderr) => {
                        error && reject({ error, stderr });
                        stderr && reject(stderr);
                        resolve(stdout);
                  }
            );
      })
}