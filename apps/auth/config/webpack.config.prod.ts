import path from 'path';
import type { Configuration, WebpackPluginInstance } from "webpack";

import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';


const getConfig = (rootPath: string) => {

  const plugins: WebpackPluginInstance[] = [
    new HTMLWebpackPlugin({
      template: './public/index.html', // you have to have the template file
    }),
    new MiniCssExtractPlugin()
  ];
  const config: Configuration = {
    mode: 'production',
    // entry: './src/index.ts', // codes will be inside src folder
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: "/",
      filename: 'index.js',
    },
    plugins
  };
  return config;
}

export default getConfig;
