const APP = {
	NAME         : 'InfoViz 2020 University of Amsterdam concept',
	VERSION      : '1.0.0',
	AUTHOR       : 'Robert Spier, Joshua Onwezen, Cas Obdam, Daan Visser',
	CREATION_DATE: new Date().getFullYear()
};

class App {

	constructor() {
		console.log(`${APP.NAME} ${APP.VERSION}, © ${APP.CREATION_DATE} ${APP.AUTHOR}`);
	}

};

const app = new App();
