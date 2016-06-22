import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './profile.html'

// Profile helpers
Template.profile.helpers({
	'userData': function() {
		// Get userdata
		var username = Meteor.user() && Meteor.user().username;
		var name = Meteor.user() && Meteor.user().profile && Meteor.user().profile.name;
		var desk = Meteor.user() && Meteor.user().profile && Meteor.user().profile.desk;
		// If desk is flex, flex is true
		if (desk === 'flex') {
			var flex = true;
			var fixed = false;
		} else {
			var flex = false;
			var fixed = true;
		};
		return {
			username: username,
			name: name,
			flex: flex,
			fixed: fixed
		};
	}
})

// Profile Events
Template.profile.events({
	'click .profile-button'(event, template) {
		event.preventDefault();
		// Get form data
		var username = template.find('#username').value;
		var password = template.find('#password').value;
		var name = template.find('#name').value;
		// Check if field has changed
		if (password !== '') {
			// Show message
			Session.set('messageVisible', true);
			Session.set('messageConfirmation', true);
			Session.set('messageText', 'Are you sure you want to reset your password?');
			Session.set('messageName', 'change-password');
			Session.set('password', password);
		} else {
			// Show message
			Session.set('messageVisible', true);
			Session.set('messageConfirmation', false);
			Session.set('messageText', 'Changes saved!');
		};
		// Update username and name
		Meteor.call('updateName', name, username);	
	},
	'click .desk-toggle-flex'(event) {
		// Set users desk to flex
		event.preventDefault();
		Meteor.call('deskChange', Meteor.userId(), 'flex');
	},
	'click .desk-toggle-fixed'(event) {
		// Set users desk to fixed
		event.preventDefault();
		Meteor.call('deskChange', Meteor.userId(), 'fixed');
	},
	'click .logout'(event) {
		event.preventDefault();
		// Logout
		Meteor.logout();
		// Redirect to homepage
		Router.go('/');
	}
});