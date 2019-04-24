module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'generator-star-spacing': 'off',
    'semi': 0, // 不检查分号
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
