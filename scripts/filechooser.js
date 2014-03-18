var ng_module = angular.module('despritz', ['ionic']);

function FileChooserController($scope) {
	app = new App();
	app.initialize();
	$scope.files = [];

	$scope.debug = false;
	$scope.chooseFileState = true;

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;


	$scope.browse = function(path) {
		$scope.chooseFileState = true;
		$scope.$apply()
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
			return;
		}

		$scope.path = path;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $scope.requestFileSystemSuccess, null);
	},

	$scope.requestFileSystemSuccess = function(fileSystem) {
		if($scope.path) {
			fileSystem.root.getDirectory($scope.path, {}, function(directoryEntry) {
				$scope.switchDirectory(directoryEntry);
				$scope.showUpOneLevel = true;
			}, function(err) {
				alert('ERROR ' + JSON.stringify(err));
			})
		}
		else {
			$scope.switchDirectory(fileSystem.root);
		}
	}

	$scope.switchDirectory = function(directoryEntry) {
		$scope._current = directoryEntry;
		directoryEntry.createReader().readEntries($scope.directoryReaderSuccess, $scope.fail);
	}

	$scope.directoryReaderSuccess = function(entries) {
		entries.sort(function(a,b){return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)});

		$scope.files = entries;
		console.log(entries);
		$scope.$apply()
	}

	$scope.fail = function() {

	}

	$scope.toggleMenu = function() {
	  $scope.sideMenuController.toggleLeft();
	};
	$scope.toggleAbout = function() {
	  $scope.sideMenuController.toggleRight();
	};

	$scope.doDirectoryUp = function() {
		$scope._current.getParent(function(directoryEntry) {
			$scope.switchDirectory(directoryEntry);
			if (directoryEntry.fullPath == '/') {
				$scope.showUpOneLevel = false;
			}
		}, function(err) {
			alert('ERROR ' + JSON.stringify(err));
		});
	}

	$scope.entry_selected = function(entry) {
		if (entry.isDirectory) {
			$scope.browse(entry.fullPath.slice(1)); // slice off the backslash
		}
		else {
			entry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					var txt = this.result;
					$scope.result = txt;
					$scope.chooseFileState = false;
					$scope.finished()
				};

				reader.readAsText(file);
			}, function(err) {
				alert('ERROR ' + JSON.stringify(err));
			});
		}
	}

	$scope.finished = function() {
		$scope.$apply()
		var session = init_session(),
			reticle = document.getElementById('reticle'),
			before = document.getElementById('before'),
			after = document.getElementById('after'),
			seeker = document.getElementById('seeker');

		s = session;
		document.getElementById('start').onclick = function(e) {
			e.preventDefault();
			session.start();
		}
		document.getElementById('stop').onclick = function(e) {
			e.preventDefault();
			session.stop();
		}

		session.override('set_word', function(args, old) {
			var session = this;
			old.call(session, args);

			var pivot_text = session.get_pivot_letter();

			session.elements.box.style.left =
				reticle.offsetLeft - pivot_text.offsetLeft - pivot_text.offsetWidth/2 + 'px'

			seeker.value = session.index;
		});

		seeker.onchange = function(e) {
			session.set_index(e.target.value);
		}

		document.getElementById('speed').onchange=function(e) {
			session.wpm 
				= document.getElementById('speed_number').innerHTML
				= e.target.value;
		};

		session.elements.box = document.getElementById('box');

		session.set_text($scope.result)
		seeker.max = session.words.length;
		session.update();

		var body = document.getElementsByTagName('body')[0],
		killEvents = function(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		}, fileSelect = document.getElementById('file');

		['draginit','dragstart','dragover','dragleave','dragenter','dragend','drag','drop'].forEach(function(e){
	  		body.addEventListener(e, killEvents);
	  	})

	  	body.addEventListener('dragenter', function(e) {
	  	}, false);

	  	body.addEventListener('drop', function(e) {
	  		var file = e.dataTransfer.files[0],
	  		reader = new FileReader();

	  		var text = reader.readAsText(file);
	  		reader.onloadend = function(e) {
	  			var text = e.target.result;
	  			session.set_text(text);
	  			session.set_index(0);
	  			session.start();
	  		}
	  	}, false);
	}

	$scope.open_url = function(url) {
		window.open(url, '_system');
	}
}