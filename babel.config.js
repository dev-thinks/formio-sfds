module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ],
  plugins: [
    ['@babel/plugin-proposal-optional-chaining', {
    }],
    ['@babel/plugin-transform-runtime', {
      regenerator: true
    }],
    ['babel-plugin-lodash', {
    }]
  ]
}
