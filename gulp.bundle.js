const path = require("path");
const fs = require("fs-extra");
const url = require("url");
const gulp = require("gulp");
var del = require("del");
const pug = require("gulp-pug");
const defaultConfig = require("./config.js");
var locals = {};

var project = "activity/2020/shop-everyweek";


locals.config = Object.assign({}, defaultConfig);
// pug配置
locals.pretty = "\t";
locals.basedir = path.resolve(__dirname, "./src/view");
locals.compileDebug = true;
locals.cache = false;

require("./gulpfile.prod");

gulp.task("bundle_clean", function() {
    return del(["./dist"]);
});

gulp.task("bundle_view", function buildHTML() {
    return gulp
        .src([`./src/view/${project}/*.pug`], {
            base: "./src/view/",
            ignore: [
                "**/_*", // Exclude files starting with '_'.
                "**/_*/**"
            ]
        })
        .pipe(
            pug({
                locals,
                ...locals
            })
        )
        .pipe(gulp.dest("./dist/html/"));
});


let taskList = [
    {
        name: "data",
        src: [`./static/data/image/${project}/*.*`],
        dest: `./dist/static/data/${project}`
    },
    {
        name: "public",
        src: [`./static/public/**/*.*`],
        dest: `./dist/static/public`
    },
    {
        name: "script:entry",
        src: [`./static/script/entry/${project}/**/*.js`],
        dest: `./dist/static/script/entry/${project}`
    },
    {
        name: "script:module",
        src: [`./static/script/module/**/*.js`],
        dest: `./dist/static/script/module`
    },
    {
        name: "script:config",
        src: [`./static/script/require.config-3.0.js`],
        dest: `./dist/static/script/`
    },
    {
        name: "style:css",
        src: [`./static/style/${project}/**/*.css`],
        dest: `./dist/static/style/${project}`
    },
    {
        name: "style:cssCommon",
        src: [`./static/style/common-3.0.css`],
        dest: `./dist/static/style/`
    },
    {
        name: "style:asset",
        src: [`./static/style/_asset/image/${project}/**/*.*`],
        dest: `./dist/static/style/_asset/image/${project}`
    }
];



function patchManifest(done) {
    const tasks = taskList.map(({ name, src, dest }) => {
        // Right here, we return a function per country
        return () => gulp.src(src).pipe(gulp.dest(dest));
    });

    return gulp.series(...tasks, seriesDone => {
        seriesDone();
        done();
    })();
}


gulp.task("bundle_build", gulp.series("bundle_clean", "bundle_view",patchManifest));

gulp.task("bundle",gulp.series('default','bundle_build'))
