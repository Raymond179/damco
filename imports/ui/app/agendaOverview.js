import { Template } from 'meteor/templating';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './agendaOverview.html'

Template.agendaOverview.helpers({
	dates() {
		// Get today's month year and date and render the rest of this month plus the next
		var thisDate = new Date;
		var thisYear = thisDate.getFullYear();
		var thisMonth = thisDate.getMonth();
		var thisDate = thisDate.getDate() - 1;
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
	}
})