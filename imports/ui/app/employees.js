import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './employees.html'

// Employees helpers
Template.employees.helpers({
	employees() {	
		// Render all employees
		return Meteor.users.find({'profile.desk': {$not: 'admin'}});
	},
	'employeeData': function() {
		// Get name and desk type of employee
		var name = this.profile.name;
		var desk = this.profile.desk;
		// If flex desk, set flex to true
		if (desk === 'flex') {
			var flex = true;
			var fixed = false;
		} else {
			var flex = false;
			var fixed = true;
		};
		return {
			name: name,
			flex: flex,
			fixed: fixed
		};
	}
});

// Employees Events
Template.employees.events({
	'click .employee-main'(event) {
		event.preventDefault();
		// Toggle drawer
		var drawer = event.currentTarget.parentElement.querySelector('.employee-drawer');
		var main = event.currentTarget;
		main.classList.toggle('main-active');
		drawer.classList.toggle('drawer-active');
	},
	'click .desk-toggle-flex'(event) {
		// Set users desk to flex
		Meteor.call('deskChange', this._id, 'flex');
	},
	'click .desk-toggle-fixed'(event) {
		// Set users desk to fixed
		Meteor.call('deskChange', this._id, 'fixed');
	},
	'click .cross'(event) {
		// Show message
		Session.set('messageVisible', true);
		Session.set('messageConfirmation', true);
		Session.set('messageText', 'Are you sure you want to delete this user?');
		Session.set('messageName', 'delete-user');
		Session.set('userId', this._id);
	}
});