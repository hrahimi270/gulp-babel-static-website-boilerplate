const { src, dest, watch, series, parallel, task } = require('gulp')

// js
const browserify = require('browserify')
const commonShake = require('common-shakeify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babelify = require('babelify')
const sourcemaps = require('gulp-sourcemaps')

// css
const concatCss = require('gulp-concat-css')
const sassGlob = require('gulp-sass-glob')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// others
const liveServer = require('live-server');
const del = require('del')
const inject = require('gulp-inject')
// const hash = require('gulp-hash-filename')

// variables
var processors = [
    autoprefixer({
        overrideBrowserslist: [
            ">0.2%",
            "not dead",
            "not op_mini all",
            "cover 99.5%"
        ]
    }),
    cssnano()
];

// clean build dest
function cleanDest(done) {
    del.sync('build');
    return done();
}

// build development mode of javascripts
function buildJavascriptDev() {

    var bundler = browserify('src/js/index.js', { debug: true }).transform(babelify).plugin(commonShake);
    function rebundle() {
        return bundler
            .bundle()
            .on('error', function (err) { console.error(err); this.emit('end'); })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('.'))
            // .pipe(hash({ "format": "{name}.{hash:8}{ext}" }))
            .pipe(dest('build/js'))
    };

    return rebundle()
}

// build development styles
function buildScss() {
    return new Promise((resolve) => {
        src('src/scss/main.scss')
            .pipe(sourcemaps.init())
            .pipe(sassGlob())
            .pipe(sass({
                includePaths: ['node_modules']
            }).on('error', sass.logError))
            .pipe(postcss(processors))
            .pipe(concatCss('main-styles.css'))
            // .pipe(hash({ "format": "{name}.{hash:8}{ext}" }))
            .pipe(sourcemaps.write())
            .pipe(dest('build/css'))
        resolve();
    })
}
function buildCss() {
    return new Promise((resolve) => {
        src('src/css/*.css')
            .pipe(sourcemaps.init())
            .pipe(postcss(processors))
            .pipe(concatCss('styles-customized.css'))
            // .pipe(hash({ "format": "{name}.{hash:8}{ext}" }))
            .pipe(sourcemaps.write())
            .pipe(dest('build/css'))
        resolve();
    })
}

// copy html files
function copyHTML() {
    return src('src/pages/*.html')
        .pipe(dest('build'))
}

// inject css and javascript
function injection() {
    return src('build/*.html')
        .pipe(inject(src('build/css/*.css', { read: false }), { relative: true }))
        .pipe(inject(src('build/js/*.js', { read: false }), { relative: true }))
        .pipe(dest('build'))
}

// watch for any, any change!
function watchFiles() {
    watch('src/js/*.js', buildJavascriptDev, injection);
    watch('src/scss/*.scss', buildStylesDev, injection);
    watch('src/pages/*.html', series(copyHTML, injection));
}

// serve
task('serve', () => {
    var params = {
        port: 3000,
        host: "0.0.0.0",
        root: "build",
        open: true,

    };

    // start the live server
    liveServer.start(params);
    watchFiles();
});

// main tasks
function start() {
    return series(cleanDest, copyHTML, parallel(buildJavascriptDev, buildScss, buildCss), injection, 'serve');
}

exports.start = start();
exports.dev = () => { };
exports.build = () => { }

// default task
exports.default = start();