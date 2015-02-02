'use strict';

var scssDir = 'dev/scss/';
var jsFiles = [];
var jsDest = 'script.concat.js';

jsFiles = jsFiles.map(function (file) {
  return 'dev/js/' + file + '.js';
});

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    // ------ SCSS ------
    sass: {
      'dev-prod': {
        files: {
          'style.css': scssDir + 'main-page.scss'
        }
      }
    },

    // ------ JS files: concat and uglify ------
    concat: {
      'dev-prod': {
        src: jsFiles,
        dest: jsDest
      }
    },
    uglify: {
      prod: {
        options: {
          mangle: true
        },
        files: {
          'script.js': [jsDest]
        }
      }
    },

    // ------ Watch ------
    watch: {
      css: {
        files: scssDir + '*',
        tasks: ['sass']
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  //Default task(s).
  grunt.registerTask('default', ['sass', 'concat', 'watch']);
  grunt.registerTask('prod', ['sass', 'concat', 'uglify']);
};
