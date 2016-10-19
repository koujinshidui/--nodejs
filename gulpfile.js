

'use strict'

const gulp = require('gulp');


gulp.task('defalut',['es6toes5','mincss','imagemin','htmlmin','copyfile'],()=>{

	console.log('所有任务执行完毕');

});


const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('es6toes5',()=>{

	gulp.src(['./src/controller/*.js'
		,'./src/model/*.js','./src/routes/*.js'
		],{base:'src'})
	.pipe(babel({presets: ['es2015']}))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));

	console.log('es6转es5完毕，并且压缩js完毕');
});


const rev = require('gulp-rev');  
const mincss = require('gulp-clean-css');

gulp.task('mincss',()=>{

	gulp.src('./src/statics/css/*.css',{base:'src'})
	.pipe(mincss({compatibility: 'ie8'}))
	.pipe(rev())
	.pipe(gulp.dest('dist'))
	.pipe(rev.manifest()) 
    .pipe(gulp.dest('./src/rev/'));
    
});


/
const imagemin = require('gulp-imagemin');
gulp.task('imagemin',()=>{

	 gulp.src('src/statics/images/*.*',{base:'src'})
    .pipe(imagemin())
    .pipe(gulp.dest('dist'))

});
const htmlmin = require('gulp-htmlmin');
const revCollector = require('gulp-rev-collector');

gulp.task('htmlmin', function() {
 
 	
 	gulp.src(['src/rev/**/*.json', './src/views/*.html'],{base:'src'})
        .pipe(revCollector())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});


gulp.task('copyfile',()=>{
	gulp.src('./src/statics/bowersrc/**/*.*',{base:'src'})
	.pipe(gulp.dest('dist'));
});
