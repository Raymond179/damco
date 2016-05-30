Router.configure({
    layoutTemplate: 'frame'
});

Router.route('/', {
	template: 'home'
});

Router.route('/login', {
	template: 'login'
});

Router.route('/register', {
	template: 'register'
});

Router.route('/overview', {
	template: 'agendaOverview'
});

Router.route('/profile', {
	template: 'profile'
});

Router.route('/settings', {
	template: 'settings'
});