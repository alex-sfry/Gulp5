import gulp from 'gulp';

export const vendorJS = () => {
    return gulp.src('./src/vendorJS/**/*.js')
        .pipe(gulp.dest('./templates/js/'));
};

export const vendorJSProd = () => {
    return gulp.src('./src/vendorJS/**/*.js')
        .pipe(gulp.dest('./build/js/'));
};
