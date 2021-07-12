const puppeteer = require('puppeteer');

getDataFromCompName("europe", "euro");

class MatchInstance {
    constructor(match_info_json) {
        this.status = match_info_json["status"];
        this.time = match_info_json["time"];
        this.team_1 = match_info_json["team_1"];
        this.team_2 = match_info_json["team_2"];
        this.score_1 = match_info_json["score_1"];
        this.score_2 = match_info_json["score_2"];
        this.fh_score = match_info_json["fh_score"];
        this.winner = match_info_json["winner"];
    }

}

function parseJSON(match_info) {
    var final_json = []
    match_info.forEach(element => {
        var match_info_json = {};
        //console.log(element)
        if (element.length == 4) {
            match_info_json["status"] = "Upcoming";
            match_info_json["time"] = element[0].trim();
            match_info_json["team_1"] = element[1].trim();
            match_info_json["team_2"] = element[2].trim();
            match_info_json["score_1"] = "";
            match_info_json["score_2"] = "";
            match_info_json["fh_score"] = "";
        } else if (element[0] == "Finished") {
            match_info_json["status"] = "Finished";
            match_info_json["time"] = "";
            match_info_json["team_1"] = element[1].trim();
            match_info_json["team_2"] = element[2].trim();
            match_info_json["score_1"] = element[3].trim();
            match_info_json["score_2"] = element[5].trim();
            match_info_json["fh_score"] = element[6].trim();
        } else if (element[0] == "After Pen.") {
            match_info_json["status"] = "Finished (Penalties)";
            match_info_json["time"] = "";
            match_info_json["team_1"] = element[1].trim();
            match_info_json["team_2"] = element[2].trim();
            match_info_json["score_1"] = element[6].split("-")[0][1];
            match_info_json["score_2"] = element[6].split("-")[1][1];
            match_info_json["fh_score"] = element[7].trim();
            if (parseInt(element[3]) > parseInt(element[5])) {
                match_info_json["winner"] = match_info_json["team_1"];
            } else {
                match_info_json["winner"] = match_info_json["team_2"];
            }
        } else {
            match_info_json["status"] = "Ongoing";
            match_info_json["time"] = element[0].trim();
            match_info_json["team_1"] = element[1].trim();
            match_info_json["team_2"] = element[2].trim();
            match_info_json["score_1"] = element[3].trim();
            match_info_json["score_2"] = element[5].trim();
            match_info_json["fh_score"] = element[6].trim();
        }
        if (match_info_json["status"] != "Finished (Penalties)") {
            if (parseInt(score_1) > parseInt(score_2)) {
                match_info_json["winner"] = match_info_json["team_1"];
            } else if (parseInt(score_1) < parseInt(score_2)) {
                match_info_json["winner"] = match_info_json["team_2"];
            } else {
                match_info_json["winner"] = "Draw"
            }
        }
        final_json.push(new MatchInstance(match_info_json));
    });
    return final_json;
}


async function getDataFromCompName(country, comp) {
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

function timeNow() {
    let time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    console.log(time)
}


module.exports = { getDataFromCompName };