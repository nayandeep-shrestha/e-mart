import packageJson from '../../package.json';

export default function getAppVersion() {
  return packageJson.version;
}
