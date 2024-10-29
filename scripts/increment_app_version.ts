import fs from 'fs';
import path from 'path';
import lockfile from 'proper-lockfile';
import { getPlatformArg, getRootPath, prettierFormatted, sleep } from './util';

const platform = getPlatformArg();

async function incrementAppVersion() {
  const rootPath = getRootPath();
  const packageJsonPath = path.resolve(rootPath, 'package.json');

  let isLocked = await lockfile.check(packageJsonPath);

  while (isLocked) {
    isLocked = await lockfile.check(packageJsonPath);
    console.log(`Waiting for ${packageJsonPath} to be unlocked...`);
    await sleep(1000);
  }

  const release = await lockfile.lock(packageJsonPath);

  const packageJson: {
    bundle_version: string;
    version_code: string;
  } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const currentBundleVersion = parseInt(packageJson.bundle_version, 10);
  const currentVersionCode = parseInt(packageJson.version_code, 10);

  if (platform === 'ios') {
    packageJson.bundle_version = `${currentBundleVersion + 1}`;
  }

  if (platform === 'android') {
    packageJson.version_code = `${currentVersionCode + 1}`;
  }

  const formattedPackageJson = await prettierFormatted(JSON.stringify(packageJson), packageJsonPath);
  fs.writeFileSync(packageJsonPath, formattedPackageJson);
  await release();
}

incrementAppVersion();
