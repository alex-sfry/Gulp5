import TerserPlugin from 'terser-webpack-plugin';

export default {
    mode: 'production',
    entry: {
        bootstrap: './src/script/bootstrapJS/bootstrap.js'
    },
    output: {
        filename: 'js/[name].min.js',
        clean: false,
    },
    devtool: 'source-map',
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({ parallel: true }),
        ],
    },
    plugins: [
    ],
    module: {
        rules: [
        ],
    },
};