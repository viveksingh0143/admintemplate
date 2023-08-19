import path from 'path';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { Configuration, WebpackPluginInstance } from "webpack";

import HTMLWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';


const getConfig = (rootPath: string) => {
  const devServer: DevServerConfiguration = {
    hot: true,
    port: 3000,
    historyApiFallback: true,
  };
  
  const plugins: WebpackPluginInstance[] = [
    new HTMLWebpackPlugin({
      template: './public/index.html', // you have to have the template file
    }),
    new ReactRefreshWebpackPlugin()
  ];
  
  const config: Configuration = {
    mode: 'development',
    devServer,
    // entry: './src/index.ts', // codes will be inside src folder
    output: {
      path: path.resolve(rootPath, 'build'),
      publicPath: "/",
      filename: 'index.js',
    },
    plugins
  };

  return config;
};

export default getConfig;
