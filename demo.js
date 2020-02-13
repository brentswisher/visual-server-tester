const checkServers = require('./index.js');

const baseline = {
	title: 'Google',
	url: 'https://www.google.com',
};
const servers = [
	{
		title: 'Google Germany',
		url: 'http://www.google.de',
	},
	{
		title: 'Google Uk',
		url: 'https://www.google.co.uk',
	},
];
const pages = [
	{
		title: 'Homepage',
		slug: 'homepage',
		path: '/',
	},
	{
		title: 'Tea Search',
		slug: 'tea',
		path: '/search?q=best%20black%20tea',
	},
];

checkServers(baseline, servers, pages);
