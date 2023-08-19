import path from 'path';
import type { Configuration } from "webpack";

const getConfig = (rootPath: string) => {
  const config: Configuration = {
    resolve: {
      modules: [path.resolve(rootPath, './src'), 'node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
      alias: {
        '@app': path.resolve(rootPath, './src/app'),
        '@assets': path.resolve(rootPath, './src/assets'),
        '@components': path.resolve(rootPath, './src/components'),
        '@contexts': path.resolve(rootPath, './src/contexts'),
        '@ctypes': path.resolve(rootPath, './src/ctypes'),
        '@database': path.resolve(rootPath, './src/database'),
        '@layouts': path.resolve(rootPath, './src/layouts'),
        '@lib': path.resolve(rootPath, './src/lib'),
        '@pages': path.resolve(rootPath, './src/pages'),
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
  return config;
};

export default getConfig;
