const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sharedLogicRoot = path.resolve(projectRoot, '../shared-logic');

const config = getDefaultConfig(projectRoot);

// Let Metro watch & bundle files inside shared-logic
config.watchFolders = [sharedLogicRoot];

// Look for node_modules in both places (handles transitive deps in shared-logic)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(sharedLogicRoot, 'node_modules'),
];

// Force react & react-native to always resolve from the app's node_modules
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
};

// Block Metro from bundling react/react-native from shared-logic's node_modules
// This prevents the duplicate React / useState=null crash
const sl = sharedLogicRoot.replace(/[/\\]/g, '[\\\\/]');
config.resolver.blockList = [
  new RegExp(`${sl}[\\\\/]node_modules[\\\\/]react[\\\\/].*`),
  new RegExp(`${sl}[\\\\/]node_modules[\\\\/]react-native[\\\\/].*`),
  new RegExp(`${sl}[\\\\/]node_modules[\\\\/]react-dom[\\\\/].*`),
];

module.exports = config;
