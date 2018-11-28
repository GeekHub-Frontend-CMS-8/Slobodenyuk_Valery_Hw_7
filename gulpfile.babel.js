const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const del = require('del');
const plumber = require('gulp-plumber');

const server = browserSync.create();

export function reload(done) {
    server.reload();
    done();
}

export function serve(done) {
    server.init({
        server: {
            baseDir: './assets'
        }
    });
    done();
}

const baseFolder = {
    dev: 'dev/',
    dist: 'assets/'
};

const devFolder = {
    scss: baseFolder.dev + 'styles/',
    js: baseFolder.dev + 'js/',
    img: baseFolder.dev + 'img/'
};

const distFolder = {
    css: baseFolder.dist + 'css/',
    js: baseFolder.dist + 'js/',
    img: baseFolder.dist + 'img/'
};


const clean = () => del([ 'assets' ]);
export { clean };

export function styles() {
    return gulp.src(devFolder.scss + '**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distFolder.css))
}

export function scripts() {
    return gulp.src(devFolder.js + '**/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']  //npm install --save-dev babel-plugin-transform-runtime plugins: ['transform-runtime']
        }))
        // .pipe(concat('main.min.js'))
        // .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distFolder.js))
}

export function vendorScripts(){
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    // .pipe(uglify())
    // .pipe(concat('vendor.js'))
        .pipe(gulp.dest(distFolder.js + 'vendor'));
}

export function images() {
    return gulp.src(devFolder.img + '**/*', {since: gulp.lastRun(images)})
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(distFolder.img))
}

export function html() {
    return gulp.src(baseFolder.dev + '*.html')
        .pipe(gulp.dest(baseFolder.dist));
}
export function watch() {
    gulp.watch(baseFolder.dev + '*.html', gulp.series(html, reload));
    gulp.watch(devFolder.js, gulp.series(scripts, reload));
    gulp.watch(devFolder.scss, gulp.series(styles, reload));
    gulp.watch(devFolder.img + '**/*', gulp.series(images, reload));
}

const build = gulp.series(clean, gulp.parallel(html, styles, scripts, vendorScripts, images), serve, watch);
export { build };

/*
 * Export a default task
 */
export default build;




