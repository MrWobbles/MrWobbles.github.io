'use strict';

//Global Vars
const { gulp, watch, series, dest, src } = require('gulp');
const rename = require('gulp-rename');

const themeName = "Calvary-Tallula";
var fileinclude = require('gulp-file-include')

// Base Path for Antilles 2.0
const basePath = './';

// Base Path for Antilles 1.0
// const basePath = './';

const paths = {
  src: basePath + 'assets/src',
  dist: basePath + 'assets/dist',
  views: {
    src: './views/**',
    dist: './views'
  }
};

// JS Vars
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');

let scripts = {
  main: [
    paths.src + '/js/main.js'
  ]
}

// CSS Vars
var scss = require('gulp-dart-sass');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const pxtorem = require('postcss-pxtorem');

scss.compiler = require('sass');

// Image Vars
const imgPath = require("path");
const gulpCache = require("gulp-cache");
const squoosh = require('gulp-squoosh');

// Dotnet Vars
const spawn = require('child_process').exec;
const os = require('os');
const open = require('gulp-open');
const { minify } = require('uglify-js');

// CSS Processors
const processors = [
  autoprefixer({
    browsersList: ['last 3 versions', 'IOS 8'],
    remove: false
  }),
  pxtorem({
    rootValue: 16,
    unitPrecision: 5,
    propList: ['*'],
    replace: false
  })
];

function buildThemeStyles(cb) {

  src(paths.src + '/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(postcss(processors))
    .pipe(cleanCSS({
      level: {
        2: {
          specialComments: 0,
          mergeSemantically: true,
          removeUnusedAtRules: false,
          restructureRules: true
        }
      },
      compatibility: '*',
      advanced: true,
      ieBangHack: true,
      ieFilters: true,
      iePrefixHack: true,
      ieSuffixHack: true,
      sourceMap: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + '/css/'));

  cb();
}

// JS Processors
function buildScripts(cb) {
  // Main JS
  src(scripts.main)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + '/js'));

  cb();
}

// Image Processors
// https://squoosh.app/
function minifyImages(cb) {
  src(paths.src + '/images/*')
    .pipe(
      gulpCache(
        squoosh()
      )
    )
    .pipe(dest(paths.dist + '/images/'));

  cb();
}

function fileInclude(cb) {
  src(['./pages/**/*.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./'));

  cb();
}


// Site Functions
function watchToBuild() {
  watch([paths.src + '/**/*', './pages/'], series(buildScripts, buildThemeStyles, fileInclude));
}

exports.default = series(minifyImages, buildScripts, buildThemeStyles, fileInclude, watchToBuild);
exports.fileInclude = series(fileInclude);
