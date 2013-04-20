/* global module:false */
module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
      '/*!\n' +
	' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * http://lab.hakim.se/reveal-js\n' +
        ' * MIT licensed\n' +
        ' *\n' +
        ' * Copyright (C) 2013 Hakim El Hattab, http://hakim.se\n' +
        ' */'
    },
    qunit: {
      files: [ 'test/**/*.html' ]
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: 'js/reveal.js',
        dest: 'js/reveal.min.js'
      }
    },
    cssmin: {
      compress: {
        files: {
          'css/reveal.min.css': [ 'css/reveal.css' ]
        }
      }
    },
    sass: {
      main: {
        files: {
          'css/theme/blanko.css': 'css/theme/source/blanko.scss'
        }
      }
    },
    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        expr: true,
        globals: {
          head: false,
          module: false,
          console: false
        }
      },
      files: [ 'Gruntfile.js', 'js/reveal.js' ]
    },
    watch: {
      main: {
        files: [ 'Gruntfile.js', 'js/reveal.js', 'css/reveal.css' ],
        tasks: 'default'
      },
      theme: {
        files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
        tasks: 'themes'
      }
    }
  });

  // Dependencies
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );

  // Default task
  grunt.registerTask( 'default', [ 'jshint', 'cssmin', 'uglify' ] );

  // Theme task
  grunt.registerTask( 'themes', [ 'sass' ] );
};
