define(['despritz',], function(despritz) {

	// set up
	var current_session = despritz.init_session(),
	reticle = document.getElementById('reticle');

	current_session.override('set_word', function(args, old) {
		var session = this;
		old.call(session, args);

		var pivot_elem;

		for(var i = 0; i < session.elements.box.children.length; ++i) {
			var child = session.elements.box.children[i];

			if (child.className.indexOf('pivot') != -1) {
				pivot_elem = child;
				break;
			}
		}

		var pivot_width = pivot_elem.offsetWidth;
		var pivot_offset = pivot_elem.offsetLeft;
		var span_offset = reticle.offsetLeft;

		session.elements.box.style.left =
			span_offset - pivot_offset - pivot_width/2 + 'px'
	});

	// start
	var spritzify_random = function() {
		// get random text
		var test_div = document.getElementById('test');
		var random_index = test_div.children.length * Math.random();
		random_index = Math.floor(random_index);
		var random_text = test_div.children[random_index].innerHTML;

		// start the session
		current_session.set_text(random_text);
		current_session.start();
	};

	// stop
	var stop_session = function() {
		current_session.stop();
	}
	var resume_session = function() {
		current_session.start();
	}

	// control
	document.getElementById('start').onclick=spritzify_random;
	document.getElementById('stop').onclick=stop_session;
	document.getElementById('resume').onclick=resume_session;
	document.getElementById('speed').onchange=function(e) {
		var new_wpm
			= current_session.wpm
			= document.getElementById('speed_number').innerHTML
			= e.target.value;
	};
	document.getElementById('speed').value=200;
});
