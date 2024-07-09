export default {
    mode: 'development',
    output: {
        filename: 'js/[name].js',
        // assetModuleFilename: 'images/[name][ext][query]',
        clean: false,
    },
    devtool: 'source-map',
    optimization: {
        usedExports: true,
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Matches all CSS files
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env',
                                    'tailwindcss',
                                ],
                            },
                        },
                    },
                ],
            },
            // JavaScript
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};