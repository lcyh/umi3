module.exports = {
  extends: 'eslint-config-umi',
  parserOptions: {
    //关闭eslint对装饰器返回class的监测
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  rules: { 'jsx-no-multiline-js': 0 },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        map: [['@', './src']],
      },
    },
  },
};
