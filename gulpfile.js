var gulp=require('gulp'), 
    sass=require('gulp-sass'),
    browserSync=require('browser-sync').create(),
    useref=require('gulp-useref'),
    uglify=require('gulp-uglify'),
    gulpif=require('gulp-if'),
    cssnano=require('gulp-cssnano'),
    imagemin=require('gulp-imagemin'),
    cache=require('gulp-cache'),
    del=require('del'),
    runSequence=require('run-sequence');
/*-----------TASK LİST-----------------
* 'sass' for sass
* 'watch' for test 
* 'browserSync' for test with browser easy way
* 'useref' for optimizing all '.js' & '.css' files
*/


//Development Tasks
//---------------------

gulp.task('browserSync',function(){
  browserSync.init({
    server:{
      baseDir:'app'
    },
  })
});

gulp.task('sass',function(){
  return gulp.src('app/scss/**/*.+(scss|sass)')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream:true
    }))
});
//watch
gulp.task('watch',['browserSync','sass'],function(){
  gulp.watch('app/scss/**/*.+(scss|sass)',['sass']);
  gulp.watch('app/*.hmtl',browserSync.reload);
  gulp.watch('app/js/**/*.js',browserSync.reload);
});

//Optimization Tasks
//----------------------------

gulp.task('useref',function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js',uglify()))
    .pipe(gulpif('*.css',cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images',function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced:true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts',function(){
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist',function(){
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('cache:clear',function(cb){
  return cache.clearAll(cb)
});



//Build Sequence
//---------------

gulp.task('build',function(callback){
  runSequence('clean:dist',
      ['sass','useref','images','fonts'],
      callback
    )
});

gulp.task('default',function(callback){
  runSequence(['sass','browserSync','watch'],
      callback
    )
});