// main tasks
var gulp = require('gulp');
var serve = require('gulp-serve');
var ghPages = require('gulp-gh-pages');

gulp.task('serve', ['build', 'watch'], serve('./dist/public'));

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

gulp.task('clean', function() {
    gulp.src('dist/**/*')
        .pipe(rm());
});

// watch
var watch = require('gulp-watch');

gulp.task('build', ['less', 'render', 'assets']);

gulp.task('watch', function() {
    watch('app/**/*',['build']);
});

// sub tasks
var concat = require('gulp-concat');
var download = require("gulp-download");
var ext_replace = require('gulp-ext-replace');
var jsoncombine = require("gulp-jsoncombine");
var mustache = require("gulp-mustache");
var less = require('gulp-less');
var path = require('path');
var rename = require("gulp-rename");
var rm = require('gulp-rm')

gulp.task('fetch_topics', function() {
    return download("https://forum.gamedev.pl/latest.json")
      .pipe(rename("topics.json"))
      .pipe(gulp.dest('./dist'));
});

gulp.task('fetch_highlights', function() {
    return gulp.src("highlights/*.json")
        .pipe(jsoncombine("highlights.json", function(data) {
            return new Buffer(JSON.stringify(data));
         }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('fetch_jobs', function() {

});

gulp.task('fetch', ['fetch_topics', 'fetch_highlights', 'fetch_jobs'], function() {
    gulp.src(['dist/topics.json', 
              'dist/jobs.json', 
              'dist/highlights.json'])
         .pipe(jsoncombine("combined.json", function(data) {
             return new Buffer(JSON.stringify(data))
          }))
         .pipe(gulp.dest('./dist'));
});

gulp.task('render', function() {
    gulp.src("app/templates/**/*.mustache")
        .pipe(mustache("./dist/combined.json"))
        .pipe(ext_replace('.html'))
        .pipe(gulp.dest("./dist/public"));    
})

gulp.task('less', function() {
    return gulp.src('app/less/**/*.less')
        .pipe(less({
            paths : [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./dist/public/css'));
});

gulp.task('assets', function() {
    return gulp.src('app/assets/**/*')
        .pipe(gulp.dest('./dist/public/assets'));
});