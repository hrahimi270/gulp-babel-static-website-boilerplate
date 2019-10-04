const { src, dest, watch, series, parallel, task } = require("gulp");

// js
const browserify = require("browserify");
const commonShake = require("common-shakeify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babelify = require("babelify");
const sourcemaps = require("gulp-sourcemaps");

// assets
const concatCss = require("gulp-concat-css");
const sassGlob = require("gulp-sass-glob");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const cleanCSS = require("gulp-clean-css");
const imagemin = require('gulp-imagemin');

// others
const liveServer = require("live-server");
const del = require("del");
const inject = require("gulp-inject");
const hash = require("gulp-hash-filename");

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
  del.sync("build");
  return done();
}

// bundle javascripts
function buildJavascriptDev() {
  var bundler = browserify("src/js/index.js", { debug: true })
    .transform(babelify)
    .plugin(commonShake);
  function rebundle() {
    return bundler
      .bundle()
      .on("error", function (err) {
        console.error(err);
        this.emit("end");
      })
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("."))
      .pipe(hash({ format: "{name}{ext}" }))
      .pipe(dest("build/js"));
  }

  return rebundle();
}
function buildJavascriptProd() {
  var bundler = browserify("src/js/index.js", { debug: false })
    .transform(babelify)
    .plugin(commonShake);
  function rebundle() {
    return bundler
      .bundle()
      .on("error", function (err) {
        console.error(err);
        this.emit("end");
      })
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(hash({ format: "{name}.{hash:8}{ext}" }))
      .pipe(dest("build/js"));
  }

  return rebundle();
}
function buildJavascriptProdMinify() {
  var bundler = browserify("src/js/index.js", { debug: false })
    .transform(babelify)
    .plugin(commonShake)
    .plugin("tinyify");

  function rebundle() {
    return bundler
      .bundle()
      .on("error", function (err) {
        console.error(err);
        this.emit("end");
      })
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(hash({ format: "{name}.{hash:8}{ext}" }))
      .pipe(dest("build/js"));
  }

  return rebundle();
}

// bundle styles
function buildScssDev() {
  return new Promise(resolve => {
    src("src/scss/main.scss")
      .pipe(
        sass(/* {
          includePaths: ["node_modules"]
        } */).on("error", sass.logError)
      )
      .pipe(sassGlob())
      .pipe(postcss(processors))
      .pipe(concatCss("main-styles.css"))
      .pipe(dest("build/css"));
    resolve();
  });
}
function buildCssDev() {
  return new Promise(resolve => {
    src("src/css/*.css")
      .pipe(postcss(processors))
      .pipe(concatCss("styles-customized.css"))
      .pipe(dest("build/css"));
    resolve();
  });
}
function buildScssProd() {
  return new Promise(resolve => {
    src("src/scss/main.scss")
      .pipe(sassGlob())
      .pipe(
        sass({
          includePaths: ["node_modules"]
        }).on("error", sass.logError)
      )
      .pipe(postcss(processors))
      .pipe(concatCss("main-styles.css"))
      .pipe(hash({ format: "{name}.{hash:8}{ext}" }))
      .pipe(dest("build/css"));
    resolve();
  });
}
function buildCssProd() {
  return new Promise(resolve => {
    src("src/css/*.css")
      .pipe(postcss(processors))
      .pipe(concatCss("styles-customized.css"))
      .pipe(hash({ format: "{name}.{hash:8}{ext}" }))
      .pipe(dest("build/css"));
    resolve();
  });
}
function buildScssProdMinify() {
  return new Promise(resolve => {
    src("src/scss/main.scss")
      .pipe(sassGlob())
      .pipe(
        sass({
          includePaths: ["node_modules"]
        }).on("error", sass.logError)
      )
      .pipe(postcss(processors))
      .pipe(concatCss("main-styles.css"))
      .pipe(
        cleanCSS({ debug: false }, details => {
          console.log(
            `SCSS styles, from ${Math.round(
              details.stats.originalSize / 1024
            )}kb gets to ${Math.round(details.stats.minifiedSize / 1024)}kb`
          );
        })
      )
      .pipe(hash({ format: "{name}.{hash:8}{ext}" }))
      .pipe(dest("build/css"));
    resolve();
  });
}
function buildCssProdMinify() {
  return new Promise(resolve => {
    src("src/css/*.css")
      .pipe(postcss(processors))
      .pipe(concatCss("styles-customized.css"))
      .pipe(
        cleanCSS({ debug: false }, details => {
          console.log(
            `SCSS styles, from ${Math.round(
              details.stats.originalSize / 1024
            )}kb gets to ${Math.round(details.stats.minifiedSize / 1024)}kb`
          );
        })
      )
      .pipe(hash({ format: "{name}.{hash:8}{ext}" }))
      .pipe(dest("build/css"));
    resolve();
  });
}

// copy html files
function copyHTML() {
  return src("src/pages/*.html").pipe(dest("build"));
}

// copy images
function copyImages() {
  return src("src/images/*").pipe(dest("build/images"));
}
function copyImagesWithOptimization() {
  return src("src/images/*")
    .pipe(imagemin())
    .pipe(dest("build/images"));
}

// copy fonts
function copyFonts() {
  return src("src/fonts/*").pipe(dest("build/fonts"));
}

// inject css and javascript
function injection() {
  return src("build/*.html")
    .pipe(inject(src("build/css/*.css", { read: false }), { relative: true }))
    .pipe(inject(src("build/js/*.js", { read: false }), { relative: true }))
    .pipe(dest("build"));
}

// watch for any, any change!
function watchFiles() {
  watch("src/js/*.js", buildJavascriptDev);
  watch("src/scss/*.scss", buildScssDev);
  watch("src/css/*.css", buildCssDev);
  watch("src/pages/*.html", series(copyHTML, injection));
  watch("src/images/*", copyImages);
  watch("src/fonts/*", copyFonts);
}

// serve
task("serve", () => {
  var params = {
    port: 3000,
    host: "0.0.0.0",
    root: "build",
    open: true
  };

  // start the live server
  liveServer.start(params);
  watchFiles();
});

// main tasks
function start() {
  return series(
    cleanDest,
    copyHTML,
    copyImages,
    copyFonts,
    parallel(buildJavascriptDev, buildScssDev, buildCssDev),
    injection,
    "serve"
  );
}
function dev() {
  return series(
    cleanDest,
    copyHTML,
    copyImagesWithOptimization,
    copyFonts,
    parallel(buildJavascriptProd, buildScssProd, buildCssProd),
    injection
  );
}
function prod() {
  return series(
    cleanDest,
    copyHTML,
    copyImagesWithOptimization,
    copyFonts,
    parallel(
      buildJavascriptProdMinify,
      buildScssProdMinify,
      buildCssProdMinify
    ),
    injection
  );
}

// tasks
exports.start = start();
exports.dev = dev();
exports.build = prod();

// default task
exports.default = start();
