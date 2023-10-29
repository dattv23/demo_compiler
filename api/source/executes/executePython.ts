import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export const executePython = async (filePath: string) => {
      return new Promise((resolve, reject) => {
            exec(
                  `py ${filePath}`,
                  (error, stdout, stderr) => {
                        error && reject({ error, stderr });
                        stderr && reject(stderr);
                        resolve(stdout);
                  }
            );
      })
};