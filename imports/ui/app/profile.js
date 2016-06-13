import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './profile.html'

// Profile helpers
Template.profile.helpers({
	'userData': function() {
		var username = Meteor.user() && Meteor.user().username;
		var name = Meteor.user() && Meteor.user().profile && Meteor.user().profile.name;
		var desk = Meteor.user() && Meteor.user().profile && Meteor.user().profile.desk;
		return {
			username: username,
			name: name,
			desk: desk
		};
	}
})

// Profile Events
Template.profile.events({
	'submit .profile-form'(event, template) {
		event.preventDefault();

		var username = template.find('#username').value;
		var password = template.find('#password').value;
		var name = template.find('#name').value;

		// Check if field has changed
		if (password !== '') {
			Session.set('messageVisible', true);
			Session.set('messageConfirmation', true);
			Session.set('messageText', 'Are you sure you want to reset your password?');
			Session.set('messageName', 'change-password');
			Session.set('password', password);
		} else {
			Session.set('messageVisible', true);
			Session.set('messageConfirmation', false);
			Session.set('messageText', 'Changes saved!');
		};
		// Update username and name
		Meteor.call('updateName', name, username);

	
	},
	'click .logout'(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/');
	}
});