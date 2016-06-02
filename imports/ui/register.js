import { Desks } from '../api/server.js';

import './register.html';

Template.register.events({
	'submit .form'(event, template) {
		event.preventDefault();

		var username = template.find('#username').value;
		var password = template.find('#password').value;
		var name = template.find('#name').value;
		var key = template.find('#key').value;

		var registrationKey = Desks.findOne({name: 'desksInfo'}).registrationKey;
		// If key is the registration key
		if (key === registrationKey) {
			Accounts.createUser({
				username: username,
				password: password,
				profile: {
					name: name,
					desk: 'flex'
				}
			});

			Router.go('/');
		};

		
	}
})