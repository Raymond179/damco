import { Template } from 'meteor/templating';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './profile.html'

// Profile helpers
Template.profile.helpers({
	'userData': function() {
		var username = Meteor.user() && Meteor.user().username;
		var name = Meteor.user() && Meteor.user().profile && Meteor.user().profile.name;
		return {
			username: username,
			name: name
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
			Meteor.call('updatePassword', password);
			Router.go('/');
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