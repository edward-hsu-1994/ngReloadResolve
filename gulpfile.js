var gulp = require('gulp'),
  gulp_sass = require('gulp-sass'),
  gulp_cleanCSS = require('gulp-clean-css'),
  gulp_sourceMaps = require('gulp-sourcemaps'),
  gulp_ngInlineTemplate = require('gulp-inline-ng2-template'),
  gulp_base64 = require('gulp-base64'),
  gulp_copy = require('gulp-copy'),
  runSequence = require('run-sequence'),
  fs = require('fs'),
  exec = require('child_process').exec,
  angularConfig = require('./.angular-cli.json'),
  path = require('path'),
  os = require('os');

// 這裡是這個LIB要匯出的模組路徑
var modulePath = './src/app/reload-resolve';

console.log('Angular Module 編譯');
console.log('====================');
console.log(`匯出模組目錄: ${modulePath}`);
console.time('time');
/**
 * 取得Shell檔案路徑在各平台的表示
 * @param {String} path 路徑
 */
function platformPath(path) {
  return /^win/.test(os.platform()) ? `${path}.cmd` : path;
}

// #region 清除相關
// 清除過去輸出目錄
gulp.task('clean-dist', function(done) {
  exec('rimraf ./dist ./tmp_dist', function(err, stdOut, stdErr) {
    if (err) {
      done(err);
    } else {
      done();
    }
  });
});

gulp.task('clean-index', function(done) {
  exec(`rimraf ${modulePath}/**/index.ts`, function(err, stdOut, stdErr) {
    if (err) {
      done(err);
    } else {
      done();
    }
  });
});

gulp.task('clean-tmp', function(done) {
  exec(`rimraf ./tmp_source ./tmp_dist`, function(err, stdOut, stdErr) {
    if (err) {
      done(err);
    } else {
      done();
    }
  });
});
// #endregion

/**
 * 主要編譯過程
 */
gulp.task('build', function(done) {
  runSequence(
    'backup-source',
    'compile-sass',
    'assets-base64',
    'clean-css',
    'create-index',
    'compile',
    'export',
    'clean-tmp',
    'clean-index',
    function() {
      console.timeEnd('time');
      console.log(
        '編譯結束, 編譯結果於 ./dist 目錄中, 如要發行則執行 npm publish dist'
      );
    }
  );
});

// NGC編譯
gulp.task('compile', ['angular-inline', 'clean-dist'], function(done) {
  var executable = path.join(__dirname, platformPath('/node_modules/.bin/ngc'));
  exec(`${executable} -p ./tsconfig.json`, e => {
    if (e) {
      console.error(e);
      return gulp.src('tmp_source/**/*').pipe(gulp_copy('./', { prefix: 1 }));
    }
    fs.rename('dist', 'tmp_dist', function(err) {
      if (err) {
        throw err;
      }
      done();
    });
  });
});

// 將HTML與CSS樣板轉換於TS檔案修飾器內
gulp.task('angular-inline', function() {
  return gulp
    .src('./src/**/*.ts')
    .pipe(gulp_ngInlineTemplate({ base: '/src', useRelativePaths: true }))
    .pipe(gulp.dest('./src'));
});

// 產生索引檔
gulp.task('create-index', ['clean-index'], function(done) {
  function createIndex(path) {
    var files = fs.readdirSync(path);
    var index = '';
    files.forEach(file => {
      var stats = fs.statSync(path + '/' + file);
      var name = file;
      if (stats.isDirectory()) {
        createIndex(path + '/' + file);
      } else {
        if (
          !/\.ts$/gi.test(name) ||
          /\.spec\.ts$/gi.test(name) ||
          /\.test\.ts$/gi.test(name) ||
          /^index\.ts$/gi.test(name)
        ) {
          return;
        }
        name = name.replace(/\.ts$/g, '');
        if (name === 'index') return;
      }

      index += `export * from \'./${name}\';\r\n`;
    });
    fs.writeFileSync(path + '/index.ts', index);
  }

  createIndex(modulePath);
  done();
});

// 將CSS中引用的圖片檔案BASE64寫到CSS檔案
gulp.task('assets-base64', function() {
  return gulp
    .src('src/**/*.css')
    .pipe(
      gulp_base64({
        baseDir: './src',
        extensions: ['png', 'jpg', 'gif', 'ttf', 'woff', 'woff2', 'eot', 'svg'],
        maxImageSize: 200 * 1024,
        debug: false
      })
    )
    .pipe(
      gulp.dest(function(file) {
        return file.base;
      })
    );
});

// 備份原有SourceCode
gulp.task('backup-source', function() {
  return gulp.src('src/**/*').pipe(gulp_copy('./tmp_source'));
});

// SASS編譯
gulp.task('compile-sass', function() {
  gulp
    .src('src/**/*.scss')
    .pipe(
      gulp_sass({ outputStyle: 'compressed' }).on('error', gulp_sass.logError)
    ) // this will prevent our future watch-task from crashing on sass-errors
    .pipe(
      gulp.dest(function(file) {
        return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
      })
    );
});

// 壓縮CSS
gulp.task('clean-css', function() {
  return gulp
    .src('src/**/*.css')
    .pipe(gulp_cleanCSS({ compatibility: 'ie8' }))
    .pipe(
      gulp.dest(function(file) {
        return file.base; // because of Angular 2's encapsulation, it's natural to save the css where the scss-file was
      })
    );
});

gulp.task(
  'export',
  ['export-package-json', 'export-grobal-css', 'restore', 'export-package'],
  function(done) {
    done();
  }
);

// 恢復Source code
gulp.task('restore', function() {
  return gulp.src('tmp_source/**/*').pipe(gulp_copy('./', { prefix: 1 }));
});

// 複製頂層package.json與讀我、授權條款至輸出
gulp.task('export-package-json', function() {
  return gulp
    .src(['package.json', '{README,readme}?(.md)', '{LICENSE|license}?(.md)'])
    .pipe(gulp_copy('./dist/'));
});

// 複製全域CSS
gulp.task('export-grobal-css', function() {
  console.log(
    angularConfig.apps[0].styles.map(x => angularConfig.apps[0].root + '/' + x)
  );
  return gulp
    .src(
      angularConfig.apps[0].styles.map(
        x => angularConfig.apps[0].root + '/' + x
      )
    )
    .pipe(gulp_copy('./dist/', { prefix: 999 }));
});

// 匯出package
gulp.task('export-package', function() {
  var copyFrom = './tmp_dist/' + modulePath;
  var level = copyFrom
    .replace(/\.\//g, '')
    .replace(/\/\//g, '')
    .split('/').length;

  return gulp
    .src('./tmp_dist/' + modulePath + '/**/*')
    .pipe(gulp_copy('./dist/', { prefix: level }));
});
