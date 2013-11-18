module.exports = function(grunt)
{
	'use strict';
	var fileHeader = '';//'/* Generated using a grunt task. DO NOT edit this file directly or your changes may be overwritten */';
	var fs = require('fs'), pathModule = require('path');
	function convertToBase64Url(url) {
		var sizeLimit = 64000;
		var mimeTypes = {'.gif': 'image/gif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.eot': 'application/vnd.ms-fontobject', '.ttf': 'font/ttf', '.otf': 'font/otf'};
		var extension = pathModule.extname(url);
		if (mimeTypes[extension]){
			if (fs.existsSync(url)) {
				var buf = fs.readFileSync(url);
				if (buf.length < sizeLimit){
					return 'data:' + mimeTypes[extension] + ';base64,' + buf.toString('base64');
				}
			}
			else {
				console.warn('could not find ' + url);
			}
		}
		return null;
	}

	function embedUrls(data, path, prefixes, baseUrl) {
		var r = data;
		/* jshint unused: true */
		r = r.replace(/url\s*\(\s*['"]?([^'"\)]*)['"]?\s*\)/g, function($0, url){
			var newUrl = pathModule.resolve(baseUrl, url);
			var embedded = convertToBase64Url(newUrl);
			if (embedded) {
				url = embedded;
			}
			return 'url(\'' + url + '\')';
		});

		return r;
	}

	grunt.registerMultiTask('ncss', 'compile ncss to css', function()
	{
		console.log('Running ncss');
		var done = this.async();
		var files = this.filesSrc;
		var options = this.options();
		var extension = options.extension || 'css';

		fileHeader = options.fileHeader || fileHeader;

		var length = files.length;
		console.log('ncss ' + files.length + ' files');
		files.forEach(function(file) {
			if (/\.ncss$/.test(file)) {
				var newFile = file.substr(0, file.length -5) + '.' + extension;
				var data = grunt.file.read(file);
				data = embedUrls(data, file, null, pathModule.resolve(pathModule.dirname(file)));
				grunt.file.write(newFile, fileHeader + '\n' + data);
				length -= 1;
				if (!length) {
					done();
				}
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