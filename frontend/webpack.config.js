const path = require('path');

module.exports = {
  entry: './src/shortener/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'shortener.js',
    path: path.resolve(__dirname, 'public/js')
  }
};