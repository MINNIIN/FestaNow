/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// firebase 관련 코드 수정 경고 콘솔에 안찍히게게
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0].includes("This method is deprecated") ||
    args[0].includes("Please use `getApp()` instead") ||
    args[0].includes("Method called was `collection`") ||
    args[0].includes("Method called was `doc`")
  ) {
    return;
  }
  originalWarn(...args);
};

AppRegistry.registerComponent(appName, () => App);
