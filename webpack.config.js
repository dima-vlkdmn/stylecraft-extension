const path = require('path');
//const webpack = require('webpack');  
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background/index.ts',
    'side-panel': './src/side-panel/index.tsx',
    'content-script': './src/content-scripts/index.tsx',
    offscreen: './src/offscreen/offscreen.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (chunkData) =>
      chunkData.chunk.name === 'offscreen'
        ? 'offscreen/[name].js'
        : '[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // new webpack.IgnorePlugin({
    //   resourceRegExp: /background\/messengers/,
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json', to: 'manifest.json' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './assets/side-panel.html',
      filename: 'side-panel.html',
      chunks: ['side-panel'],
    }),

    new HtmlWebpackPlugin({
      template: './src/offscreen/offscreen.html',
      filename: 'offscreen/offscreen.html',
      chunks: ['offscreen'],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
  },
};
