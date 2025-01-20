module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // 다른 플러그인 추가 가능
    '@babel/plugin-transform-class-static-block',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};