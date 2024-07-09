import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default {
    mode: 'production',
    output: {
        filename: 'js/[name].min.js',
        // assetModuleFilename: 'images/[name][ext][query]',
        clean: false,
    },
    devtool: 'source-map',
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({ parallel: true }),
            new TerserPlugin({ parallel: true }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/, // Matches all CSS files
                use: [
                    MiniCssExtractPlugin.loader,
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