module.exports = function(grunt)
{
	'use strict';
	var less = require('less');
	var path = require('path');
	var fileHeader = '';//'/* Generated using LESS. DO NOT edit this file directly or your changes may be overwritten */';

	grunt.registerMultiTask('less', 'compile less to css', function()
	{
		console.log('Running less');

		var done = this.async();
		var files = this.filesSrc;
		var options = this.options();
		var extension = options.extension || 'css';

		fileHeader = options.fileHeader || fileHeader;

		var length = files.length;
		console.log('less ' + files.length + ' files');
		files.forEach(function(file)
		{
			if (/\.less$/.test(file)) {
				var newFile = file.substr(0, file.length -5) + '.' + extension;
				var data = grunt.file.read(file);
				var Parser = less.Parser;
				var parserObj = new Parser({ paths: [path.resolve(path.dirname(file))] });

				parserObj.parse(data, function(err, tree) {
					if (err) {
						console.error(err);
						done(false);
					}
					else {
						var css = tree.toCSS({});/*, function(err, css) {
							if (err) {
								console.error(err);
								done(false);
							}
							else {
						*/
						grunt.file.write(newFile, fileHeader + '\n' + css);
						length -= 1;
						if (!length) {
							done();
						}
//							}
//						});
					}
				});
			}
			else {
				length -= 1;
				if (!length) {
					done();
				}
			}
		});
	});
};