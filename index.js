/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const cheerio = require('cheerio');

const dirPath = path.join(__dirname, 'responses');

fs.readdir(dirPath, (err, files) => {
  if (err) {
    return console.log(chalk.bgRed('Directory could not be read'));
  }

  files.forEach(async (file) => {
    const contents = fs.readFileSync(path.join(dirPath, file));
    const JSONContent = JSON.parse(contents);

    const data = JSONContent.map(async (unit) => {
      try {
        if (unit.pb_id && unit.listing_id) {
          const html = await axios.get(`https://www.padmapper.com/apartments/${unit.listing_id}`);
          const $ = cheerio.load(html.data);
          console.log(unit.listing_id);
          console.log({
            address: $('[class^=FullDetail_street]').text(),
            rent: $('[class^=FullDetail_price] span').text(),
            scrapeDate: new Date(),
            bedrooms: $('[class^=SummaryTable_summaryTable] > ul > li:nth-child(2) div').text(),
            description: $('[class^=Description_text]').text(),
            isAirBnB: false,
            size: $('[class^=SummaryTable_summaryTable] > ul > li:nth-child(5) div').text(),
          });
        }
      } catch (error) {
        return console.log(error);
      }
    });

    // const data = JSONContent.map((unit) => {
    //   if (!unit.pb_id && unit.promotion_type === 1) {
    //     return {
    //       address: unit.address,
    //       isAirBnB: true,
    //       rent: unit.max_price,
    //       size: unit.max_square_feet,
    //       scrapeDate: new Date(),
    //       description:
    //     };
    //   }
    // });
  });
});
