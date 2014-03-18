var App = function() {
};

App.prototype.initialize = function() {
	this.bindEvents();
};

App.prototype.bindEvents = function() {
	document.addEventListener('deviceready', this.onDeviceReady, false);
};

App.prototype.onDeviceReady = function() {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	document.getElementById('choose-file-button').onclick = function(e) {
		fileChooser.init(e);
		fileChooser.browse(e);
	}
};

var app = new App();
app.initialize();