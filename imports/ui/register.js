import './register.html';

Template.register.events({
	'submit .form'(event, template) {
		event.preventDefault();

		var username = template.find('#username').value;
		var password = template.find('#password').value;
		var name = template.find('#name').value;

		Accounts.createUser({
			username: username,
			password: password,
			profile: {
				name: name,
				desk: 'flex'
			}
		});

		Router.go('/');
	}
})