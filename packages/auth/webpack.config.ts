import path from 'path';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { Configuration, WebpackPluginInstance } from "webpack";

import HTMLWebpackPlugin from 'html-webpack-plugin';
// create css file per js file: https://webpack.kr/plugins/mini-css-extract-plugin/
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const devServer: DevServerConfiguration = {
  hot: true,
  port: 3000,
  historyApiFallback: true,
};


const isDevelopment = process.env.NODE_ENV !== 'production';
// define plugins
const plugins: WebpackPluginInstance[] = [
  new HTMLWebpackPlugin({
    template: './public/index.html', // you have to have the template file
  }),
];
isDevelopment
  ? plugins.push(new ReactRefreshWebpackPlugin())
  : plugins.push(new MiniCssExtractPlugin());

const config: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  devServer,
  // entry: './src/index.ts', // codes will be inside src folder
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: "/",
    filename: 'index.js',
    // more configurations: https://webpack.js.org/configuration/
  },
  plugins,
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    // automatically resolve certain extensions (Ex. import './file' will automatically look for file.js)
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@ctypes': path.resolve(__dirname, './src/ctypes'),
      '@database': path.resolve(__dirname, './src/database'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i, // .sass or .scss
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // for Tailwind CSS
          'postcss-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
};

export default config;
