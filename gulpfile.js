var gulp = require('gulp'),
    gulp_concat = require('gulp-concat'),
    gulp_rename = require('gulp-rename'),
    gulp_minify = require('gulp-uglify'),
    gulp_minify_css = require('gulp-uglifycss');

var scripts = [
    'public/js/auth/auth.module.js',
    'public/js/auth/auth.service.js',
    'public/js/auth/auth.controller.js',
    'public/js/nav/nav.module.js',
    'public/js/nav/nav.controller.js',
    'public/js/posts/posts.module.js',
    'public/js/posts/posts.service.js',
    'public/js/posts/posts.controller.js',
    'public/js/main/main.module.js',
    'public/js/main/main.controller.js',
    'public/js/application.js',
];

gulp.task('concat-minify', function() {
    gulp.src(scripts)
        .pipe(gulp_concat('application.min.js'))
        .pipe(gulp_minify())
        .pipe(gulp.dest('public/js'));

    gulp.src('public/css/style.css')
        .pipe(gulp_minify_css())
        .pipe(gulp_rename('style.min.css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['concat-minify'], function(){});
