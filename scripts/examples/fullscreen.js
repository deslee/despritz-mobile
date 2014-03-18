var App = function() {
};

App.prototype.initialize = function() {
	this.bindEvents();
};

App.prototype.bindEvents = function() {
	document.addEventListener('deviceready', this.onDeviceReady, false);
};

App.prototype.onDeviceReady = function() {
};
