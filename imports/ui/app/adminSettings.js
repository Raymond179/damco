import { Template } from 'meteor/templating';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './adminSettings.html'

// Admin helpers
Template.adminSettings.helpers({
	'adminData': function() {
		var flexEmployees = Meteor.users.find({'profile.desk': 'flex'}).fetch().length;
		var fixedEmployees = Meteor.users.find({'profile.desk': 'fixed'}).fetch().length;
		var flexDesks = Desks.findOne({name: 'desksInfo'}) && Desks.findOne({name: 'desksInfo'}).flexDesks;
		var registrationKey = Desks.findOne({name: 'desksInfo'}) && Desks.findOne({name: 'desksInfo'}).registrationKey;
		return {
			flexEmployees: flexEmployees,
			fixedEmployees: fixedEmployees,
			flexDesks: flexDesks,
			registrationKey: registrationKey
		}
	}
})

// Admin Events
Template.adminSettings.events({
	'submit .admin-form'(event, template) {
		event.preventDefault();

		var flexDesks = parseInt(template.find('#flexDesks').value);
		var adminPassword = template.find('#adminPassword').value;
		var registrationKey = template.find('#registrationKey').value;

		// Check if field has changed
		if (adminPassword !== '') {
			Meteor.call('updatePassword', password);
			Router.go('/');
		};
		// Update username and name
		Meteor.call('updateAdmin', flexDesks, registrationKey);
	},
	'click .logout'(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/');
	}
});