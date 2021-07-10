const puppeteer = require('puppeteer');
var url = "https://www.flashscore.in/football/brazil/serie-b";

(async() => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    var todaysMatches = {};
    //todaysMatches['confirm'] = await page.$eval("div# live - table > section.event.event--live.event--summary > div > div.tabs.tabs--live > div > div ", text => text.textContent);
    todaysMatches['match-details'] = await page.$eval("div#g_1_GlbpbNyB", text => text.textContent);
    console.log(todaysMatches['match-details']);

    let texts = await page.evaluate(() => {
        let data = document.getElementsByClassName('sportName soccer');
        return data;
    });
    console.log(texts);
    await browser.close();
})();