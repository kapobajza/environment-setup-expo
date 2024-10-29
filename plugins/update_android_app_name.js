const { withPlugins, withStringsXml } = require('@expo/config-plugins');
const { ExpoConfig } = require('@expo/config-types');

/**
 * @param {string} appName
 * @returns {(config: ExpoConfig) => ExpoConfig}
 */
const withModifiedAndroidAppName = (appName) => (c) => {
  return withStringsXml(c, (config) => {
    for (const str of config.modResults.resources.string || []) {
      if (str.$.name === 'app_name') {
        str._ = appName;
      }
    }

    return config;
  });
};

module.exports = (config, args) => {
  return withPlugins(config, [withModifiedAndroidAppName(args.appName)]);
};
