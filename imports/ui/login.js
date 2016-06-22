import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './login.html';

Template.login.events({
	'submit form'(event, template) {
		// Prevent refresh
		event.preventDefault();
		// Get form data
		var username = template.find('#username').value;
		var password = template.find('#password').value;
		// Login with userdata
		Meteor.loginWithPassword(username, password, function(err) {
			if (err) {
				// If error, show message with reason
				Session.set('messageVisible', true);
				Session.set('messageConfirmation', false);
				Session.set('messageText', err.reason);
			};
		});
		// Redirect to home
		Router.go('/');
	}
});