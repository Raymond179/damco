import './login.html';

Template.login.events({
	'submit form'(event, template) {
		event.preventDefault();

		var username = template.find('#username').value;
		var password = template.find('#password').value;
		Meteor.loginWithPassword(username, password);

		Router.go('/');
	}
});