// Defining requirements
var gulp = require( 'gulp' );
var minifycss = require('gulp-minify-css');
var plumber = require( 'gulp-plumber' );
var sass = require( 'gulp-sass' );
var watch = require( 'gulp-watch' );
var rename = require( 'gulp-rename' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var imagemin = require( 'gulp-imagemin' );
var ignore = require( 'gulp-ignore' );
var rimraf = require( 'gulp-rimraf' );
var sourcemaps = require( 'gulp-sourcemaps' );
var browserSync = require( 'browser-sync' ).create();
var del = require( 'del' );
var cleanCSS = require( 'gulp-clean-css' );
var gulpSequence = require( 'gulp-sequence' );
var replace = require( 'gulp-replace' );
var autoprefixer = require( 'gulp-autoprefixer' );
var expect = require('gulp-expect-file');

// Configuration file to keep your code DRY
var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

// Run:
// gulp sass
// Compiles SCSS files in CSS


// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes


/**
 * Ensures the 'imagemin' task is complete before reloading browsers
 * @verbose
 */
gulp.task( 'imagemin-watch', ['imagemin'], function( ) {
  browserSync.reload();
});

// Run:
// gulp imagemin
// Running image optimizing task
gulp.task( 'imagemin', function() {
    gulp.src( paths.imgsrc + '/**' )
    .pipe( imagemin() )
    .pipe( gulp.dest( paths.img ) );
});

// Run:
// gulp cssnano
// Minifies CSS files
gulp.task( 'cssnano', function() {
  return gulp.src( paths.css + '/theme.css' )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( plumber( {
            errorHandler: function( err ) {
                console.log( err );
                this.emit( 'end' );
            }
        } ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( cssnano( { discardComments: { removeAll: true } } ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( paths.css ) );
});

gulp.task( 'minifycss', function() {
  return gulp.src( paths.css + '/theme.css' )
  .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( cleanCSS( { compatibility: '*' } ) )
    .pipe( plumber( {
            errorHandler: function( err ) {
                console.log( err ) ;
                this.emit( 'end' );
            }
        } ) )
    .pipe( rename( { suffix: '.min' } ) )
     .pipe( sourcemaps.write( './' ) )
    .pipe( gulp.dest( paths.css ) );
});

gulp.task( 'cleancss', function() {
  return gulp.src( paths.css + '/*.min.css', { read: false } ) // Much faster
    .pipe( ignore( 'theme.css' ) )
    .pipe( rimraf() );
});

gulp.task( 'styles2', function( callback ) {
    gulpSequence( 'sass', 'minifycss' )( callback );
} );

// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.







var config = {
    paths:{
        sass:{
            src:'src/sass/',
            dest:'dist/styles/'
        },
        js:{
            src:[
                'node_modules/jquery/dist/jquery.js',
                'node_modules/popper.js/dist/umd/popper.js',
                'node_modules/bootstrap/dist/js/bootstrap.js'
            ],
            dest:'dist/scripts/'
        }
    }
};

var files = {
    css: {
        build: [config.paths.sass.src +  '**/*.scss'],
        watch: [config.paths.sass.src +  '**/*.scss'],
        //sync: [config.paths.sass.src +  '**/*.scss']

    },
    js: {
        build: config.paths.js.src,
        // watch: "",
        // sync: "not in use"
    }
}
//gulp.task('default', ['scripts']);

gulp.task( 'xxx', function() {
    browserSync.init({
            proxy: "zakcnaan.local/"
    });
});

gulp.task('styles', function(){
    gulp.src( files.css.build)
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
      }}))
      .pipe(sourcemaps.init({loadMaps: true}))
        .pipe( sass( { errLogToConsole: true } ) )
        .pipe( autoprefixer( 'last 2 versions' ) )
        .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
      .pipe(gulp.dest(config.paths.sass.dest))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest(config.paths.sass.dest))
      //.pipe(browserSync.reload({stream:true}))
  });

  gulp.task('scripts', function(){
    return gulp.src(files.js.build)
    .pipe(expect(files.js.build))
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
      }}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest(config.paths.js.dest))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(config.paths.js.dest))
      //.pipe(browserSync.reload({stream:true}))
  });

  gulp.task( 'build', ['styles', 'scripts'], function() {} );

  gulp.task( 'watch', ['build'], function() {
    gulp.watch( files.css.watch , ['styles'] );
    //gulp.watch( [paths.dev + '/js/**/*.js', 'js/**/*.js', '!js/theme.js', '!js/theme.min.js'], ['scripts'] );

    //Inside the watch task.
    //gulp.watch( paths.imgsrc + '/**', ['imagemin-watch'] );
});

gulp.task( 'x5', function() {
    browserSync.init( ['./dist/**/*.*'], cfg.browserSyncOptions );
});

gulp.task( 'x7', ['x5', 'watch'], function() {
    //browserSync.init( ['./dist/**/*.*'], cfg.browserSyncOptions );
});

  gulp.task('browser-sync', function() {
    // browserSync.init({
    //     server: "./"
    // });
    browserSync.init( 
        {
            "proxy": "zakcnaan.local/",
            "notify": false
        }
     );
    // browserSync({
    //   server: {
    //      baseDir: "./"
    //   }
    // });
  });
  
//   gulp.task('bs-reload', function () {
//     browserSync.reload();
//   });

gulp.task('sync2', ['browser-sync'], function(){
    gulp.watch([config.paths.sass.src +  '**/*.scss'], ['styles']);
    //gulp.watch("src/scripts/**/*.js", ['scripts']);
    //gulp.watch("*.html", ['bs-reload']);
  });

  // Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task( 'yyy', ['xxx', 'watch'], function() {
} );
