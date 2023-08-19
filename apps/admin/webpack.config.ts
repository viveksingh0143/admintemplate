import { Configuration } from "webpack";
import { merge } from "webpack-merge";

import CommonConfig from "./config/webpack.config.common";
import getDevConfig from "./config/webpack.config.dev";
import getProdConfig from "./config/webpack.config.prod";

export default (env: any, argv: any) => {
  if (env.production) {
    return merge<Configuration>(CommonConfig(__dirname), getProdConfig(__dirname));
  } else {
    return merge<Configuration>(CommonConfig(__dirname), getDevConfig(__dirname));
  }
};
