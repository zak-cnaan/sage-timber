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
gulp.task( 'browser-sync2', function() {
    browserSync.init( cfg.browserSyncWatchFiles, cfg.browserSyncOptions );
} );



// Run:
// gulp scripts.
// Uglifies and concat all JS files into one

// Deleting any file inside the /src folder
gulp.task( 'clean-source', function() {
  return del( ['src/**/*'] );
});

// Run:
// gulp copy-assets.
// Copy all needed dependency assets files from bower_component assets to themes /js, /scss and /fonts folder. Run this task after bower install or bower update


// Deleting the files distributed by the copy-assets task
gulp.task( 'clean-vendor-assets', function() {
  return del( [paths.dev + '/js/bootstrap4/**', paths.dev + '/sass/bootstrap4/**', './fonts/*wesome*.{ttf,woff,woff2,eot,svg}', paths.dev + '/sass/fontawesome/**', paths.dev + '/sass/underscores/**', paths.dev + '/js/skip-link-focus-fix.js', paths.js + '/**/skip-link-focus-fix.js', paths.js + '/**/popper.min.js', paths.js + '/**/popper.js', ( paths.vendor !== ''?( paths.js + paths.vendor + '/**' ):'' )] );
});

// Run
// gulp dist
// Copies the files to the /dist folder for distribution as simple theme
gulp.task( 'dist', ['clean-dist'], function() {
  return gulp.src( ['**/*', '!' + paths.bower, '!' + paths.bower + '/**', '!' + paths.node, '!' + paths.node + '/**', '!' + paths.dev, '!' + paths.dev + '/**', '!' + paths.dist, '!' + paths.dist + '/**', '!' + paths.distprod, '!' + paths.distprod + '/**', '!' + paths.sass, '!' + paths.sass + '/**', '!readme.txt', '!readme.md', '!package.json', '!package-lock.json', '!gulpfile.js', '!gulpconfig.json', '!CHANGELOG.md', '!.travis.yml', '!jshintignore',  '!codesniffer.ruleset.xml',  '*'], { 'buffer': true } )
  .pipe( replace( '/js/jquery.slim.min.js', '/js' + paths.vendor + '/jquery.slim.min.js', { 'skipBinary': true } ) )
  .pipe( replace( '/js/popper.min.js', '/js' + paths.vendor + '/popper.min.js', { 'skipBinary': true } ) )
  .pipe( replace( '/js/skip-link-focus-fix.js', '/js' + paths.vendor + '/skip-link-focus-fix.js', { 'skipBinary': true } ) )
    .pipe( gulp.dest( paths.dist ) );
});

// Deleting any file inside the /dist folder
gulp.task( 'clean-dist', function() {
  return del( [paths.dist + '/**'] );
});

// Run
// gulp dist-product
// Copies the files to the /dist-prod folder for distribution as theme with all assets
gulp.task( 'dist-product', ['clean-dist-product'], function() {
  return gulp.src( ['**/*', '!' + paths.bower, '!' + paths.bower + '/**', '!' + paths.node, '!' + paths.node + '/**', '!' + paths.dist, '!' + paths.dist +'/**', '!' + paths.distprod, '!' + paths.distprod + '/**', '*'] )
    .pipe( gulp.dest( paths.distprod ) );
} );

// Deleting any file inside the /dist-product folder
gulp.task( 'clean-dist-product', function() {
  return del( [paths.distprod + '/**'] );
} );



gulp.task( 'sass2', function() {
    var stream = gulp.src( paths.sass + '/*.scss' )
        .pipe( plumber( {
            errorHandler: function( err ) {
                console.log( err );
                this.emit( 'end' );
            }
        } ) )
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe( sass( { errLogToConsole: true } ) )
        .pipe( autoprefixer( 'last 2 versions' ) )
        .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
        .pipe( gulp.dest( paths.css ) )
    return stream;
});
gulp.task( 'scripts2', function() {
    var scripts = [

        // Start - All BS4 stuff
        paths.dev + '/js/bootstrap4/bootstrap.bundle.js',

        // End - All BS4 stuff

        paths.dev + '/js/skip-link-focus-fix.js',
        // paths.dev + '/lib/aos/aos.js',
        //paths.dev + '/js/scrollreveal.min.js',
        //paths.dev + '/js/in-view.min.js',
        paths.node + '/gumshoejs/dist/js/gumshoe.js',

        paths.node + '/smooth-scroll/dist/smooth-scroll.min.js',
        // Adding currently empty javascript file to add on for your own themes´ customizations
        // Please add any customizations to this .js file only!
        paths.dev + '/js/custom-javascript.js'
    ];
  return gulp.src( scripts )
  .pipe(expect(scripts))
    .pipe( concat( 'theme.min.js' ) )
    .pipe( uglify() )
    .pipe( gulp.dest( paths.js ) );

  gulp.src( scripts )
    .pipe( concat( 'theme.js' ) )
    .pipe( gulp.dest( paths.js ) );
});





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

//gulp.task('default', ['scripts']);

gulp.task('styles', function(){
    gulp.src([config.paths.sass.src +  '**/*.scss'])
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
      .pipe(browserSync.reload({stream:true}))
  });

  gulp.task('scripts', function(){
    return gulp.src(config.paths.js.src)
    .pipe(expect(config.paths.js.src))
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
      .pipe(browserSync.reload({stream:true}))
  });

  gulp.task( 'build', ['styles', 'scripts'], function() {} );

  gulp.task( 'watch', ['build'], function() {
    gulp.watch( [config.paths.sass.src +  '**/*.scss'], ['styles'] );
    //gulp.watch( [paths.dev + '/js/**/*.js', 'js/**/*.js', '!js/theme.js', '!js/theme.min.js'], ['scripts'] );

    //Inside the watch task.
    //gulp.watch( paths.imgsrc + '/**', ['imagemin-watch'] );
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

gulp.task('sync', ['browser-sync'], function(){
    gulp.watch([config.paths.sass.src +  '**/*.scss'], ['styles']);
    //gulp.watch("src/scripts/**/*.js", ['scripts']);
    //gulp.watch("*.html", ['bs-reload']);
  });

  // Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
// gulp.task( 'watch-bs', ['browser-sync', 'watch', 'scripts'], function() {
// } );
