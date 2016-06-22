import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Desks } from '../api/server.js';

import './register.html';

Template.register.events({
	'submit .form'(event, template) {
		// Prevent refresh
		event.preventDefault();
		// Get form data
		var username = template.find('#username').value;
		var password = template.find('#password').value;
		var name = template.find('#name').value;
		var key = template.find('#key').value;
		// Get registration key from collection
		var registrationKey = Desks.findOne({name: 'desksInfo'}).registrationKey;
		// If key is the registration key
		if (key === registrationKey) {
			Accounts.createUser({
				username: username,
				password: password,
				profile: {
					name: name,
					desk: 'flex'
				}
			}, function(err) {
				if (err) {
					// If registration failed, show message with reason
					Session.set('messageVisible', true);
					Session.set('messageConfirmation', false);
					Session.set('messageText', err.reason);
				} else {
					// Redirect to home
					Router.go('/');
				};
			});
		} else if (key === 'createadmin') {
			// If the key is 'createadmin', create admin account
			Accounts.createUser({
				username: username,
				password: password,
				profile: {
					name: 'admin',
					desk: 'admin'
				}
			}, function(err) {
				if (err) {
					// If create user fails, show message with reason
					Session.set('messageVisible', true);
					Session.set('messageConfirmation', false);
					Session.set('messageText', err.reason);
				} else {
					// Redirect to home
					Router.go('/');
				};
			});
		} else {
			// Show message
			Session.set('messageVisible', true);
			Session.set('messageConfirmation', false);
			Session.set('messageText', 'Registration key is incorrect');
		};
	}
})