import gulp from 'gulp';
import wpCompiler from 'webpack';
import webpack from 'webpack-stream';
import wpConfigProd from './webpack-gulp.prod.js';
import wpConfigDev from './webpack-gulp.dev.js';
import plumber from 'gulp-plumber';
import sync from 'browser-sync';

export const webpackProd = () => {
    return gulp.src('./src/script/main.js')
        .pipe(webpack(wpConfigProd))
        .pipe(gulp.dest('./build/'));
};

export const webpackDev = () => {
    const browserSync = sync.get('localServer');
    return gulp.src('./src/script/main.js')
        .pipe(plumber())
        .pipe(
            webpack(
                wpConfigDev,
                wpCompiler
            )
        )
        .pipe(gulp.dest('./templates/'))
        .pipe(browserSync.stream());
};
