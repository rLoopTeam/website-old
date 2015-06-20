module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        browserify: {
          files: {
              'dist/bundle.js': ['assets/vendor/js/**/*.js''assets/js/**/*.js'],
          },
          'browserifyOptions': {
              'debug':true
          },
          dist: {
            'browserifyOptions': {
              'debug':false
            }
          },
          dev: {},  
          watch: {
            watch: true,
            keepAlive: true
          }
        }
	});
	require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['dist']);
	grunt.registerTask('dist', ['browserify:dist']);
	grunt.registerTask('dev', ['browserify:dev']);
	grunt.registerTask('watch', ['browserify:watch']);
}
