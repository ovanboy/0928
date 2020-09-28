var path = require('path');
var fs = require('fs');

var gulp = require('gulp');

var del = require('del');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');;
var cssAsset = require('./build-tools/gulp-css-asset.js');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

var replace = require('gulp-replace');



// 环境配置
var defaultConfig = require('./config.js');
var customConfig = fs.existsSync('./config.prod.js') ? require('./config.prod.js') : {};
var config = Object.assign({}, defaultConfig, customConfig);



// 断言文件后缀名类型
var typeAssert = function(type, boolean){
    if(boolean){
        return function(file){
            return  file.extname.toLowerCase().replace(/^\./,'') === type;
        }
    }else{
        return function(file){
            return  file.extname.toLowerCase().replace(/^\./,'') !== type;
        }
    }
}



// script 相关任务 -------------------------------------------------------------

gulp.task('cleanScript',function(){
    return del([
        './static/map/script/**',
        './static/script/**'
    ]);
});

gulp.task('buildModule',function(){
    return gulp.src([
            './src/static/script/module/**/*.js'
        ],{
            base: './src/static/script/',
            allowEmpty: true
        })
        .pipe(uglify())
        .pipe(gulp.dest('./static/script/'));
});

gulp.task('buildEntry',function(){
    return gulp.src('./src/static/script/entry/**/*.js',{ base: './src/static/' })
        .pipe(gulp.dest('./static/'));
});

gulp.task('buildConfig',function(){
    return gulp.src('./src/static/script/require.config*.js',{ base: './src/static/' })
        .pipe(uglify())
        .pipe(gulp.dest('./static/'));
});

gulp.task('script', gulp.series(
    'cleanScript',
    gulp.parallel(
        'buildModule',
        'buildConfig',
        'buildEntry')
    )
);


// data 相关任务 -------------------------------------------------------------

gulp.task('cleanData',function(){
    return del(['./static/data/**']);
});

gulp.task('buildData',function(){
    return gulp.src('./src/static/data/**/*.*',{ base: './src/static/' })
        .pipe(gulp.dest('./static/'));
});

gulp.task('data', gulp.series('cleanData','buildData'));




// style 相关任务 -------------------------------------------------------------

gulp.task('cleanStyle', function(){
    return del([
        './static/map/style/**',
        './static/style/**'
    ]);
});

gulp.task('buildStyle',function(){
    return gulp.src('./src/static/style/**/*.scss',{ base: './src/static/' })
        .pipe(sass({
            includePaths: ['./src/static/style/_unit/'],
            outputStyle: 'expanded',
            sourceComments: true
        }))
        .pipe(cssAsset({
            tabSize: 2,
            staticPath: config.staticPath,
            relative: true,
            base64: function(filePath){
                return fs.statSync(filePath).size < 7168;
            }
        }))
        .pipe(gulpif(typeAssert('css', false), gulp.dest('./static/')))
        .pipe(gulpif(typeAssert('css', true), gulp.dest('./static/.tmp/')));
});

gulp.task('cssRev',function(){
    return gulp.src('./static/.tmp/style/**/*.css',{ base: './static/.tmp/' })
        .pipe(autoprefixer())
        //.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(cleanCSS({rebase: false}))
        .pipe(gulp.dest('./static/'));
});


gulp.task('style', gulp.series('cleanStyle','buildStyle','cssRev',function(){
    return del(['./static/.tmp/']);
}));





// template 相关任务 -------------------------------------------------------------

gulp.task('cleanView',function(){
    return del(['./view/**']);
});

gulp.task('buildView',function(){

    return gulp.src('./src/view/**/*.pug',{ base: './src/view/' })
        .pipe(replace(/(\/[\w-\.]+)\.scss\b/g, '$1.css'))
        .pipe(gulp.dest('./view/'));
});

gulp.task('view', gulp.series('cleanView','buildView'));



// public 相关任务 -------------------------------------------------------------
gulp.task('cleanPublic', function(){
    return del([
        './static/public/**'
    ]);
});

gulp.task('buildPublic',function(){
    return gulp.src('./src/static/public/**/*.*',{ base: './src/static/public/' })
        .pipe(gulp.dest('./static/public/'));
});

gulp.task('public', gulp.series('cleanPublic','buildPublic'));



// 用户任务 -------------------------------------------------------------

gulp.task('default', gulp.parallel('script','data','style','public','view'));
