var app = angular.module ('processApp',['ngMaterial','ngMdIcons']);
app.controller ('ProcessingController', function ($scope, $http, $window, $timeout){

	$scope.scripts = [];
	$scope.picture;
	$scope.selectedScripts = [];
	$scope.downloadButton = false;

	var pictureName;

	$scope.download = function ()
	{
		$http.get(API + '/download/'+pictureName)
		.success(function(data, status, headers, config) {
		    $window.open('/download/'+pictureName);
		  }).
		  error(function(data, status, headers, config) {
		    console.log('ERROR: could not download file');
		  });
	};

	$scope.uploadFile = function(files)
	{
	    var fd = new FormData();
	    var file = files[0];
	    fd.append("file", file);
	   	$http.post(API + '/file', fd,
	   	{headers:{'Content-Type':undefined},transformRequest: angular.identity})
		.success(function (){
   			if (file.type.includes ('image'))
   			{
   				$scope.picture = 'images/' + file.name;
   				pictureName = file.name;
   			}
   		});
	};

	$scope.process = function ()
	{
		console.log ($scope.selectedScripts);
		$http.post (API + '/process/'+pictureName, {scripts:$scope.selectedScripts})
		.success (function (response){
			console.log (response);
			if (response.status === 'done')
			{
				if (response.file)
				{
					$scope.picture = 'images/' + response.file;
					pictureName = response.file;
				}
				$scope.downloadButton = true;
			}	
		});
	};

	$scope.removeScript = function (index)
	{
		$scope.selectedScripts.splice(index, 1);
	};

	$scope.scriptSelected = function (script){

		console.log (script);
		$scope.selectedScripts.push (script);
		console.log ($scope.selectedScripts);
	};

	$http.get (API + '/scripts')
	.success (function (response){
		if (response.status === 'done')
		{
			console.log (response.files);
			$scope.scripts = response.files;
		}
	});

});
