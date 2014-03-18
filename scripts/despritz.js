define(['findpivot'], function(pivot) {
	Session = function() {
		var self = this;
		self.set_text = function(t) {
			self.words = t.split(' ');
			self.index = 0;
		};
	};

	Session.prototype = {
		index: 0,
		wpm: 200,
		next_timeout: undefined,
		words: undefined,
		running: false,

		elements: {
			box: document.getElementById('box'),
		}, 

		update: function() {
			var session = this,
			word = session.words[session.index];

			if (word == undefined) {
				return session.stop();
			}

			session.set_word({word:word});

			session.next_timeout = setTimeout(function() {
				session.index = parseInt(session.index) + 1;
				if (session.running) {
					session.update();
				}
			}, 60000/session.wpm);
		},

		/* begins a new session or resumes the current one */
		start: function() {
			if (this.running) return;
			this.stop();
			this.running = true;
			this.update();
		},

		generate_letter_element: function(args) {
			var letter = document.createElement('span');
			letter.className = args.is_pivot ? 'pivot letter' : 'letter';
			letter.innerHTML = args.character;
			return letter
		},

		set_word: function(args) {
			var session = this,
				pivot_index = pivot(args.word),
				pivot_char = args.word.charAt(pivot_index);

			session.elements.box.innerHTML = ''; 

			args.word.split('').forEach(function(character, index) {
				var child = session.generate_letter_element({
					character: character, 
					is_pivot: index == pivot_index
				});

				session.elements.box.appendChild(child);
			});
		},

		stop: function() {
			var session = this;
			session.running = false;
			clearTimeout(session.next_timeout);
		},

		get_pivot_letter: function() {
			var session = this;
			for(var i = 0; i < session.elements.box.children.length; ++i) {
				var child = session.elements.box.children[i];

				if (child.className.indexOf('pivot') != -1) {
					return child;
				}
			}
		},

		get_text_before: function() {
			var session = this;
			return session.words.slice(0, session.index).join(' ');
		},

		get_text_after: function() {
			var session = this;
			return session.words.slice(parseInt(session.index)+1).join(' ');
		},

		override: function(name, new_function) {
			var session = this,
			old_function = session[name];

			session[name] = function(args) {
				new_function.call(session, args, old_function);
			}
		},

		set_index: function(index) {
			var session = this;
			session.index = index;
			if (!session.running) {
				session.update();
			}
		}
	};

	return {
		/* Client calls this to begin a session on a specified text. */
		init_session: function() {
			session = new Session();
			return session;
		}
	};

});
