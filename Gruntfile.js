module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Copy everything to build
    copy: {
      build: {
        cwd: 'src',
        src: ['**'],
        dest: 'build',
        expand: true
      },
      favicon: {
        cwd: 'src/img',
        src: ['favicon.ico'],
        dest: 'build/favicon.ico'
      }
    },

    // Clean /dist
    clean: {
      build: {
        src: ['build']
      },
      stylesheets: {
        //        src: ['build/css', '!build/bundle.css']
      },
      scripts: {
        src: ['build/**/*.js', '!build/bundle.js']
      },
    },

    // compile scss to css
    sass: {
      dist: {
        files: {
          'build/bundle.css' : 'build/css/main.scss'
        }
      }
    },
    
    // Auto add vendor prefixes
    build: {
      expand: true,
      cwd: 'build',
      src: ['**/*.css'],
      dest: 'build'
    },

    // Minify the CSS
    cssmin: {
      build: {
        files: {
          'build/bundle.css': ['build/bundle.css']
        }
      }
    },
    
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },

    // Uglify the sourcecode
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */ '
      },
      build: {
        src: 'bundle.js',
        dest: 'bundle.js'
      }
    },
    
    browserify: {
      build: {
        src: 'build/js/index.js',
        dest: 'build/bundle.js',
        'browserifyOptions': {
          'debug':false
        }
      }
    },

    // Watch
    watch: {
      stylesheets: {
        files: ['src/**/*.css', 'src/**/*.scss'],
        tasks: ['stylesheets']
      },
      scripts: {
        files: 'src/**/*.js',
        tasks: ['scripts']
      },
      copy: {
        files: ['src/**', '!src/**/*.css', '!src/**/*.scss', '!src/**/*.js', '!src/**/*.svg'],
        tasks: ['copy']
      }
    },


    // Development Server
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'build',
          hostname: '*'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('stylesheets', 'Compiles the stylesheets.', ['sass', 'autoprefixer', 'cssmin', 'clean:stylesheets']);

  grunt.registerTask('scripts', 'Compiles the JavaScript files.', ['browserify', 'uglify', 'clean:scripts']);

  grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:build', 'copy', 'stylesheets', 'scripts']);
  
  grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', [ 'build', 'connect', 'watch' ]);
}
