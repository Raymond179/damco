import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Dates } from '../api/server.js';
import { Desks } from '../api/server.js';

import './frame.html';
import './login.js';
import './register.js';
import './home.html';
import './app/agendaList.js';
import './app/agendaOverview.js';
import './app/profile.js';
import './app/settings.js';
import './app/employees.js';
import './app/adminSettings.js';
import './router.js';

// When body template is created
Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('users');
	Meteor.subscribe('dates');
	Meteor.subscribe('desks');
});

// When dates are loaded
Meteor.subscribe("dates", function() {
    // Check if it's next year
	var thisYear = new Date;
	var nextYear = thisYear.getFullYear()+1
	var findYear = Dates.findOne({year: nextYear});
	if(findYear == null) {
		// Add new year's dates
		Meteor.call('dates.insert',{year: nextYear, dates: Template.frame.__helpers.get('getData')(nextYear)});
	};
});
// Global helpers
Template.registerHelper('admin', function() {
	var status = Meteor.user().profile.desk;
	if (status === 'admin') {
		return true;
	} else {
		return false;
	};
});
// Frame Events
Template.frame.events({
	'click .app-header'(event) {
		Meteor.call('dates.remove');
		Meteor.call('dates.insert',{year: 2016, dates: Template.frame.__helpers.get('getData')(2016)});
	}
});
// Frame Helpers
Template.frame.helpers({
	'getData': function(year) {
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var weekdays = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
		// Get the first day of the given year
		var date = new Date(year, 0, 1);
		var month = date.getMonth();
		var data = {};
		// Loop through all months in that year
		for (var i = 0; i < 12; i++) {
			data[date.getMonth()] = [];
			// Loop through all days in that month
			while (date.getMonth() === i) {
				var newDate = new Date(date);
				data[date.getMonth()].push(
					{
						weekday: weekdays[newDate.getDay()],
						date: newDate.getDate(),
						month: months[newDate.getMonth()],
						monthNumber: newDate.getMonth(),
						year: newDate.getFullYear(),
						absent: [],
						extraFlexDesks: [],
						guests: {}
					}
				);
				date.setDate(date.getDate() + 1);
			}
		}
		return data;
	}
});