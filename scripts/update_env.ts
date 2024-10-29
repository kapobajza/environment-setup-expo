import { getAppEnvArg, setAppEnv } from './util';

const appEnv = getAppEnvArg();

async function main() {
  setAppEnv(appEnv);
}

main();
