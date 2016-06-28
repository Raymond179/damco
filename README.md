# Damco flex seatings
This web app is a mutual organization tool for 'flex' employees who have irregular working days and no standard desk. The app shows the number of available 'flex' desks per day, compared to the number of employees present. In addition, employees can enter their standard absentee days and holiday periods. The application can also register fixed employees. The difference between the fixed and flex employees is that only flex employees are included in the calculation of the available desks. Fixed employees have their own desk and are only included in the calculation on days they are absent.

Look it up: <br/> 
<a href="https://damco.raymondkorrel.me"> damco.raymondkorrel.me </a>

## Application

### Agenda
![alt tag](https://github.com/RaymondKorrel/damco/blob/master/public/readme/agenda.jpg)

In the agenda list page, employees can see the daily ratio of coming employees and available desks. This ratio number can be positve or negative. When the user clicks on a day, it will expand and shows some extra information. Also, the user can put him/herself on absent or present by clicking the button, or bring guests (maximum 3).

### Calendar
![alt tag](https://github.com/RaymondKorrel/damco/blob/master/public/readme/calendar.jpg)

In the calendar view, employees can give up their precense faster. This page was made to give up holiday periods but also gives an overview of the days the employee is coming to the office.

### Settings
![alt tag](https://github.com/RaymondKorrel/damco/blob/master/public/readme/settings.jpg)

Sometimes employees have default days they are not coming to the office. With the settings page the employee can give up his/her default 'working from home' days. The employee can also reset precense to delete all absent days.

### Admin
![alt tag](https://github.com/RaymondKorrel/damco/blob/master/public/readme/employees.jpg)

The admin can see what users are registered and assign them a fixed or flex desk. Also, the admin can delete users.

![alt tag](https://github.com/RaymondKorrel/damco/blob/master/public/readme/adminSettings.jpg)

On this page the admin can set the number of desks en the registration key. The registration key needs to be filled in when an employee registers.

![alt tag](https://github.com/RaymondKorrel/damco/blob/master/public/readme/register.jpg)

## Technical structure
The application is build with Meteor JS with the following packages:
- Iron Router
- Accounts-password
- body-events

### Code
Meteor has it's own templating structure. Every page of this app has an HTML file wich contains the the following HTML:

#### Templating

```html
<template name="home">
    <!-- Template HTML code -->
</template>
```

Every page also has a javascript file which include events (click, submit, change etc.) and helpers.
```javascript
Template.register.events({
    'submit .form'(event, template) {
        console.log('Form submitted');
    }
});
```

The helper object contains functions that support the HTML of that template. They're basically javascript functions.

```javascript
Template.register.helpers({
    'registered': function() {
        return true;
    }
});
```

#### Collections

The Mongodb collections are created on the server in 'ui/api/server.js'. 

```javascript
export const Desks = new Mongo.Collection('desks');
```

And are also published on the server:

```javascript
if (Meteor.isServer) {
    // Publish collection
    Meteor.publish('desks', function tasksPublication() {
        return desks.find();
    });
};
```

Then the collection gets subscribed on the client:

```javascript
// When HTML is created
Template.body.onCreated(function bodyOnCreated() {
    // Subscribe collection
    Meteor.subscribe('desks');
});
```

To receive data from a collection, the collection should be imported in the file you want to receive the data in:

```javascript
import { Desks } from '../api/server.js';
```

### Data
The app contains 3 mongodb collections:

- Dates
- Desks
- Users

#### Dates
This collection contains all dates of this year and the next year. Every day the app checks if it's already the next year. So on January 1st, a new year will be added to the collection. The same applies to the months in the agenda list view. This way you always are a year or month ahead.

```javascript
// When dates are loaded
Meteor.subscribe("dates", function() {
    // Check if it's next year
	var thisYear = new Date;
	var nextYear = thisYear.getFullYear()+1
	var findYear = Dates.findOne({year: nextYear});
	if(findYear == null) {
		// Add new year's dates
		Meteor.call('dates.insert',{year: nextYear, dates: Template.frame.__helpers.get('getData')(nextYear)});
	};
});
```

##### JSON structure
```json
{
    "_id" : "iiv4Fzw8X5FNLfxJx",
    "year" : 2016,
    "dates" : {
        "0" : [ 
            {
                "weekday" : "fri",
                "date" : 1,
                "month" : "January",
                "monthNumber" : 0,
                "year" : 2016,
                "absent" : [],
                "extraFlexDesks" : [],
                "guests" : {}
            }
        ]
    }
}
```

#### Desks
The Desks collection only has one document. In this document, the number of desks and registration key are stored. After deploying the app, the database is empty. But the document should always be in there. The following code checks if it already exists. If not, it adds the document to the collection.

```javascript
// When desks collection is loaded
Meteor.subscribe("desks", function() {
	// Check if a document exists
	var desksInfo = Desks.findOne({name: 'desksInfo'});
	if (desksInfo == null) {
		// If it doesn't exist, add a document with the right data to the collection
		Meteor.call('createDesksinfo');
	};
});
```

#### Users
In the Users collection there are three kinds of users. The flex employee, fixed employee and the admin. This is indicated in the Users collection at the property 'desk'. It can either be fixed, flex or admin. 

##### JSON structure
```json
"profile" : {
	"name" : "Piet-jan de Koning",
	"desk" : "flex"
}
```

### File structure
All client and server files are located in the folder 'imports'. The client files are located in the 'ui' folder and the server files in the 'api' folder. These files are imported in the 'main.js' of the server and client folder.

```
|--imports
|	|--api
|		|--server.js
|	|--startup
|		|--accounts-config.js
|	|--ui
|		|--app
|			|--adminSettings.html
|			|--adminSettings.js
|			|--agendaList.html
|			|--agendaList.js
|			|--agendaOverview.html
|			|--agendaOverview.js
|			|--employees.html
|			|--employees.js
|			|--profile.html
|			|--profile.js
|			|--settings.html
|			|--settings.js
|		|--frame.html
|		|--frame.js
|		|--home.html
|		|--loading.html
|		|--login.html
|		|--login.js
|		|--nothing.html
|		|--register.html
|		|--register.js
|		|--router.js
```

### Routing
The app's routing is done with the package 'Iron Router'. The routes are listed in 'router.js'.

## Vakken

##### Real-time web
The application is realtime and is made with Meteor js. Techniques like templating, routing and methods are used.

##### Web-app from scratch
Although Meteor uses all kinds of libraries, all the javascript code in de application is native. 

##### CSS to the rescue
The application includes CSS techniques like modals, checkboxes and backgrounds.

##### Browser technologies
The application is accessible for keyboard.