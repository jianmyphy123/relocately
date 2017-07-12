'use strict';

var config = require('./build/build.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pkg = require('./package');
var del = require('del');
var _ = require('lodash');
var eslint = require('gulp-eslint');
var cachebust = require('gulp-cache-bust');

//generate angular templates using html2js
gulp.task('templates', function() {
  console.log('tpl files: ', config.tpl);
  return gulp.src(config.tpl)
    .pipe($.changed(config.tmp))
    .pipe($.html2js('templates.js', {
      adapter: 'angular',
      name: 'templates',
      useStrict: true
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'templates'
    }));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence(['eslint', 'build', 'copy', 'copy:assets'], 'html', cb);
});

//build files for development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['templates'], cb);
});

//generate a minified css files, 2 js file, change theirs name to be unique, and generate sourcemaps
gulp.task('html', function() {
  //console.log('process.pwd=', gulp.process.pwd());

  var assets = $.useref({
    // transformPath: function(filePath) {
    //   return filePath.replace('/src/','/').replace('\\src\\','\\');
    // },
    //searchPath: ['../', '.']
    base: '../'
  });

  return gulp.src(config.index)
    .pipe(assets)
    .pipe($.sourcemaps.init())
    .pipe($.if('**/*main.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify({
      mangle: false
    })))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(['**/*main.js', '**/*main.css'], $.header(config.banner, {
      pkg: pkg
    })))
    //.pipe($.rev())
    //.pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.if('*.html', $.minifyHtml({
      empty: true
    })))
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'html'
    }));
});

//copy assets in dist folder
gulp.task('copy:assets', function() {
  return [gulp.src(config.assets, {
      dot: true
    }).pipe(gulp.dest(config.dist + '/assets'))
    .pipe($.size({
      title: 'copy:assets'
    })),
    gulp.src(config.fonts, {
    dot: true
  }).pipe(gulp.dest(config.dist + '/assets/fonts'))
    .pipe($.size({
      title: 'copy:fonts'
    })) ];
});

//copy assets in dist folder
gulp.task('copy', function() {
  return gulp.src([
      config.base + '/*',
      '!' + config.base + '/*.html',
      '!' + config.base + '/src',
      '!' + config.base + '/test'
    ]).pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy'
    }));
});

//clean temporary directories
gulp.task('clean', del.bind(null, [config.dist, config.tmp]));

//lint files
gulp.task('eslint', function() {
  return gulp.src(config.js)
        .pipe(eslint({
          globals: [
            'jQuery',
            '$',
            'angular'
          ],
          envs: [
            'browser'
          ],
          configFile: 'eslint.rules.json'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/* tasks supposed to be public */


//default task
gulp.task('default', ['serve']); //

//run unit tests and exit
gulp.task('test:unit', ['build'], function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true
  }), cb);
});

//run the server after having built generated files, and watch for changes
gulp.task('serve', ['build'], function() {
  browserSync({
    port: config.port,
    ui: false,
    open: false,
    reloadDelay: 2000,
    notify: false,
    logPrefix: pkg.name,
    server: ['./src','.']
  });

  gulp.watch(config.html, reload);
  gulp.watch(config.less, ['less', reload]);
  gulp.watch(config.js, ['eslint']);
  gulp.watch(config.tpl, ['templates', reload]);
  gulp.watch(config.assets, reload);
});

//run the app packed in the dist folder
gulp.task('serve:dist', ['build:dist'], function() {
  browserSync({
    port: config.port,
    ui: {
      port: config.uiPort
    },
    notify: false,
    server: [config.dist]
  });
});
