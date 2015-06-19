module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});
	require('load-grunt-tasks')(grunt);
	grunt.registerTask('build', ['watch']);
}
