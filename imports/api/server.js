import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';

export const Dates = new Mongo.Collection('dates');
export const Desks = new Mongo.Collection('desks');

if (Meteor.isServer) {
	// This code only runs on the server
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

Meteor.methods({
	'dates.insert'(object) {
		Dates.insert(object);
	},
	'dates.remove'() {
		Dates.remove({})
	},
	'insertPrecense'(year, modifier) {
		Dates.update({year: year},modifier);
	},
	'updateName'(name, username) {
		Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile.name": name}});
		Accounts.setUsername(Meteor.userId(), username);
	},
	'updatePassword'(password) {
		Accounts.setPassword(Meteor.userId(), password);
	},
	'defaultPrecense'(year, modifier) {
		Dates.update({year: year},modifier);
	},
	'settingsData'(weekdays, months) {
		Meteor.users.update({_id: Meteor.userId()}, 
			{$set:{
				"profile.settings.weekdays": weekdays,
				"profile.settings.months": months
			}}
		);
	},
	'resetSettingsData'() {
		Meteor.users.update({_id: Meteor.userId()}, 
			{$set:{
				"profile.settings": {}
			}}
		);
	},
	'updateAdmin'(flexDesks, registrationKey) {
		Desks.update({name: 'desksInfo'}, 
			{$set:{
				"flexDesks": flexDesks,
				"registrationKey": registrationKey
			}}
		)
	},
	'deskChange'(id, desk) {
		Meteor.users.update({_id: id}, {$set:{"profile.desk": desk}});
	},
	'removeUser'(id) {
		Meteor.users.remove({_id: id});
	},
	'createDesksinfo'() {
		Desks.insert({
			name: 'desksInfo',
			flexDesks: 10,
			registrationKey: 'damco'
		});
	}
});