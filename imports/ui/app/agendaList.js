import { Template } from 'meteor/templating';

import { Dates } from '../../api/server.js';
import { Desks } from '../../api/server.js';

import './agendaList.html'

// Agendalist helpers
Template.agendaList.helpers({
	dates() {
		// Get today's month year and date and render the rest of this month plus the next
		var thisDate = new Date;
		var thisYear = thisDate.getFullYear();
		var thisMonth = thisDate.getMonth();
		var thisDate = thisDate.getDate() - 1;
		var dates = Dates.findOne({year: thisYear});
		var thisMonthDates = dates && dates.dates && dates.dates[thisMonth];
		thisMonthDates.splice(0, thisDate);
		var nextMonthDates = dates && dates.dates && dates.dates[thisMonth+1];
		var twoMonths = thisMonthDates.concat(nextMonthDates);
		// Remove weekend days
		var withoutWeekends = twoMonths.filter(function (el) {
		      return el.weekday !== 'sat' && el.weekday !== 'sun';
		});
		return withoutWeekends;
	},
	'listData': function() {
		// Get number of people with flex desk and number of absents
		var flexUsers = Meteor.users.find({'profile.desk': 'flex'}).fetch().length;
		var absents = this.absent.length;
		var peopleComing = flexUsers - absents;
		// Get number of flex desks and number of extra flex desks
		var flexDesks = Desks.findOne({name: 'desksInfo'}) && Desks.findOne({name: 'desksInfo'}).flexDesks;
		var extraFlexDesks = this.extraFlexDesks.length;
		var availableDesks = flexDesks + extraFlexDesks;
		// Get total total number of guests and user guests
		var thisDate = Dates.findOne({year: this.year}).dates[this.monthNumber][this.date-1];
		var guests = thisDate.guests;
		var userGuests = guests[Meteor.userId()];
		function sum(obj) {
			var sum = 0;
			for(var el in obj) {
				if(obj.hasOwnProperty(el)) {
					sum += parseFloat(obj[el]);
				}
			}
			return sum;
		} // Source: http://stackoverflow.com/questions/16449295/a-concise-way-to-sum-the-values-of-a-javascript-object
		var totalGuests = sum(guests);
		// Substract available desks with coming people and return
		var ratio = availableDesks - peopleComing - totalGuests;
		// Check if positive or negative
		if (ratio < 0) {
			var value = 'negative';
		} else {
			var value = 'positive';
			var ratio = '+'+ratio;
		};
		// Check if absent or present
		if (thisDate.absent.indexOf(Meteor.userId()) > -1) {
			var precense = false;
		} else {
			var precense = true;
		}
		// Check if friday
		if(this.weekday === 'fri') {
			var friday = true;
		} else {
			var friday = false;
		}
		// Return object
		return {
			peopleComing: peopleComing,
			availableDesks: availableDesks,
			ratio: ratio,
			value: value,
			present: precense,
			friday: friday,
			guests: userGuests,
			totalGuests: totalGuests
		};
	}
});

// Agendalist Events
Template.agendaList.events({
	'click .agenda-main'(event) {
		var drawer = event.currentTarget.parentElement.querySelector('.agenda-drawer');
		var main = event.currentTarget;
		main.classList.toggle('drawer-active');
		drawer.classList.toggle('drawer-active');
	},
	'click .absent-button'(event) {
		var date = this.date -1;
		var month = this.monthNumber;
		var year = this.year;
		
		var setModifier = { $push: {} };
		setModifier.$push['dates.'+month+'.'+date+'.absent'] = Meteor.userId();

		Meteor.call('insertPrecense', year, setModifier);
	},
	'click .present-button'(event) {
		var date = this.date -1;
		var month = this.monthNumber;
		var year = this.year;
		
		var setModifier = { $pull: {} };
		setModifier.$pull['dates.'+month+'.'+date+'.absent'] = Meteor.userId();

		Meteor.call('insertPrecense', year, setModifier);
	},
	'change .guests-number'(event) {
		var date = this.date -1;
		var month = this.monthNumber;
		var year = this.year;
		var value = parseInt(event.currentTarget.value);
		
		var setModifier = { $set: {} };
		setModifier.$set['dates.'+month+'.'+date+'.guests.'+Meteor.userId()] = value;

		Meteor.call('insertPrecense', year, setModifier);
	}
});