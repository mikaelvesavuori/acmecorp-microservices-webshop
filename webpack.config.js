const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

console.log('Webpack config is in', __dirname);
console.log('slsw found Entries: ', slsw.lib.entries);

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    //library: 'index',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        include: /src/
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        include: /src/
      }
    ]
  }
};
