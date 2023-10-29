import { exec } from 'child_process';
import path from 'path';

export const executeJava = async (filePath: string) => {
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

                  // Step 3: Run the Java program
                  exec(`java ${name}`, (runError, runStdout, runStderr) => {
                        if (runError || runStderr) {
                              reject({ runError, runStderr });
                              return;
                        }

                        resolve(runStdout);
                  });
            });
      })
            .catch((error) => {
                  throw error.stderr;
            });
};
