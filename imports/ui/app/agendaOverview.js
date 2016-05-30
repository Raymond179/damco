import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './agendaOverview.html'

Template.agendaOverview.helpers({
	dates() {
		var givenMonth = Session.get('givenMonth');
		var givenYear = Session.get('givenYear');

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
		
		// var thisDate = thisDate.getDate() - 1;
		var dates = Dates.findOne({year: thisYear});
		var thisMonthDates = dates && dates.dates && dates.dates[thisMonth];
		// thisMonthDates.splice(0, thisDate);

		return thisMonthDates;
	},
	'overviewData': function() {
		// Check if weekend day
		if(this.weekday === 'sat' || this.weekday === 'sun') {
			var weekend = true;
		} else {
			var weekend = false;
		}
		// Check if absent or present
		var thisDate = Dates.findOne({year: this.year}).dates[this.monthNumber][this.date-1].absent;
		if (thisDate.indexOf(Meteor.userId()) > -1) {
			var precense = false;
		} else {
			var precense = true;
		}
		return {
			present: precense,
			weekend: weekend
		}
	},
	'currentMonth': function() {
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return months[Session.get('givenMonth')] + ' ' + Session.get('givenYear');
	}
});

Template.agendaOverview.events({
	'click .agenda-block'(event) {
		var date = this.date -1;
		var month = this.monthNumber;
		var year = this.year;
		var thisDate = Dates.findOne({year: this.year}).dates[this.monthNumber][this.date-1].absent;
		if (thisDate.indexOf(Meteor.userId()) > -1) {
			var setModifier = { $pull: {} };
			setModifier.$pull['dates.'+month+'.'+date+'.absent'] = Meteor.userId();

			Meteor.call('insertPrecense', year, setModifier);
		} else {
			var setModifier = { $push: {} };
			setModifier.$push['dates.'+month+'.'+date+'.absent'] = Meteor.userId();

			Meteor.call('insertPrecense', year, setModifier);
		}
	},
	'click .arrow-right'(event) {
		// Get next month
		var givenMonth = Session.get('givenMonth') + 1;
		var givenYear = Session.get('givenYear');

		if(givenMonth == 12) {
			givenYear++;
			var givenMonth = 0;
		}
		// Render next month
		Session.set('givenYear', givenYear);
		Session.set('givenMonth', givenMonth);
		
	},
	'click .arrow-left'(event) {
		// Get previous month
		var givenMonth = Session.get('givenMonth') - 1;
		var givenYear = Session.get('givenYear');

		if(givenMonth == -1) {
			givenYear--;
			var givenMonth = 11;
		}
		// Render previous month
		Session.set('givenYear', givenYear);
		Session.set('givenMonth', givenMonth);
	}
})