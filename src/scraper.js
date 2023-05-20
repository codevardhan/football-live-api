import puppeteer from 'puppeteer';

// getDataFromCompName("iran", "persian-gulf-pro-league");

class MatchInstance {
    constructor(match_info_json) {
        this.status = match_info_json.status;
        this.time = match_info_json.time;
        this.team_1 = match_info_json.team_1;
        this.team_2 = match_info_json.team_2;
        this.score_1 = match_info_json.score_1;
        this.score_2 = match_info_json.score_2;
        this.fh_score = match_info_json.fh_score;
    }
}

function parseJSON(match_info) {
    var final_json = []
    var match_info_json = {};

    // console.log(match_info);
    if (match_info.length === 0) {
        return ["No matches have taken place in the last 24 hours."];
      }

    match_info.forEach(match => {
        var match_info_json = {};
        // console.log(match_info);
        var match_status = match[0];
        // console.log(match_status);

        if (match_status.includes(":")) {
            match_info_json["status"] = "Upcoming";
            match_info_json["time"] = match[0];
            match_info_json["team_1"] = match[1];
            match_info_json["team_2"] = match[2];
            match_info_json["score_1"] = "NaN";
            match_info_json["score_2"] = "NaN";
            match_info_json["fh_score"] = "NaN";
        } else if (match_status == "Finished" || match_status=="After Pen.") {
            match_info_json["status"] = "Finished";
            match_info_json["time"] = "NaN";
            match_info_json["team_1"] = match[1];
            match_info_json["team_2"] = match[2];
            match_info_json["score_1"] = match[3];
            match_info_json["score_2"] = match[4];
            match_info_json["fh_score"] = `${match[5][1]} - ${match[6][1]}`;

        } else if (match_status == "Postponed") {
            match_info_json["status"] = "Postponed";
            match_info_json["time"] = "NaN";
            match_info_json["team_1"] = match[1];
            match_info_json["team_2"] = match[2];
            match_info_json["score_1"] = "NaN";
            match_info_json["score_2"] = "NaN";
            match_info_json["fh_score"] = "NaN";

        } else {
            match_info_json["status"] = "Ongoing";
            match_info_json["time"] = match[0];
            match_info_json["team_1"] = match[1];
            match_info_json["team_2"] = match[2];
            match_info_json["score_1"] = match[3];
            match_info_json["score_2"] = match[4];
            match_info_json["fh_score"] = `${match[5][1]} - ${match[6][1]}`;
        }
        final_json.push(new MatchInstance(match_info_json));
    });


    return final_json;
}


export async function getDataFromCompName(country, comp) {
    var url = "https://www.flashscore.in/football/" + country + "/" + comp;
    try {
        const browser = await puppeteer.launch();
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
        return data;
    } catch (e) {
        console.error(e);
    }
}
