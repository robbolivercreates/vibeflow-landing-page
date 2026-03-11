const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

    await page.goto('http://localhost:3001', { waitUntil: 'load', timeout: 30000 });
    
    // Check if body is empty or hidden
    const isBlank = await page.evaluate(() => {
        return document.body.innerText.trim().length === 0;
    });
    console.log("Is Blank?", isBlank);
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
