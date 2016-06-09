import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './login.html';

Template.login.events({
	'submit form'(event, template) {
		event.preventDefault();

		var username = template.find('#username').value;
		var password = template.find('#password').value;
		Meteor.loginWithPassword(username, password, function(err) {
			if (err) {
				Session.set('messageVisible', true);
				Session.set('messageConfirmation', false);
				Session.set('messageText', err.reason);
			}
			
		});

		Router.go('/');
	}
});