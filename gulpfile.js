// yarn add gulp gulp-sass gulp-postcss autoprefixer cssnano gulp-uglify gulp-concat gulp-sourcemaps gulp-html-tag-include browser-sync

const gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    fileinclude = require("gulp-html-tag-include"),
    browserSync = require("browser-sync").create();

const paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "./src/scss/**/*.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "./dist/css"
    },
    html: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "./src/**/*.html",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "./dist/",
    },
    js: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "./src/js/**",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "./dist/js"
    },
    img: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "./src/img/**",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "./dist/img"
    },


    // Easily add additional paths
    // ,include: {
    //  src: '...',
    //  dest: '...'
    // }
};

function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(fileinclude())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());

}

function script() {
    return gulp
        .src([
            './src/js/lib/**',
            '!ui-script.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))
}

function js() {
    return gulp
        .src('./src/js/ui-script.js')
        .pipe(script())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
}

// A simple task to reload the page
function reload() {
    browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function watch() {
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        server: {
            baseDir: "./dist"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    gulp.watch(paths.styles.src, style, reload);
    //gulp.watch(paths.js.src, js, reload);
    // We should tell gulp which files to watch to trigger the reload
    // This can be include or whatever you're using to develop your website
    // Note -- you can obviously add the path to the Paths object
    //gulp.watch("src/*.include", reload);
    gulp.watch(paths.html.src, html, reload);
}

// We don't have to expose the reload function
// It's currently only useful in other functions


// Don't forget to expose the task!
exports.watch = watch;
// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;
exports.html = html;
exports.js = js;


/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const build = gulp.parallel(style, watch, html, js);

/*
 * You can still use `gulp.task` to expose tasks
 */
//gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);