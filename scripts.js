'use strict';

var fs = require ('fs');
var async = require ('async');
var spawn = require('child_process').spawn;

module.exports = 
{
	getScripts: function (cb)
	{
		fs.readdir ('scripts', function (err, files){
			var scripts = [];
			for (var i=0; i<files.length; i++)
			{
				scripts.push ({name:files[i]});
			}
			cb (err, scripts);
		});
	},

	process: function (scripts, fileName, cb)
	{
		var tmp = 0;
		var file = fileName;
		async.eachSeries (scripts, function (script, callback){
			var params = [__dirname+'/scripts/'+script.name];
			if (script.params)
				params.push (script.params);
			params.push (__dirname+'/public/images/'+file, __dirname+'/public/images/'+'tmp_'+tmp+fileName)
			var process = spawn ('bash', params);
			
			process.stdout.on('data', (data) => {
			  console.log('stdout: '+data);
			});

			process.stderr.on('data', (data) => {
			  console.log('stderr: '+data);
			});

			process.on('close', function (code){
				console.log ('close ' +code);
				file = 'tmp_'+tmp+fileName;
				tmp = tmp + 1;
	  			callback (code);
			});
		}, function (err){
			tmp = tmp -1;
			fs.rename (__dirname+'/public/images/tmp_'+tmp+fileName, __dirname+'/public/images/processed_'+fileName, function (err){
				for (var i=0; i<tmp; i++)
				{
					fs.unlinkSync (__dirname+'/public/images/tmp_'+i+fileName);
				}
				cb(err, 'processed_'+fileName);
			});
		});
	}
};
