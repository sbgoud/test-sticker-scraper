const { loaderByName, addBeforeLoader } = require("@craco/craco");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const workerLoader = {
                test: /\.worker\.js$/,
                use: { loader: require.resolve("worker-loader") },
            };

            addBeforeLoader(webpackConfig, loaderByName("file-loader"), workerLoader);

            return webpackConfig;
        },
        plugins: {
            add: [
                new CopyPlugin([
                    {
                        from: "node_modules/tdweb/dist/**/*",
                        to: "./",
                        flatten: true,
                        ignore: ["tdweb.js"],
                    },
                ]),
            ],
        },
    },
};
