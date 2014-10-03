module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    jade : {
      compile: {
        expand: true,
        cwd: 'theme/templates/',
        src: '*.jade',
        dest: 'output/',
        ext: '.html',
        options: {
          // min化しない
          pretty: true
        }
      },
    },
    // stylus
    stylus: {
      compile: {
        options: {
          compress: false,
          linenos: true
        },
        files: [{
          expand: true,
          cwd:  'theme/css/',
          src:  ['**/*.styl', '*.styl'],
          dest: 'output/assets/css/',
          ext:  '.css'
        }]
      }
    },
    // CSS min化
    cssmin: {
      compress: {
        files: {
          'output/assets/css/style.min.css': 'output/assets/css/style.css'
        }
      }
    },
    // JS 構文チェック
    jshint: {
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        },
        unused: true, // 宣言したきり使っていない変数を検出
        // グローバル変数へのアクセスの管理
        browser: true, // ブラウザ用のやつは許可
        devel: true,   // consoleやalertを許可
        expr: true     // x || (x = 1); とかができるようにする
      },
      files: 'thems/js/*.js'
    },
    // JS 結合
    concat: {
      options: {
        // 連結される各ファイル内の間に配置出力する文字列を定義
        separator: ';\n'
      },
      compile: {
        files: {
          'output/assets/js/lib.js': ['theme/js/lib/*.js'],
          'output/assets/js/main.js': ['theme/js/*.js']
        }
      },
      compileDev: {
        files: {
          'output/assets/js/main.js': ['output/assets/js/lib.js', 'output/assets/js/main.js']
        }
      },
      compaileAll: {
        files: {
          'output/assets/js/main.min.js': ['output/assets/js/lib.js', 'output/assets/js/main.min.js']
        }
      }
    },
    // JS min化
    uglify: {
      options: {
        banner: '/*!\n * compile at <%= grunt.template.today("dd-mm-yyyy") %>\n */\n'
      },
      dist: {
        files: {
          'output/assets/js/main.min.js': 'output/assets/js/main-clean.js'
        }
      }
    },
    // remove console.log
    removelogging: {
      dist: {
        src:  'output/assets/js/main.js',
        dest: 'output/assets/js/main-clean.js'
      }
    },
    // delete files
    clean: {
      js: ['output/assets/js/lib.js', 'output/assets/js/main-clean.js']
    },

    watch: {
      // jade
      jade: {
        files: ['theme/templates/**/*.jade', 'theme/templates/*.jade'],
        tasks: 'jade:compile',
        options: {
          nospawn: true
        }
      },
      // CSS
      stylus: {
        files: ['theme/css/*.styl', 'theme/css/**/*.styl'],
        tasks: 'css',
        options: {
          nospawn: true
        }
      },
      // JS
      js: {
        files: ['theme/js/*.js', 'theme/js/**/*.js'],
        tasks: 'js',
        options: {
          nospawn: true
        }
      }
    }
  });

  for(var taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }
  
  // Task of javascript
  grunt.registerTask('js', ['jshint', 'concat:compile', 'removelogging:dist', 'uglify:dist', 'concat:compileDev', 'concat:compaileAll', 'clean:js']);
  // Task of css
  grunt.registerTask('css', ['stylus:compile', 'cssmin:compress']);

  grunt.registerTask('default', ['watch']);
};
