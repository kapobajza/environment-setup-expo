import { getAppEnvArg, getPlatformArg, getProcessArgs, setAppEnv, spawnAsync } from './util';
import chalk from 'chalk';

const appEnv = getAppEnvArg();
const platform = getPlatformArg();

const args = getProcessArgs()
  .options({
    clean: {
      type: 'boolean',
      default: false,
    },
    release: {
      type: 'boolean',
      default: false,
    },
  })
  .parse();

async function main() {
  setAppEnv(appEnv);
  const additionalPrebuildArgs: string[] = [];
  const additionalRunArgs: string[] = [];

  if (args.clean) {
    additionalPrebuildArgs.push('--clean');
  }

  if (args.release) {
    additionalRunArgs.push(...(platform === 'ios' ? ['--configuration', 'Release'] : ['--variant', 'release']));
  }

  console.log(chalk.green(`>>> Prebuilding ${platform} app${args.clean ? ' (clean)' : ''} <<<`));
  await spawnAsync('yarn', ['expo', 'prebuild', ...additionalPrebuildArgs], {
    env: {
      ...process.env,
      EXPO_NO_GIT_STATUS: '1',
    },
  });
  console.log(chalk.green(`>>> Running ${platform} ${appEnv} app${args.release ? ' in release mode' : ''} <<<`));
  await spawnAsync('yarn', ['expo', `run:${platform}`, ...additionalRunArgs], {
    env: process.env,
  });
}

main();
