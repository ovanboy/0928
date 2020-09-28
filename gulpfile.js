var path = require("path");
var fs = require("fs");
var gulp = require("gulp");
var del = require("del");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var gulpif = require("gulp-if");
var sass = require("gulp-sass");
var cssAsset = require("./build-tools/gulp-css-asset.js");
var autoprefixer = require("gulp-autoprefixer");
var cleanCSS = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var replace = require("gulp-replace");
var browserSync = require("browser-sync").create();
let dependents = require("gulp-dependents");

// 环境配置
var defaultConfig = {
  staticPath: "/static/",
};
var appConfig = fs.existsSync("./config.js") ? require("./config.js") : {};
var config = Object.assign(defaultConfig, appConfig);

// 插件配置
var plumberOptions = {
  errorHandler: function (err) {
    console.error(err.toString());
    this.emit("end");
  },
};

// 断言文件后缀名类型
var typeAssert = function (type, boolean) {
  if (boolean) {
    return function (file) {
      return file.extname.toLowerCase().replace(/^\./, "") === type;
    };
  } else {
    return function (file) {
      return file.extname.toLowerCase().replace(/^\./, "") !== type;
    };
  }
};

// script 相关任务 -------------------------------------------------------------

gulp.task("cleanScript", function () {
  return del(["./static/map/script/**", "./static/script/**"]);
});

gulp.task("buildModule", function () {
  return gulp
    .src(["./src/static/script/module/**/*.js"], {
      base: "./src/static/script/",
      allowEmpty: true,
    })
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("../map/script"))
    .pipe(gulp.dest("./static/script/"));
});

gulp.task("buildEntry", function () {
  return gulp
    .src("./src/static/script/entry/**/*.js", { base: "./src/static/" })
    .pipe(gulp.dest("./static/"));
});

gulp.task("buildConfig", function () {
  return gulp
    .src("./src/static/script/require.config*.js", { base: "./src/static/" })
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./map"))
    .pipe(gulp.dest("./static/"));
});

gulp.task(
  "script",
  gulp.series(
    "cleanScript",
    gulp.parallel("buildModule", "buildConfig", "buildEntry")
  )
);

// data 相关任务 -------------------------------------------------------------

gulp.task("cleanData", function () {
  return del(["./static/data/**"]);
});

gulp.task("buildData", function () {
  return gulp
    .src("./src/static/data/**/*.*", { base: "./src/static/" })
    .pipe(gulp.dest("./static/"));
});

gulp.task("data", gulp.series("cleanData", "buildData"));

// style 相关任务 -------------------------------------------------------------

gulp.task("cleanStyle", function () {
  return del(["./static/map/style/**", "./static/style/**"]);
});

gulp.task("buildStyle", function () {
  return gulp
    .src("./src/static/style/**/*.scss", { base: "./src/static/" })
    .pipe(plumber(plumberOptions))
    .pipe(dependents())
    .pipe(
      sass({
        includePaths: ["./src/static/style/_unit/"],
        outputStyle: "expanded",
        sourceComments: true,
      })
    )
    .pipe(
      cssAsset({
        tabSize: 2,
        staticPath: config.staticPath,
        relative: true,
        base64: function (filePath) {
          return fs.statSync(filePath).size < 7168; //5120;
        },
      })
    )
    .pipe(gulpif(typeAssert("css", false), gulp.dest("./static/")))
    .pipe(gulpif(typeAssert("css", true), gulp.dest("./static/.tmp/")));
});

gulp.task("cssRev", function () {
  return gulp
    .src("./static/.tmp/style/**/*.css", { base: "./static/.tmp/" })
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ rebase: false }))
    .pipe(sourcemaps.write("./map"))
    .pipe(gulp.dest("./static/"));
});

gulp.task(
  "style",
  gulp.series("cleanStyle", "buildStyle", "cssRev", function () {
    return del(["./static/.tmp/"]);
  })
);

// template 相关任务 -------------------------------------------------------------

gulp.task("cleanView", function () {
  return del(["./view/**"]);
});

gulp.task("buildView", function () {
  return gulp
    .src("./src/view/**/*.pug", { base: "./src/view/" })
    .pipe(replace(/(\/[\w-\.]+)\.scss\b/g, "$1.css"))
    .pipe(gulp.dest("./view/"));
});

gulp.task("view", gulp.series("cleanView", "buildView"));

// public 相关任务 -------------------------------------------------------------
gulp.task("cleanPublic", function () {
  return del(["./static/public/**"]);
});

gulp.task("buildPublic", function () {
  return gulp
    .src("./src/static/public/**/*.*", { base: "./src/static/public/" })
    .pipe(gulp.dest("./static/public/"));
});

gulp.task("public", gulp.series("cleanPublic", "buildPublic"));

// 监视任务 -------------------------------------------------------------

gulp.task("watch", function () {
  //启动浏览器
  browserSync.init({
    proxy: {
      target: "127.0.0.1:" + config.port,
      proxyReq: [
        function (proxyReq) {
          proxyReq.setHeader("Connection", "keep-alive");
        },
      ],
    },
    notify: false,
    online: false,
  });

  //脚本监视
  gulp.watch(
    ["./src/static/script/**/*.js"],
    gulp.series("script", function (cb) {
      browserSync.reload();
      cb();
    })
  );

  //数据监视
  gulp.watch(
    ["./src/static/data/**/*.*"],
    gulp.series("data", function (cb) {
      browserSync.reload();
      cb();
    })
  );

  //样式监视
  gulp.watch(
    [
      "./src/static/style/**/*.scss",
      "./src/static/style/**/*.gif",
      "./src/static/style/**/*.png",
      "./src/static/style/**/*.jpg",
      "./src/static/style/**/*.ttf",
      "./src/static/style/**/*.woff",
      "./src/static/style/**/*.eot",
      "./src/static/style/**/*.svg",
    ],
    gulp.series("style", function (cb) {
      browserSync.reload();
      cb();
    })
  );

  //模板监视
  gulp.watch(
    "./src/view/**/*.pug",
    gulp.series("view", function (cb) {
      browserSync.reload();
      cb();
    })
  );

  //第三方模块变更
  gulp.watch(
    "./src/static/public/**/*.*",
    gulp.series("public", function (cb) {
      browserSync.reload();
      cb();
    })
  );
});

// 用户任务 -------------------------------------------------------------

gulp.task(
  "default",
  gulp.parallel("script", "data", "style", "public", "view")
);
