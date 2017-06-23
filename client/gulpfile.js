require('babel-register');

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../dist/css'));
});

gulp.task('sass:watch', ['sass'], function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('scripts', function(){
  gulp.src('./js/main.js', {read: false})
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('../dist/js'))
    .on('error', function (error) {console.log(error); this.emit('end')});
});

gulp.task('scripts:watch', ['scripts'], function () {
  gulp.watch(['./js/**/*.js'], ['scripts']);
});

gulp.task('images', function() {
  gulp.src('./images/*')
  .pipe(gulp.dest('../dist/images/'));
});

gulp.task('images:watch', ['images'], function () {
  gulp.watch(['./images/*'], ['images']);
});

gulp.task('test', function () {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({}))
    .on('error', function (error) {console.log(error); this.emit('end')});
});

gulp.task('test:ci', function () {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({
    }))
})


gulp.task('test:watch', ['test'], function () {
  gulp.watch('./test/**/*.js', ['test']);
  gulp.watch('./js/**/*.js', ['test']);
});

gulp.task('build', ['sass', 'scripts'], function() {
});

gulp.task('default', ['sass:watch', 'scripts:watch', 'images:watch'], function () {
});
