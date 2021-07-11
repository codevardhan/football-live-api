const puppeteer = require('puppeteer');

getMatchData("asia", "afc-champions-league");

function parseJSON(match_info) {
    var final_json = []
    match_info.forEach(element => {
        var match_info_json = {};
        if (element.length == 4) {
            match_info_json["status"] = "Upcoming";
            match_info_json["time"] = element[0];
            match_info_json["team_1"] = element[1];
            match_info_json["team_2"] = element[2];
            match_info_json["score_1"] = "";
            match_info_json["score_2"] = "";
            match_info_json["fh_score"] = "";
        } else if (element[0] == "Finished") {
            match_info_json["status"] = "Finished";
            match_info_json["time"] = "";
            match_info_json["team_1"] = element[1];
            match_info_json["team_2"] = element[2];
            match_info_json["score_1"] = element[3];
            match_info_json["score_2"] = element[5];
            match_info_json["fh_score"] = element[6];
        } else {
            match_info_json["status"] = "Ongoing";
            match_info_json["time"] = element[0];
            match_info_json["team_1"] = element[1];
            match_info_json["team_2"] = element[2];
            match_info_json["score_1"] = element[3];
            match_info_json["score_2"] = element[5];
            match_info_json["fh_score"] = element[6];
        }
        final_json.push(match_info_json)
    });
    return final_json;
}

async function getMatchData(country, league) {
    var url = "https://www.flashscore.in/football/" + country + "/" + league;

    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() == 'font' || req.resourceType() == 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });
        await page.goto(url, {
            waitUntil: 'networkidle0'
        });
        let data = await page.evaluate(() => {
            var sections = document.querySelector('section.event.event--live.event--summary');
            var divs = sections.getElementsByTagName('div');
            var match_info = [];
            for (var i = 0; i < divs.length; i += 1) {
                var current = divs[i];
                if (current.id != '') {
                    match_info.push(current.innerText.split("\n"));
                }
            }
            return match_info;
        });
        data = parseJSON(data);
        console.log(data);
        await browser.close();
    } catch (e) {
        console.error(e);
    }
}