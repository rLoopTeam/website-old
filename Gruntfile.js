module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        browserify: {
          files: {
              'bundle.js': ['assets/vendor/js/**/*.js''assets/js/**/*.js'],
          },
          'browserifyOptions': {
              'debug':true
          },
          dist: {
            'browserifyOptions': {
              'debug':false
            }
          },
          dev: {}
        },
        jshint: {
          jshintrc: true
        }
	});
	require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['dist']);
	grunt.registerTask('dist', ['browserify:dist', 'jshint']);
	grunt.registerTask('dev', ['browserify:dev', 'jshint']);
	grunt.registerTask('watch', ['browserify:watch', 'jshint']);
}
