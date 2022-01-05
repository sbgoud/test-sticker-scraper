const { loaderByName, addBeforeLoader } = require("@craco/craco");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            const workerLoader = {
                loader: "worker-loader",
                options: {
                    test: /\.worker\.js$/,
                },
            };

            addBeforeLoader(webpackConfig, loaderByName("file-loader"), workerLoader);

            return webpackConfig;
        },
        plugins: {
            add: [
                new CopyPlugin({
                    patterns: [
                        {
                            from: "node_modules/tdweb/dist/**/*",
                            to: "[name][ext]",
                            globOptions: {
                                ignore: ["tdweb.js"],
                            },
                        },
                    ],
                }),
            ],
        },
    },
};
