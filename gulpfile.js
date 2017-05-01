/*!
 * gulp
 * $ npm install gulp bootstrap browser-sync font-awesome gulp-header gulp-ruby-sass gulp-cssnano
  gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-cache jquery run-sequence del waypoints jquery-validation --save-dev
 */
// waypoints for study
var nameProject = 'PhotyTheme';

//  Base pathes
var basePaths = {
    modules: 'node_modules/',
    dev: nameProject + '/vendor/'
};

// browser-sync watched files
var browserSyncWatchFiles = [
    nameProject + '/css/*.min.css',
    nameProject + '/js/*.min.js',
    nameProject + '/*.html'
];

// browser-sync options
var browserSyncOptions = {
    server: {
      baseDir: nameProject // folder of your app/web project
    },
    notify: false
};

// Load plugins
var gulp        = require('gulp'),
    sass        = require('gulp-ruby-sass'),
    cssnano     = require('gulp-cssnano'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    imagemin    = require('gulp-imagemin'),
    cache       = require('gulp-cache'),
    notify      = require('gulp-notify'),
    header      = require('gulp-header');
var del         = require('del'),
    runSequence = require('run-sequence'),
    pkg         = require('./package.json'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload;

// Set banner
var banner = ['/*!\n',
    '* Bootstrap - <%= pkg.title %> version: <%= pkg.version %> \n',
    '* Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    '* Licesed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    '*/ \n\n',
    ''
  ].join('');

// gulp sass
// Compiles SCSS files in CSS
gulp.task('sass', function () {
    return sass( nameProject + '/scss/*.scss', { style: 'expanded',noCache: true}) //togliere sass.cache
        .pipe(header(banner, {pkg: pkg }))
        .pipe(gulp.dest( nameProject + '/css'))
        .pipe(notify('Wow Css is created! Well done!!'))
});

// gulp css-dev
// Minifies css files
gulp.task('css-dev', ['sass'], function () {
    gulp.src([
        basePaths.dev + 'css/bootstrap.min.css',
        basePaths.dev + 'css/font-awesome.min.css',
        //add here css you need[*]
        nameProject + '/css/animate.min.css',
        nameProject + '/css/flexslider.css',
        nameProject + '/css/slider.css',
        //end
        nameProject + '/css/theme.css'
        ])
        .pipe(concat('main.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest( nameProject + '/css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify('Css Minifies done! Go On!'))
});

// gulp scripts
// Uglifies and concat js files
gulp.task('scripts', function () {
    gulp.src([
        basePaths.dev + 'js/jquery.min.js',
        basePaths.dev + 'js/bootstrap.min.js',
        //add here js you need[*]
        basePaths.dev + 'js/jquery.easing.min.js',
        basePaths.dev + 'js/jquery.waypoints.min.js',
        //jquery.validate still learning
//        basePaths.dev + 'js/jquery.validate.min.js',
//        basePaths.dev + 'js/additional-methods.js',
        //custom validation
        nameProject + '/js/validate.js',

        nameProject + '/js/jquery.flexslider.js',
        nameProject + '/js/set-flexslider.js',
        //end
        nameProject + '/js/theme.js'
        ])
        .pipe(concat('main.min.js'))
// I don't know why... not working anymore
//        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest( nameProject + '/js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify('Js completed! Keep on going!'))
});

// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

// gulp watch
// Watcher task. Watcher runs gulp sass task on changes
gulp.task('watch', ['css-dev'], function () {
    gulp.watch( nameProject + '/scss/**/*.scss', ['css-dev']);
    gulp.watch( nameProject + '/css/*.min.css', reload);
    gulp.watch( [nameProject + '/js/**/*.js', '!'+ nameProject + '/js/main.min.js'], ['scripts']);
    gulp.watch( nameProject + '/js/*.min.js', reload);
    gulp.watch( nameProject + '/*.html', reload);
});

// gulp watch-bs
// Starts watcher with browser-sync.
gulp.task('watch-bs', ['browser-sync', 'watch'], function () { });

// gulp copy
// Copy all assets files from node_modules assets.
gulp.task('copy', function() {
    gulp.src(basePaths.modules + 'jquery/dist/jquery.min.js')
       .pipe(gulp.dest(basePaths.dev + 'js'));

    gulp.src(basePaths.modules + 'bootstrap/dist/js/*.min.js')
        .pipe(gulp.dest(basePaths.dev + 'js'));

    gulp.src(basePaths.modules + 'bootstrap/dist/js/*.min.js')
        .pipe(gulp.dest(basePaths.dev + 'js'));

    gulp.src(basePaths.modules + 'bootstrap/dist/css/bootstrap.min.css')
       .pipe(gulp.dest(basePaths.dev + 'css'));

    gulp.src(basePaths.modules + 'font-awesome/css/*.min.css')
        .pipe(gulp.dest(basePaths.dev + 'css'));

    gulp.src(basePaths.modules + 'font-awesome/fonts/**/*.{ttf,woff,woff2,eof,eot,otf,svg}')
        .pipe(gulp.dest(nameProject + '/fonts'));

    gulp.src(basePaths.modules + 'bootstrap/dist/fonts/*.{ttf,woff,woff2,eot,svg}')
        .pipe(gulp.dest(nameProject + '/fonts'));
    //add here css or js you need [*]
});

// gulp fonts
// Copy fonts from vendor to the dist folder
gulp.task('fonts', function(){
  return gulp.src( nameProject + '/fonts/**/*.{ttf,woff,woff2,eof,eot,otf,svg}')
             .pipe(gulp.dest('dist/fonts'))
});

// gulp images
// Images optimization
gulp.task('images', function(){
  return gulp.src( nameProject + '/img/**/*.+(png|jpg|gif|svg)')
             .pipe(cache(imagemin({interlaced: true})))
             .pipe(gulp.dest('dist/img'))
});

// gulp html
// move html files in the distribution folder
gulp.task('html', function(){
  return gulp.src( nameProject + '/*.html')
             .pipe(gulp.dest('dist'));
});

// gulp clean:dist
// Clean the dist folder
gulp.task('clean:dist', function(){
  return del.sync('dist/');
});

// gulp build
// Build task for the distribution
gulp.task('build', function (callback){
  runSequence('clean:dist',
    ['sass-dev', 'scripts'],
    'images', 'fonts', 'html',
    callback
  )
});

// gulp default
// Dafault task for developement
gulp.task('default', ['copy', 'watch-bs']);

//-------------- end basic gulpfile.js -----------------//

//--------------  From here:   ----------------//

// Contact (form) manage the email
// Copy folder mail with contact file
gulp.task('contact', function(){
  return gulp.src( nameProject + '/mail/**/*.*').
  pipe(gulp.dest('dist/mail'))
});

gulp.task('copy-extra', ['copy'], function(){
    // easing
    gulp.src(basePaths.modules + 'jquery.easing/jquery.easing.min.js')
        .pipe(gulp.dest(basePaths.dev + 'js'));
    // waypoints
    gulp.src(basePaths.modules + 'waypoints/lib/jquery.waypoints.min.js')
        .pipe(gulp.dest(basePaths.dev + 'js'));
    // validate (under-test)
    gulp.src(basePaths.modules + 'jquery-validation/dist/jquery.validate.min.js')
        .pipe(gulp.dest(basePaths.dev + 'js'));
    gulp.src(basePaths.modules + 'jquery-validation/dist/additional-methods.js')
        .pipe(gulp.dest(basePaths.dev + 'js'));
    // bootstrapValidation
    // gulp.src(basePaths.modules + 'bootstrap-validator/dist/validator.min.js')
    //     .pipe(gulp.dest(basePaths.dev + 'js')); //jbBootstrapValidation.js works
});
