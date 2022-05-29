import gulp from 'gulp';
import babel from 'gulp-babel';
import postcss from 'gulp-postcss';
import replace from 'gulp-replace';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import sync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import concat from 'gulp-concat';

import pimport from 'postcss-import';
import csso from 'postcss-csso';
import minmax from 'postcss-media-minmax';
import autoprefixer from 'autoprefixer';

// HTML

export const html = () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

// Styles

export const styles = () => {
    return gulp.src('src/css/index.css')
        .pipe(postcss([
            pimport,
            minmax,
            autoprefixer,
            csso,
        ]))
        .pipe(replace(/\.\.\//g, ''))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

// Scripts

// export const scripts = () => {
//     return gulp.src('src/js/index.js')
//         .pipe(babel({
//             presets: ['@babel/preset-env']
//         }))
//         .pipe(terser())
//         .pipe(gulp.dest('dist'))
//         .pipe(sync.stream());
// };

export const scripts = () => {
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

// Images

export const images = () => {
    return gulp.src('src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
        .pipe(sync.stream());
};

// Copy

export const copy = () => {
    return gulp.src([
            'src/fonts/**/*',
            // 'src/images/**/*',
            'src/icons/**/*',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};

// Paths

export const paths = () => {
    return gulp.src('dist/*.html')
        .pipe(replace(
            /(<link rel="stylesheet" href=")css\/(index.css">)/, '$1$2'
        ))
        .pipe(replace(
            /(<script src=")js\/(index.js">)/, '$1$2'
        ))
        .pipe(gulp.dest('dist'));
};

// Server

export const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });

};

// Watch

export const watch = () => {
    gulp.watch('src/*.html', gulp.series(html, paths));
    gulp.watch('src/css/**/*.css', gulp.series(styles));
    gulp.watch('src/js/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/fonts/**/*',
        'src/img/**/*',
    ], gulp.series(copy));
};

// Default

export default gulp.series(
    gulp.parallel(
        html,
        styles,
        scripts,
        images,
        copy,
    ),
    paths,
    gulp.parallel(
        watch,
        server,
    ),
);