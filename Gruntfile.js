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
        src: ['src/img/favicon.ico'],
        dest: 'build/favicon.ico'
      }
    },

    // Clean /dist
    clean: {
      build: {
        src: ['build']
      },
      stylesheets: {
        src: ['build/**/*.css', 'build/css', '!build/bundle.css']
      },
      scripts: {
        src: ['build/**/*.js', 'build/js', '!build/bundle.js']
      },
      templates: {
        src: ['build/templates/**/*.html', 'build/templates']
      },
      vendor: {
        src: ['vendor']
      },
    },

    // compile scss to css
    sass: {
      dist: {
        files: {
          'build/bundle.css' : 'src/css/main.scss'
        }
      }
    },

    // Minify the CSS
    cssmin: {
      build: {
        files: {
          'build/bundle.css': ['build/bundle.css', 'build/vendor/**/*.css']
        }
      }
    },

    // Auto add vendor prefixes
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

    // add headers, footers, etc.
    
    includereplace: {
      build: {
        src: 'src/*.html',
        dest: 'build/',
        flatten: true,
        cwd: '.',
        expand: true
      }
    },

    // Watch
    watch: {
      stylesheets: {
        files: ['src/**/*.scss'],
        tasks: ['stylesheets']
      },
      scripts: {
        files: 'src/**/*.js',
        tasks: ['scripts']
      },
      includereplace: {
        files: ['src/**/*.html'],
        tasks: ['includereplace']
      }
    },

    // Development Server
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'build',
          hostname: 'localhost'
        }
      }
    }
    
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('stylesheets', 'Compiles the stylesheets.', ['sass', 'autoprefixer', 'cssmin', 'clean:stylesheets']);

  grunt.registerTask('scripts', 'Compiles the JavaScript files.', ['browserify', 'uglify', 'clean:scripts']);

  grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['clean:build', 'copy', 'includereplace', 'stylesheets', 'scripts', 'clean:vendor']);
  
  grunt.registerTask('default', 'Watches the project for changes, automatically builds them and runs a server.', [ 'build', 'connect', 'watch' ]);
}
