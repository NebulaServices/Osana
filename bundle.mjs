/*
  This code is kind of messy right now but I just wanted to get it done
*/

import { exec } from 'node:child_process';
import fs from 'node:fs';
import ora from 'ora';

const bundle = ora({
  prefixText: 'Bundling...'
}).start();

const webpack = exec('npx webpack --mode production', (error) => {
  if (error) {
    console.error(error);
    return;
  }
});

webpack.on('close', (s) => {
  bundle.succeed();
  minify();
});

function minify() {
  const files = fs.readdirSync('./dist');

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const minify = ora({
        prefixText: `Minifying ${file}...`
      }).start();

      const uglifyjs = exec(`npx uglifyjs ./dist/${file} -c -m -o ./dist/${file}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });

      uglifyjs.on('close', (s) => {
        minify.succeed();
      });
    }
  })
}