// MUST be the very first import — installs global.localStorage polyfill
// required by shared-logic hooks (useAuth, useHomePagelogin, etc.)
import './src/utils/localStorageShim';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
