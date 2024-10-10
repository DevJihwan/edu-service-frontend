const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// File path for the JSON file
const filePath = path.join(__dirname, 'scraped_data.json');

async function fetchData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the page
  await page.goto('https://www.shinsegae.com/culture/academy/lecture.do', { waitUntil: 'networkidle2' });

  // Wait for the iframe to load and switch context to the iframe
  const frameHandle = await page.waitForSelector('iframe#academy');
  const frame = await frameHandle.contentFrame();

  // Function to scrape data from the current page
  const scrapePageData = async () => {
    await frame.waitForSelector('#lectList');

    const data = await frame.evaluate(() => {
      const rows = document.querySelectorAll('#lectList tr');
      let results = [];

      rows.forEach(row => {
        const store = row.querySelector('td:nth-child(1)')?.innerText.trim() || '';
        const titleRaw = row.querySelector('.title a')?.innerText.trim() || '';
        const title = titleRaw.split(']').pop().trim();
        const dateInfo = row.querySelector('.date')?.innerText.trim() || '';
        const time = row.querySelector('td:nth-child(4)')?.innerText.trim() || '';
        const priceRaw = row.querySelector('td:nth-child(6)')?.innerText.trim() || '';

        let price = priceRaw.replace(/[^\d,]/g, '');

        // Check if the last character is '1', and remove it
        if (price.endsWith('1')) {
            price = price.slice(0, -1);
        }

        price = price + ' 원';

        let sessionType = 'regular';
        if (!dateInfo.includes('~')) {
          sessionType = 'oneday';
        }

        let target = 'adult';
        if (title.includes('개월') || title.includes('년생')) {
          target = 'child';
        }
        if (title.includes('오감') || title.includes('개월') || title.includes('년생') && title.includes('성인')) {
          target = 'family';
        }

        const location = 'yeongdeungpo';

        results.push({
          target: target,
          location: location,
          title: title,
          info: store,
          time: time,
          price: price,
          date: dateInfo,
          sessionType: sessionType
        });
      });

      return results;
    });

    return data;
  };

  // Loop over pagination
  let currentPage = 47;
  let totalPages = 46; // Set based on actual pages
  let allData = [];

  while (currentPage <= totalPages) {
    console.log(`Scraping page ${currentPage}...`);

    // If we're not on the first page, move to the next page
    if (currentPage > 1) {
        await frame.evaluate((page) => {
          fnGoPage(page);
        }, currentPage);
        await new Promise(r => setTimeout(r, 3000)); // Wait 3 seconds for the page to load fully
      }

    const pageData = await scrapePageData();
    allData = [...allData, ...pageData];

    currentPage++;
  }

  // Read existing data from the file if it exists, otherwise create an empty array
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    existingData = JSON.parse(fileContent);
  }

  // Filter out new data that's already in the file
  const newData = allData.filter(newItem => 
    !existingData.some(existingItem => existingItem.title === newItem.title && existingItem.date === newItem.date)
  );

  // Append only the new data to the existing data
  const updatedData = [...existingData, ...newData];

  // Save the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  console.log('Data has been saved to JSON.');
  await browser.close();
}

fetchData();
