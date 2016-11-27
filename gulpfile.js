var gulp = require('gulp'),
    webpack = require('webpack-stream'),
    copy = require('gulp-copy'),
    webpackConfig = require("./webpack.config.js"),
    WebpackDevServer = require("webpack-dev-server"),
    webpackCompiler = require("webpack"),
    concat = require("gulp-concat"),
    inject = require('gulp-inject-string'),
    rename = require("gulp-rename");

// var staticJS = {
//     "theme_dependecies": [
//         "./web/js/theme_externals/modernizr/modernizr.custom.js",
//         "./web/js/theme_externals/bootstrap/dist/js/bootstrap.js",
//         "./web/js/theme_externals/matchMedia/matchMedia.js",
//         "./web/js/theme_externals/jQuery-Storage-API/jquery.storageapi.js",
//         "./web/js/theme_externals/jquery-easing/jquery.easing.js",
//         "./web/js/theme_externals/animo.js/animo.js",
//         "./web/js/theme_externals/slimScroll/jquery.slimscroll.min.js",
//         "./web/js/theme_externals/screenfull/dist/screenfull.js",
//         "./web/js/theme_externals/jquery-localize-i18n/dist/jquery.localize.js",
//         "./web/js/theme_externals/demo/demo-rtl.js",
//         "./web/js/theme_externals/sparkline/index.js",
//         "./web/js/theme_externals/Flot/jquery.flot.js",
//         "./web/js/theme_externals/flot.tooltip/js/jquery.flot.tooltip.min.js",
//         "./web/js/theme_externals/jquery.flot.resize.js",
//         "./web/js/theme_externals/Flot/jquery.flot.pie.js",
//         "./web/js/theme_externals/jquery.flot.time.js",
//         "./web/js/theme_externals/Flot/jquery.flot.categories.js",
//         "./web/js/theme_externals/flot-spline/js/jquery.flot.spline.min.js",
//         "./web/js/theme_externals/jquery-classyloader/js/jquery.classyloader.min.js",
//         "./web/js/theme_externals/demo/demo-flot.js",
//         "./web/js/theme_externals/datatables/media/js/jquery.dataTables.min.js",
//         "./web/js/theme_externals/datatables/media/js/dataTables.bootstrap.js",
//         "./web/js/theme_externals/sweetalert/dist/sweetalert.min.js",
//         "./web/js/theme_externals/select2/dist/js/select2.js"
//     ]
// };


// fonts command
gulp.task('fonts', function () {
    return gulp.src('./public/components/bootstrap-sass/assets/fonts/bootstrap/*')
        .pipe(copy('./public/fonts', {prefix: 7}));
});

// gulp.task("concat", function(){
//     return gulp.src(staticJS.theme_dependecies)
//         .pipe(concat("theme_dependencies.js"))
//         .pipe(gulp.dest("./web/bundles/app/js/"));
// });

gulp.task('webpack', function(){
    return gulp.src(webpackConfig.entry.theme)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./public/js'));
});

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpackCompiler(webpackConfig);

    new WebpackDevServer(compiler, {
        publicPath: "/js/",
        stats: {
            colors: true
        },
        contentBase: './public/js',
        https: false
    }).listen(8080, "0.0.0.0", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);

        // Server listening
        console.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        callback();
    });
});

gulp.task("translations", function(){
    return gulp.src("./app/Resources/translations/*.yml")
        .pipe(yaml({
            space: 4,
            // replacer: function(key, value){
            //     var result = {};
            //     for(var i in value){
            //         var namespaces = i.split(".");
            //         var processed = [];
            //         var tmp;
            //         namespaces.forEach(function(v,k){
            //             tmp = result;
            //             processed.forEach(function(processedKey){
            //                tmp = tmp[processedKey];
            //             });
            //             if(typeof tmp[v] === "undefined"){
            //                 tmp[v] = {};
            //             }
            //             processed.push(v);
            //         });
            //         tmp[processed[processed.length - 1]] = value[i];
            //     }
            //     return JSON.stringify(result);
            // }
        }))
        .pipe(inject.prepend("var translations = "))
        .pipe(inject.append(";"))
        .pipe(rename(function (path) {
            path.extname = ".js"
        }))
        .pipe(gulp.dest("./web/js/translations"));
});

gulp.task('production', ['webpack', 'fonts']);
gulp.task('local', ['webpack-dev-server', 'fonts']);
