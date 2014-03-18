

var ng_module = angular.module('despritz', ['ionic']);

function FileChooserController($scope) {
	app = new App();
	app.initialize();
	$scope.files = [];

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

	$scope.browse = function(path) {
		console.log(path);
		if ($scope.debug) {
			$scope.files = [
				{ 
					name: 'dir1',
					isDirectory: true,
					isFile: false,
					fullPath: 'foobar'
				},
				{ 
					name: 'f1',
					isDirectory: false,
					isFile: true,
					fullPath: 'bazbaz'
				},
			]
			$scope.filePath = path || 'null';
			return;
		}

		if (!path){
			// get the local file system and pass the result to the success callback
			window.requestFileSystem(window.PERSISTENT, 0, $scope.requestFileSystemSuccess, null);
		} else {
			alert(path);
			window.resolveLocalFileSystemURI(path, 
				function(filesystem){
					// we must pass what the PhoneGap API doc examples call an "entry" to the reader
					// which appears to take the form constructed below.
					requestFileSystemSuccess({root:filesystem});
				},
				function(err){
					// Eclipse doesn't let you inspect objects like Chrome does, thus the stringify
					alert('### ERR: filesystem.beginBrowseForFiles() -' + (JSON.stringify(err)));
				}
			);
		}
	},

	$scope.requestFileSystemSuccess = function(fileSystem) {
		console.log('request filesystem success')
		$scope._currentFileSystem = fileSystem;
		$scope.filePath = fileSystem.root.fullPath || 'null';

		var directoryReader = fileSystem.root.createReader();
		directoryReader.readEntries($scope.directoryReaderSuccess, $scope.fail);
	}

	$scope.directoryReaderSuccess = function(entries) {
		entries.sort(function(a,b){return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)});

		$scope.files = entries;
		console.log(entries);
		$scope.$apply()
	}

	$scope.fail = function() {

	}

	$scope.entry_selected = function(entry) {
		alert('entry_selected')
		if (entry.isDirectory) {
			$scope.browse('file:///'+entry.fullPath);
		}
		else {
		}
	}
}