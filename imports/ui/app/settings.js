import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './settings.html'

Template.settings.helpers({
	'checkWeekdays': function(value) {
		var weekdays = Meteor.users.findOne({_id: Meteor.userId()}).profile.settings.weekdays;
		return weekdays.indexOf(value) > -1;
	},
	'checkMonths': function(value) {
		var weekdays = Meteor.users.findOne({_id: Meteor.userId()}).profile.settings.months;
		return weekdays.indexOf(parseInt(value)) > -1;
	}
})

Template.settings.events({
	'submit .default-form'(event, template) {
		event.preventDefault();
		// Get weekdays
		var weekdays = document.querySelectorAll('.weekday-fieldset input[type="checkbox"]');
		var checkedWeekdays = [];
		for (var i = 0; i < weekdays.length; i++) {
			if (weekdays[i].checked) {
				checkedWeekdays.push(weekdays[i].value);
			};
		};
		// Get months
		var months = document.querySelectorAll('.month-fieldset input[type="checkbox"]');
		var checkedMonths = [];
		for (var i = 0; i < months.length; i++) {
			if (months[i].checked) {
				checkedMonths.push(parseInt(months[i].value));
			};
		};
		// Put data in database
		Meteor.call('settingsData', checkedWeekdays, checkedMonths);
		// Put all dates into one array
		var date = new Date;
		var thisYear = date.getFullYear();
		var months = [];
		for (var i = 0; i < checkedMonths.length; i++) {
			var month = Dates.findOne({year:thisYear}).dates[checkedMonths[i]];
			months.push.apply(months,month);
		}
		// Filter dates on weekday
		var weekdayString = '';

		for (var i = 0; i < checkedWeekdays.length; i++) {
			if (i === (checkedWeekdays.length -1)) {
				weekdayString+='(obj.weekday === "'+checkedWeekdays[i]+'")';
			} else {
				weekdayString+='(obj.weekday === "'+checkedWeekdays[i]+'") || ';
			};
		};

		var defaultDays = months.filter(function(obj) {
		    return eval(weekdayString);
		});
		// Send to database
		for (var i = 0; i < defaultDays.length; i++) {
			var month = defaultDays[i].monthNumber;
			var year = defaultDays[i].year;
			var date = defaultDays[i].date -1;

			var thisDate = Dates.findOne({year: year}).dates[month][date].absent;
			if (thisDate.indexOf(Meteor.userId()) === -1) {
				var setModifier = { $push: {} };
				setModifier.$push['dates.'+month+'.'+date+'.absent'] = Meteor.userId();

				Meteor.call('defaultPrecense', year, setModifier);
			};	
		};
		// Send message
		Session.set('messageVisible', true);
		Session.set('messageConfirmation', false);
		Session.set('messageText', 'Changes saved!');
	},
	'click .reset'(event) {
		// Confiration message
		Session.set('messageVisible', true);
		Session.set('messageConfirmation', true);
		Session.set('messageText', 'Are you sure you want to reset your precense?');
		Session.set('messageName', 'reset-precense');
	}
})