export default {
    mode: 'development',
    entry: {
        bootstrap: './src/script/bootstrapJS/bootstrap.js'
    },
    output: {
        filename: 'js/[name].js',
        clean: false,
    },
    devtool: 'source-map',
    optimization: {
        usedExports: true,
        minimize: false,
    },
    plugins: [
    ],
    module: {
        rules: [
        ],
    },
};