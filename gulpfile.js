
// новый файл gulp - по образцу новой версии gulp v4.0  - все нормально работает (предыд ошибки поправила)

let gulp = require("gulp");
let uglify = require("gulp-uglify-es").default; // js minification
let sass = require("gulp-sass");
let browserSync = require("browser-sync"); //require("browser-sync").create()
let imagemin = require("gulp-imagemin");
let cache = require("gulp-cache");
let cleanCss = require("gulp-clean-css"); // css minification
let del = require("del");
let autoprefixer = require("gulp-autoprefixer");
let ejs = require("gulp-ejs");

let paths = {
    styles: {
        app: 'app/sass/**/*.scss',
        dist: 'dist/css/'
    },
    scripts: {
        app: 'app/js/**/*.js',
        dist: 'dist/js/'
    },
    html: {
        app: 'app/views/*.ejs',
        dist: 'dist/'
    }
};


// localhost and autoreload
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }, notify: false
    });
});

gulp.task('js', js);
gulp.task('html', html);
gulp.task('html', html);
gulp.task('styles', styles);

function js(callback) {
    return gulp.src(paths.scripts.app)
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
    callback();
}


function styles() {
    return gulp.src(paths.styles.app) // берем файлы *.scss из папки sass
        .pipe(sass().on('error', sass.logError)) // компилируем sass в css и отслеживаем ошибки
        .pipe(autoprefixer({ browsers: ['last 50 versions'], cascade: false }) ) // выставляем необходимые вендорные префиксы для браузеров
        .pipe(cleanCss()) // минификация css
        .pipe(gulp.dest("app/css/"))  // направляе скомпилированные из sass css-файлы в указанную папку
        .pipe(gulp.dest("dist/css/"))  // направляе скомпилированные из sass css-файлы в указанную папку
        .pipe(browserSync.reload({stream: true})); // перезагрузка страницы браузера
}

function clean() {
    return  del('dist'); // удаляем лишние промежуточные файлы
}


function html() {
    return gulp.src(paths.html.app)
        .pipe(ejs({msg:"ejs processing"}, {}, {ext:'.html'}))
        .pipe(gulp.dest('app'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true})); // перезагрузка страницы браузера
}


function img() {
    return gulp.src("app/img/**/*") // берем файлы из папки img
        .pipe(cache(imagemin() ) ) // минификация файлов
        .pipe(gulp.dest("dist/img")) // направляем файлы в нужную директорию

}

function fonts() {
    return gulp.src("app/fonts/*") // берем файлы шрифтов
        .pipe(gulp.dest("dist/fonts")) // направляем файлы в нужную директорию
}

function cleandist() {
    return del(['dist/**/*', '!dist/css', '!dist/images', '!dist/images/**/*', 'dist/fonts', 'dist/fonts/**/*']); // удаляем лишние промежуточные файлы, кроме изображений и шрифтов
}



function watch(callback) {

    gulp.parallel(
        'styles',
        'js',
        'html',
        'browser-sync'
    )(callback);

    gulp.watch('app/sass/**/*.scss', gulp.series(styles));
    gulp.watch('app/views/**/*.ejs', gulp.series(html));
}


let build = gulp.series(cleandist, fonts, img, styles, js, html);


gulp.task('build', build);
gulp.task('default', build);
gulp.task('watch', watch);