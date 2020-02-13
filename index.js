const puppeteer = require('puppeteer');
const fs = require('fs');
const rimraf = require('rimraf');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const defaults = {
	maxListeners: 25,
	width: 1280,
	height: 800,
	screenshotPath: './screenshots',
};

// Helper function to create a folder if it doesn't exist
function generateFolder(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

// Generate a screenshot for a given server and page
async function generateScreenshot(server, testPage, width, height, path) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	try {
		await page.goto(`${server.url}${testPage.path}`);
		await page.setViewport({
			width: width,
			height: height,
		});
		await page.screenshot({
			path: `${path}/${server.title}/${testPage.slug}.png`,
		});
		await browser.close();
	} catch (e) {
		console.error(e);
	}
}

// Compare two screenshots for a given page
function compareScreenshots(serverA, serverB, testPage, path) {
	const img1 = PNG.sync.read(
		fs.readFileSync(`${path}/${serverA.title}/${testPage.slug}.png`)
	);
	const img2 = PNG.sync.read(
		fs.readFileSync(`${path}/${serverB.title}/${testPage.slug}.png`)
	);
	const { width, height } = img1;
	const diff = new PNG({ width, height });

	const pixelCount = pixelmatch(
		img1.data,
		img2.data,
		diff.data,
		width,
		height,
		{ threshold: 0.1 }
	);
	if (pixelCount > 10) {
		console.log(
			`Problem found: ${serverB.title} does not match ${serverA.title} for the ${testPage.title} page.`
		);
		generateFolder(`${path}/${serverB.title}/diff/`);
		fs.writeFileSync(
			`${path}/${serverB.title}/diff/${testPage.slug}.png`,
			PNG.sync.write(diff)
		);
	}
}

async function checkServers(
	baseline,
	servers,
	pages,
	{
		width = defaults.width,
		height = defaults.height,
		screenshotPath = defaults.screenshotPath,
		maxListeners = defaults.maxListeners,
	} = {}
) {
	//Generating the screen shots in parallel often hits the default listener limit, this sets the listeners to the max amount possible based on the number of servers and pages, but not exceeding the maxListeners option
	process.setMaxListeners(
		Math.min(maxListeners, servers.length * pages.length)
	);

	try {
		//Wipe and set up the screen shot directory
		rimraf.sync(`${screenshotPath}/`);
		generateFolder(`${screenshotPath}`);

		//Set up the baseline to compare with
		generateFolder(`${screenshotPath}/${baseline.title}`);

		var baselinePromises = pages.map(async (item) =>
			generateScreenshot(baseline, item, width, height, screenshotPath)
		);

		//Once all the baseline screen shots are complete, get the rest and compare them to the baseline once they are created
		Promise.all(baselinePromises).then(function(results) {
			let serverPromises = servers.map((server) => {
				generateFolder(`${screenshotPath}/${server.title}`);
				pages.map(async (item) => {
					await generateScreenshot(server, item, width, height, screenshotPath);
					compareScreenshots(baseline, server, item, screenshotPath);
				});
			});
		});
	} catch (e) {
		console.error(e);
	}
}

module.exports = checkServers;
