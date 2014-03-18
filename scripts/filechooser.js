fileChooser = {
	init: function() {
		fileChooser._currentFileSystem = null;
		fileChooser.folderName = document.getElementById('folderName');
	},

	browse: function(e) {
		if (!e.target.attributes['data-path']){
			// get the local file system and pass the result to the success callback
			window.requestFileSystem(window.PERSISTENT, 0, fileChooser.requestFileSystemSuccess, null);
		} else {
			// this is used to get subdirectories
			var path = e.target.attributes['data-path'].nodeValue;
			window.resolveLocalFileSystemURI(path, 
				function(filesystem){
					// we must pass what the PhoneGap API doc examples call an "entry" to the reader
					// which appears to take the form constructed below.
					fileChooser.requestFileSystemSuccess({root:filesystem});
				},
				function(err){
					// Eclipse doesn't let you inspect objects like Chrome does, thus the stringify
					console.log('### ERR: filesystem.beginBrowseForFiles() -' + (JSON.stringify(err)));
				}
			);
		}
	},

	requestFileSystemSuccess: function(fileSystem) {
		fileChooser._currentFileSystem = fileSystem;
		fileChooser.folderName.innerHTML = fileSystem.root.fullPath;

		var directoryReader = fileSystem.root.createReader();
		directoryReader.readEntries(fileChooser.directoryReaderSuccess, fileChooser.fail);
	},

	directoryReaderSuccess: function() {

	},

	fail: function() {

	},
}