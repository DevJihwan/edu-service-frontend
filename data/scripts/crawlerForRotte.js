const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// File path for the JSON file
const filePath = path.join(__dirname, 'lotte_culture_data.json');

async function fetchLotteCultureData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the URL with pageIndex set to 8 to load all data in one go
  await page.goto('https://culture.lotteshopping.com/application/search/list.do?type=branch&brchCd=0010&lrclsCtegryCd=&mdclsCtegryCd=&smclsCtegryCd=&yyList=&lectClCdList=&lectStatCdList=&stDaywCdList=&timeTypeList=&amtTypeList=&stAmt=&endAmt=&q=&orderSet=C&pageIndex=8&initIndex=1&listCnt=20&tcCdNo=', { waitUntil: 'networkidle2' });

  // Wait for the container that holds the courses to be loaded
  await page.waitForSelector('#listContainer');

  // Function to scrape courses on the current page
  const courses = await page.evaluate(() => {
    const courseElements = document.querySelectorAll('.lec_list');
    const results = [];

    courseElements.forEach(course => {
      let titleRaw = course.querySelector('.tit')?.innerText.trim() || '';
      const priceRaw = course.closest('.card_list_v').querySelector('.bottom_info .price')?.innerText.trim() || '';
      const price = priceRaw.replace(/[^\d,]/g, '') + ' 원';
      let timeRaw = course.querySelector('.time')?.innerText.trim() || '';
      let time = timeRaw.match(/\d{1,2}:\d{2}~\d{1,2}:\d{2}/g)?.[0] || '';
      const dateRaw = course.querySelector('.time')?.innerText.trim() || '';
      const sessionType = timeRaw.includes('총 1회') ? 'oneday' : 'regular';

      // Extract date from title if it's a oneday session and date is present in the title (inside [])
      let date = '';
      if (sessionType === 'oneday') {
        const dateInTitle = titleRaw.match(/\[(\d{1,2})\/(\d{1,2})\]/); // Example: [9/15]
        
        if (dateInTitle) {
          const month = dateInTitle[1].padStart(2, '0'); // Ensures month has two digits
          const day = dateInTitle[2].padStart(2, '0');   // Ensures day has two digits
          date = `2024년 ${month}월 ${day}일`;
        } else {
          // Fallback: Try to extract the date directly from the title even if it's not in square brackets
          const extractedDate = titleRaw.match(/\b(\d{1,2})\/(\d{1,2})\b/); // Matches date-like patterns such as 9/15
          if (extractedDate) {
            const month = extractedDate[1].padStart(2, '0');
            const day = extractedDate[2].padStart(2, '0');
            date = `2024년 ${month}월 ${day}일`;
          } else {
            date = '날짜 정보 없음'; // Handle cases where the date is not found
          }
        }
      } else {
        date = '2024.09.12 ~ 2024.11.28'; // Default date for regular sessions
      }

      // Filter out time data from the title, but keep age range (e.g., "10~15개월")
      const title = titleRaw.replace(/\b(월|화|수|목|금|토|일)\b\s?\d{1,2}:\d{2}/g, '').trim().replace(/\b\d{1,2}:\d{2}\b/g, '').trim();

      // Set the target based on the title content
      let target = 'adult'; // Default target

      // Child-related keywords
      if (title.includes('년생') || 
          title.includes('유아') || 
          title.includes('키즈') || 
          title.includes('아동') || 
          title.includes('교육 뮤지컬') || 
          title.includes('놀이') || 
          title.includes('동요') ||
          title.includes('원어민') || 
          title.includes('동화')) {
        target = 'child';
      }

      // Family-related keywords
      if (title.includes('개월') || 
          title.includes('오감') || 
          title.includes('부모') || 
          title.includes('동반') || 
          title.includes('트니트니') || 
          title.includes('가족')) {
        target = 'family';
      }

      const location = course.querySelector('.type_div .type')?.innerText.trim() || 'unknown';
      const info = '롯데백화점 영등포점';

      // Only collect data for '가을학기'
      if (location === '가을학기') {
        // Save the course href for "세부 일정 선택" later
        const href = course.closest('a')?.href || '';

        results.push({
          target: target,
          location: 'yeongdeungpo',
          title: title,
          info: info || 'unknown',
          time: time,
          price: price,
          date: date,
          sessionType: sessionType,
          href: href // Add href for further processing if needed
        });
      }
    });

    return results;
  });

  // Process courses with "세부 일정 선택"
  for (let course of courses) {
    if (course.time === "") {
      // Navigate to the detailed page using the href
      await page.goto(course.href, { waitUntil: 'networkidle2' });

       // Extract time information from the option_div in the new page
       const times = await page.evaluate(() => {
        const optionDivs = document.querySelectorAll('.option_div');
        const timeList = [];
        
        optionDivs.forEach(optionDiv => {
          const time = optionDiv.querySelector('span:nth-child(2)')?.innerText.trim();
          if (time) {
            timeList.push(time);
          }
        });

        return timeList;
      });

      // Save the time data back to the course
      course.time = times.join(', '); // Combine multiple t

      // Go back to the previous page
      await page.goBack({ waitUntil: 'networkidle2' });
    }
  }

  // Save the data to JSON
  fs.writeFileSync(filePath, JSON.stringify(courses, null, 2));
  console.log('Data has been saved to JSON.');

  await browser.close();
}

fetchLotteCultureData();
