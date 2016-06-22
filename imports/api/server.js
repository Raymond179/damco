import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
// Create collections Dates and Desks globally
export const Dates = new Mongo.Collection('dates');
export const Desks = new Mongo.Collection('desks');

if (Meteor.isServer) {
	// Publish all collections
	Meteor.publish('users', function tasksPublication() {
		return Meteor.users.find();
	});
	Meteor.publish('dates', function tasksPublication() {
		return Dates.find();
	});
	Meteor.publish('desks', function tasksPublication() {
		return Desks.find();
	});
}
// Server methods wich communicate with the database
Meteor.methods({
	// Insert yearly dates
	'dates.insert'(object) {
		Dates.insert(object);
	},
	// Remove all dates
	'dates.remove'() {
		Dates.remove({})
	},
	// Set presence of a specific day
	'insertPrecense'(year, modifier) {
		Dates.update({year: year},modifier);
	},
	// Set users name
	'updateName'(name, username) {
		Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile.name": name}});
		Accounts.setUsername(Meteor.userId(), username);
	},
	// Set users password
	'updatePassword'(password) {
		Accounts.setPassword(Meteor.userId(), password);
	},
	// Set default presence (multiple days)
	'defaultPrecense'(year, modifier) {
		Dates.update({year: year},modifier);
	},
	// Set default day in users database
	'settingsData'(weekdays, months) {
		Meteor.users.update({_id: Meteor.userId()}, 
			{$set:{
				"profile.settings.weekdays": weekdays,
				"profile.settings.months": months
			}}
		);
	},
	// Reset all settings data in users collection
	'resetSettingsData'() {
		Meteor.users.update({_id: Meteor.userId()}, 
			{$set:{
				"profile.settings": {}
			}}
		);
	},
	// Set flex desks and registration key
	'updateAdmin'(flexDesks, registrationKey) {
		Desks.update({name: 'desksInfo'}, 
			{$set:{
				"flexDesks": flexDesks,
				"registrationKey": registrationKey
			}}
		)
	},
	// Change desk type
	'deskChange'(id, desk) {
		Meteor.users.update({_id: id}, {$set:{"profile.desk": desk}});
	},
	// Remove user
	'removeUser'(id) {
		Meteor.users.remove({_id: id});
	},
	// Insert desk info data at startup
	'createDesksinfo'() {
		Desks.insert({
			name: 'desksInfo',
			flexDesks: 10,
			registrationKey: 'damco'
		});
	}
});