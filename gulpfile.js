const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('lint-watch', () => {
  // ESLint ignores files with "node_modules" paths. 
  // So, it's best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  return gulp.src(['routes/**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property 
    // of the file object so it can be used by other modules. 
    .pipe(eslint());
    // eslint.format() outputs the lint results to the console. 
    // Alternatively use eslint.formatEach() (see Docs). 
    // .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failAfterError last. 
    // .pipe(eslint.failAfterError());
});

gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths. 
  // So, it's best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  return gulp.src(['routes/**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property 
    // of the file object so it can be used by other modules. 
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console. 
    // Alternatively use eslint.formatEach() (see Docs). 
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failAfterError last. 
    .pipe(eslint.failAfterError());
});

gulp.task('bs', ['serve'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
    reloadOnRestart: true,
  });
});

gulp.task('serve', () => {
  // const started = false;

  const stream = nodemon({
    script: './bin/www',
    watch: ['routes', 'views'],
    ext: 'js html',
    tasks: ['lint-watch'],
  });
  return stream
    // .on('start', () => {
    //   // to avoid nodemon being started multiple times
    //   // if (!started) {
    //       cb();
    //       // started = true; 
    //   } 
    // })
    .on('restart', () => {
      console.log('restarted!');
      // cb();
      setTimeout(reload, 1000);
    })
    .on('crash', () => {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10); // restart the server in 10 seconds 
    });
});



gulp.task('default', ['lint', 'bs'], () => {
  // gulp.watch(['routes/*.js'], reload);
});

