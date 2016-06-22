Router.configure({
    layoutTemplate: 'frame'
});

Router.route('/', {
	template: 'home',
	onBeforeAction: function() {
		// When loading, show loading template
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		// get year
		var thisDate = new Date;
		var thisYear = thisDate.getFullYear();
		this.wait(Meteor.subscribe('dates', {year: thisYear}));
		// If template is ready, hide loading
		if (this.ready()) {
			this.render();
			this.render('nothing', {to: 'loading'});
		}
	}
});

Router.route('/login', {
	template: 'login'
});

Router.route('/register', {
	template: 'register'
});

Router.route('/overview', {
	template: 'agendaOverview',
	onBeforeAction: function() {
		// When loading, show loading template
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		// get year
		this.wait(Meteor.subscribe('dates'));
		// If template is ready, hide loading
		if (this.ready()) {
			this.render();
			this.render('nothing', {to: 'loading'});
		}
	}
});

Router.route('/profile', {
	template: 'profile',
	onBeforeAction: function() {
		// When loading, show loading template
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		this.subscribe('users').wait();
		// If template is ready, hide loading
		if (this.ready()) {
			this.render();
			this.render('nothing', {to: 'loading'});
		}
	}
});

Router.route('/settings', {
	template: 'settings',
	onBeforeAction: function() {
		// When loading, show loading template
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		this.subscribe('dates').wait();
		// If template is ready, hide loading
		if (this.ready()) {
			this.render();
			this.render('nothing', {to: 'loading'});
		}
	}
});

Router.route('/employees', {
	template: 'employees'
});

Router.route('/adminSettings', {
	template: 'adminSettings'
});