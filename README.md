# Visual Server Tester
## About
This is a small node.js script to compare pages across multiple servers using visual regression testing through pupetteer. It loops over a set of servers and compares pages against a baseline server by taking sceenshots of both and comparing them with pixelmatch. If differences are found a diff image will be saved and a notice will be logged to the console.

## Installation
You need node.js installed on your system.

Clone this repository `git clone git@github.com:brentswisher/visual-server-tester.git` (or clone your own fork)

`cd visual-server-tester`

`npm install`

### Configuration
Create a file to run your tests from (Based on the demo) `cp demo.js yourfile.js`

Update the baseline, servers, and pages arrays with the servers/pages you want to test

run `node yourfile.js`

The program will generate the screenshots you specified and check them. If there are any differences, it will log to the console and create diff screenshot.

#### Configutation Options
You can optionally pass in a fourth argument of options:

	{
		// Width of browser in pixels for the screenshots
		width: 1280,

		// Height of browser in pixels for the screenshots
		height: 800,

		// Relative path of the folder to use for screenshots.
		screenshotPath: './screenshots',

		//Maximum event listeners allowed before throwing a warning
		maxListeners: 25,
	}
