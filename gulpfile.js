import gulp from 'gulp';
import { webpackDev, webpackProd } from './gulpfileWebpack.js';
export { webpackDev, webpackProd } from './gulpfileWebpack.js';
import { bsStyles, bsStylesMin, purgeCSS } from './gulpfileStyles.js';
export { bsStyles, bsStylesMin, purgeCSS } from './gulpfileStyles.js';
import { webpackBsDev } from './gulpfileWebpack.js';
export { webpackBsDev } from './gulpfileWebpack.js';
import { webpackBsProd } from './gulpfileWebpack.js';
export { webpackBsProd } from './gulpfileWebpack.js';
import { webpackTwDev } from './gulpfileWebpack.js';
export { webpackTwDev } from './gulpfileWebpack.js';
import { webpackTwProd } from './gulpfileWebpack.js';
export { webpackTwProd } from './gulpfileWebpack.js';
import { vendorJS } from './gulpfileSripts.js';
export { vendorJS } from './gulpfileSripts.js';
import { vendorJSProd } from './gulpfileSripts.js';
export { vendorJSProd } from './gulpfileSripts.js';
import sync from 'browser-sync';
import { deleteAsync } from 'del';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import preprocess from 'gulp-preprocess';
// import pugMain from 'pug';
// import fs from 'fs/promises';
// import { glob } from 'glob';

const browserSync = sync.create('localServer');
let syncMode = false;
let prodMode = false;
let tw = false;

const enableSync = () => Promise.resolve(syncMode = true);
const setModeProd = () => Promise.resolve(prodMode = true);
const enableTailwind = () => Promise.resolve(tw = true);

export const clean = async () => {
    // const destPath = prodMode ? './build/**/*' : './templates/**/*';
    return await deleteAsync(['./build/**/*', './templates/**/*']);
};

export const html = () => {
    const destPath = prodMode ? './build/' : './templates/';
    return gulp.src('./src/*.html')
        .pipe(preprocess({ context: { NODE_ENV: prodMode ? 'production' : 'development' } }))
        .pipe(gulp.dest(destPath))
        .pipe(browserSync.stream());
};

export const pugTask = () => {
    const destPath = prodMode ? './build/' : './templates/';
    return gulp.src('./src/*.pug')
        .pipe(plumber())
        .pipe(preprocess({ context: { NODE_ENV: prodMode ? 'production' : 'development' } }))
        .pipe(pug({
            locals: {
                mode: prodMode
            }
        }))
        .pipe(gulp.dest(destPath))
        .pipe(browserSync.stream());
};

// export const pugTask = async () => {
//     const cwd = './src/';
//     const files = await glob('*.pug', {
//         cwd: cwd
//     });
//     return files.forEach(file => {
//         const outputFileName = file.split('.').slice(0, -1).join() + "." + 'html';
//         fs.writeFile(`./build/${outputFileName}`, pugMain.renderFile(`${cwd}${file}`))
//             .then(() => {
//                 console.log(`File written successfully!`);
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     });
// };

export const images = async () => {
    const destPath = prodMode ? './build/images' : './templates/images';
    return gulp.src('./src/images/**/*')
        .pipe(gulp.dest(destPath))
        .pipe(browserSync.stream());
};

export const fonts = async () => {
    const destPath = prodMode ? './build/fonts' : './templates/fonts';
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest(destPath))
        .pipe(browserSync.stream());
};

export const watch = () => {
    console.log('syncMode - ', syncMode);

    gulp.watch('./src/**/*.pug', () => pugTask())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    gulp.watch('./src/*.html', () => html())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    gulp.watch('./src/images/**/*', () => images())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    gulp.watch('./src/fonts/**/*', () => fonts())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    gulp.watch('./src/vendorJS/**/*.js', () => vendorJS())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    gulp.watch('./src/script/*.js', () => !tw ? webpackDev() : webpackTwDev())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    gulp.watch(['./src/styles/**/*.scss', './src/styles/**/*.css'], () => !tw ? webpackDev() : webpackTwDev())
        .on('change', (path) => console.log(`File ${path} was changed`))
        .on('unlink', (path) => console.log(`File ${path} was removed`))
        .on('add', (path) => console.log(`File ${path} was added`));

    syncMode && browserSync.init({ server: { baseDir: "./templates/" } });
};

/* dev mode with browserSync */
export const devBs = gulp.series(
    enableSync,
    clean,
    gulp.parallel(pugTask, html, vendorJS, images, fonts, webpackBsDev),
    webpackDev,
    watch
);

/* dev mode with tailwind, browserSync */
export const devTw = gulp.series(
    enableTailwind,
    enableSync,
    clean,
    gulp.parallel(pugTask, html, vendorJS, images),
    webpackTwDev,
    watch
);

/* dev mode w/o bootstrap with browserSync */
export const dev = gulp.series(enableSync, clean, gulp.parallel(pugTask, html, vendorJS, images), webpackDev, watch);

/* compile and minify Bootstrap with purgeCSS */
export const bsProdPurge = gulp.series(
    gulp.parallel(webpackBsDev, webpackDev), gulp.parallel(bsStyles, webpackBsProd), purgeCSS, bsStylesMin
);

/* compile and minify Bootstrap w/o purgeCSS */
export const bsProd = gulp.series(
    gulp.parallel(webpackBsDev, webpackDev),
    gulp.parallel(bsStyles, webpackBsProd),
    bsStylesMin
);

/* minify everything (incl. Bootstrap) w/o purgeCSS */
export const minAll = gulp.series(
    setModeProd,
    clean,
    gulp.series(
        gulp.parallel(pugTask, html, vendorJSProd, images, fonts),
        bsProd,
        webpackProd
    ),
);

/* minify everything (incl. Bootstrap) with purgeCSS */
export const buildPurge = gulp.series(
    setModeProd,
    clean,
    gulp.series(
        gulp.parallel(pugTask, html, vendorJSProd, images, fonts),
        bsProdPurge,
        webpackProd
    )
);

/* minify all w/o bootstrap */
export const build = gulp.series(
    setModeProd,
    clean,
    gulp.series(gulp.parallel(pugTask, html, vendorJSProd, images, fonts), webpackProd)
);

/* minify all with tailwind */
export const buildTw = gulp.series(
    setModeProd,
    enableTailwind,
    clean,
    gulp.series(gulp.parallel(pugTask, html, vendorJSProd, images, fonts), webpackTwProd)
);

export default dev;
