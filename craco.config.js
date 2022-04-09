const { loaderByName, addBeforeLoader } = require("@craco/craco");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const workerLoader = {
        loader: require.resolve("worker-loader"),
        options: {
          test: /\.worker\.js$/,
        },
      };

      addBeforeLoader(webpackConfig, loaderByName("file-loader"), workerLoader);

      return webpackConfig;
    },
    plugins: {
      add: [
        new CopyPlugin([
          {
            from: "node_modules/@dibgram/tdweb/dist/**/*",
            to: "./",
            flatten: true,
            ignore: ["tdweb.js"],
          },
        ]),
      ],
    },
  },
};
