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
	}
});