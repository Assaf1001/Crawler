const Axios = require("axios");
const cheerio = require("cheerio");

const scrapePage = async (url, depth) => {
    const result = await Axios.get(url);
    const $ = cheerio.load(result.data);
    const links = $("a");
    const linksArr = [];

    links.each((i, link) => {
        if ($(link).attr("href").length > 1) {
            if (
                $(link).attr("href")[0] === "/" ||
                $(link).attr("href")[0] === "#"
            ) {
                const newLink =
                    url.slice(0, url.length - 1) + $(link).attr("href");

                if (!linksArr.includes(newLink)) linksArr.push(newLink);
            } else {
                const newLink = $(link).attr("href");

                if (!linksArr.includes(newLink)) linksArr.push(newLink);
            }
        }
    });

    const pageObj = {
        title: $("title").text(),
        depth,
        url,
        links: linksArr,
    };

    return pageObj;
};

module.exports = scrapePage;
