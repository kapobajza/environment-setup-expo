import { spawnSync } from 'child_process';
import prettier from 'prettier';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import { z } from 'zod';
import { CamelToPascalCase } from '@/types/common';
import yargs from 'yargs';
import { SpawnOptions, spawn } from 'child_process';

export const getProcessArgs = () => {
  return yargs(process.argv.slice(2));
};

export const getRootPath = () => spawnSync('git', ['rev-parse', '--show-toplevel']).stdout.toString().trim();

export const prettierFormatted = async (text: string, src: string) => {
  const prettierOptions = await prettier.resolveConfig(path.join(getRootPath(), '.prettierrc.js'));

  return prettier.format(text, {
    ...prettierOptions,
    filepath: src,
  });
};

export const setAppEnv = async (env: string) => {
  const rootPath = getRootPath();
  const srcEnvPath = path.resolve(rootPath, 'env', `.env.${env}`);
  const dotEnvContent = await fs.readFile(srcEnvPath, 'utf8');
  const destEnvPath = path.resolve(rootPath, '.env');

  const envJSContent = dotEnvContent
    .split('\n')
    .map((envLine) => envLine.replace('=', ': '))
    .join(',');

  const envToTS = `export default { 
    ${envJSContent} 
  } as const`;

  const envToJS = `module.exports = {
    ${envJSContent}
  };`;

  const configPath = path.resolve(rootPath, 'src', 'config');
  const envTSPath = path.resolve(configPath, 'env.ts');
  const envJSPath = path.resolve(configPath, 'env.js');

  await fs.writeFile(destEnvPath, dotEnvContent);
  console.log(chalk.green(`>>> Updated env file ${destEnvPath} <<<`));

  await fs.writeFile(envTSPath, await prettierFormatted(envToTS, envTSPath));
  console.log(chalk.green(`>>> Updated TS env file ${envTSPath} <<<`));

  // We need to create a JS file using CommonJS modules so that we can import it into app.config.js, otherwise
  // we would get an error
  await fs.writeFile(envJSPath, await prettierFormatted(envToJS, envJSPath));
  console.log(chalk.green(`>>> Updated JS env file ${envJSPath} <<<`));
};

const appEnvSchema = z.union([z.literal('stage'), z.literal('prod'), z.literal('dev')]).optional();

type AppEnvSchema = z.infer<typeof appEnvSchema>;

const AppEnv = {
  Dev: 'dev',
  Stage: 'stage',
  Prod: 'prod',
} satisfies Record<CamelToPascalCase<Exclude<AppEnvSchema, undefined>>, AppEnvSchema>;

export const getAppEnvArg = () => {
  const args = getProcessArgs().option('env', {
    alias: 'e',
    type: 'string',
    default: AppEnv.Dev,
  }).argv;

  appEnvSchema.parse(args.env);

  return args.env;
};

const platformSchema = z.union([z.literal('ios'), z.literal('android')]);

export const getPlatformArg = () => {
  const args = getProcessArgs().option('platform', {
    alias: 'p',
    type: 'string',
  }).argv;

  const res = platformSchema.safeParse(args.platform);

  if (res.error) {
    throw res.error;
  }

  return res.data;
};

export const spawnAsync = async (command: string, args: string[], options?: SpawnOptions) => {
  return new Promise<void>((resolve, reject) => {
    spawn(command, args, { ...options, stdio: 'inherit' }).on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" exited with code ${code}`));
      }
    });
  });
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
