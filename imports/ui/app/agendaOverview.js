import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './agendaOverview.html'

Template.agendaOverview.helpers({
	dates() {
		// Get selected month and year
		var givenMonth = Session.get('givenMonth');
		var givenYear = Session.get('givenYear');
		// If no month is selected, select this month
		if(givenMonth == null) {
			var thisDate = new Date;
			var thisYear = thisDate.getFullYear();
			var thisMonth = thisDate.getMonth();
			Session.set('givenMonth', thisMonth);
			Session.set('givenYear', thisYear);
		} else {
			var thisMonth = givenMonth;
			var thisYear = givenYear;
		}
		// Get today's month year and date and render the rest of this month plus the next
		var dates = Dates.findOne({year: thisYear});
		var thisMonthDates = dates && dates.dates && dates.dates[thisMonth];

		return thisMonthDates;
	},
	'overviewData': function() {
		// Check if weekend day
		if(this.weekday === 'sat' || this.weekday === 'sun') {
			var weekend = true;
		} else {
			var weekend = false;
		};
		// Check if absent or present
		var thisDate = Dates.findOne({year: this.year}).dates[this.monthNumber][this.date-1].absent;
		if (thisDate.indexOf(Meteor.userId()) > -1) {
			var precense = false;
		} else {
			var precense = true;
		};
		// Return precense and weekend day
		return {
			present: precense,
			weekend: weekend
		};
	},
	'currentMonth': function() {
		// Translate number in text of the right month and return
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return months[Session.get('givenMonth')] + ' ' + Session.get('givenYear');
	}
});
// Calendar events
Template.agendaOverview.events({
	'click .block-text'(event) {
		event.preventDefault();
		// Get the date
		var date = this.date -1;
		var month = this.monthNumber;
		var year = this.year;
		var thisDate = Dates.findOne({year: this.year}).dates[this.monthNumber][this.date-1].absent;
		// Check if already absent
		if (thisDate.indexOf(Meteor.userId()) > -1) {
			// Set user on present
			var setModifier = { $pull: {} };
			setModifier.$pull['dates.'+month+'.'+date+'.absent'] = Meteor.userId();
			Meteor.call('insertPrecense', year, setModifier);
		} else {
			// Set user on absent
			var setModifier = { $push: {} };
			setModifier.$push['dates.'+month+'.'+date+'.absent'] = Meteor.userId();
			Meteor.call('insertPrecense', year, setModifier);
		}
	},
	'click .arrow-right'(event) {
		event.preventDefault();
		// Get next month
		var givenMonth = Session.get('givenMonth') + 1;
		var givenYear = Session.get('givenYear');
		// If next month is next year, Add year
		if(givenMonth == 12) {
			givenYear++;
			var givenMonth = 0;
		};
		// Render next month
		Session.set('givenYear', givenYear);
		Session.set('givenMonth', givenMonth);
	},
	'click .arrow-left'(event) {
		event.preventDefault();
		// Get previous month
		var givenMonth = Session.get('givenMonth') - 1;
		var givenYear = Session.get('givenYear');
		// If previews month is previous year, substract a year
		if(givenMonth == -1) {
			givenYear--;
			var givenMonth = 11;
		};
		// Render previous month
		Session.set('givenYear', givenYear);
		Session.set('givenMonth', givenMonth);
	}
});