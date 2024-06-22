import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import purgecss from 'gulp-purgecss';

const sass = gulpSass(dartSass);

export const bsStyles = () => {
    return gulp.src('./src/styles/bootstrapSCSS/bootstrap.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./templates/css/'));
};

export const bsStylesMin = () => {
    const plugins = [cssnano()];
    return gulp.src('./templates/css/bootstrap.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css/'));
};

export const purgeCSS = () => {
    return gulp.src('./templates/css/bootstrap.css')
        .pipe(purgecss({
            content: [
                './build/**/*.js',
                './build/**/*.html',
            ],
            sourceMap: true
        }))
        .pipe(gulp.dest('./build/css/'));
};