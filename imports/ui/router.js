Router.configure({
    layoutTemplate: 'frame'
});

Router.route('/', {
	template: 'home',
	onBeforeAction: function() {
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		// get year
		var thisDate = new Date;
		var thisYear = thisDate.getFullYear();
		this.wait(Meteor.subscribe('dates', {year: thisYear}));

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
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		// get year
		this.wait(Meteor.subscribe('dates'));

		if (this.ready()) {
			this.render();
			this.render('nothing', {to: 'loading'});
		}
	}
});

Router.route('/profile', {
	template: 'profile',
	onBeforeAction: function() {
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		this.subscribe('users').wait();

		if (this.ready()) {
			this.render();
			this.render('nothing', {to: 'loading'});
		}
	}
});

Router.route('/settings', {
	template: 'settings',
	onBeforeAction: function() {
		this.render('loading', {to: 'loading'});
	},
	data: function() {
		this.subscribe('dates').wait();

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