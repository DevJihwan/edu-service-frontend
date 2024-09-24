const puppeteer = require('puppeteer');
const fs = require('fs');

function extractDateAndTime(timeString) {
    const datePattern = /\d{4}\.\d{2}\.\d{2}\(.\)\s~\s\d{4}\.\d{2}\.\d{2}\(.\)/;
    const timePattern = /\d{2}:\d{2}-\d{2}:\d{2}/;
  
    const dateMatch = timeString.match(datePattern);
    const timeMatch = timeString.match(timePattern);
  
    const date = dateMatch ? dateMatch[0] : '';
    const time = timeMatch ? timeMatch[0] : '';
  
    return { date, time };
  }


async function fetchCourseData(pageNumber) {
  //const url = `https://www.ehyundai.com/newCulture/CT/CT010100_L.do?page=${pageNumber}&stCd=220&keyword=&nickCrsNm=&timeCntGubn=&applyGubn=&yearGubnSta=2024&yearGubnEnd=2025&monthGubnSta=09&monthGubnEnd=08&timeGubnSta=&timeGubnEnd=&day=&upCrsTy2=&partnerQuotaGubn=&orderGubn=status&pageSize=12&detailSearch=&ctGubn=`;
  const url =  `https://www.ehyundai.com/newCulture/CT/CT010100_L.do?page=${pageNumber}&stCd=210&keyword=&nickCrsNm=&timeCntGubn=&applyGubn=&yearGubnSta=2024&yearGubnEnd=2025&monthGubnSta=09&monthGubnEnd=08&timeGubnSta=&timeGubnEnd=&day=&upCrsTy2=&partnerQuotaGubn=&orderGubn=status&pageSize=12&detailSearch=0&ctGubn=`;
                //https://www.ehyundai.com/newCulture/CT/CT010100_L.do?page=2&stCd=400&keyword=&nickCrsNm=&timeCntGubn=&applyGubn=&yearGubnSta=2024&yearGubnEnd=2025&monthGubnSta=09&monthGubnEnd=08&timeGubnSta=&timeGubnEnd=&day=&upCrsTy2=&partnerQuotaGubn=&orderGubn=status&pageSize=12&detailSearch=&ctGubn=CH


  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      timeout: 60000,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const courses = await page.evaluate(() => {
        const items = document.querySelectorAll('ul.list03 > li');
        let results = [];
        items.forEach(item => {
            const target = (() => {
                const targetText = item.querySelector('.etc')?.innerText.trim();
                if (targetText === '성인') return 'adult';
                if (targetText === '엄마랑 아기랑') return 'family';
                if (targetText === '유아 어린이') return 'child';
                return 'adult'; // 기본값
              })();

          const title = item.querySelector('dt')?.innerText.trim() || '';
          const infos = Array.from(item.querySelectorAll('.class_info')).map(el => el.innerText.trim());
          
           // 날짜와 시간 분리
          const datePatternRange = /\d{4}\.\d{2}\.\d{2}\(.\)\s~\s\d{4}\.\d{2}\.\d{2}\(.\)/;
          const datePatternOneDay = /\d{4}\.\d{2}\.\d{2}/;
          const timePattern = /\d{2}:\d{2}-\d{2}:\d{2}/;
 
           let date = '';
           let time = '';
 
           if (datePatternRange.test(infos[0])) {
               date = infos[0].match(datePatternRange)[0];
           } else if (datePatternOneDay.test(infos[0])) {
               date = infos[0].match(datePatternOneDay)[0];
           }
 
           if (timePattern.test(infos[0])) {
               time = infos[0].match(timePattern)[0];
           }


          let info = '압구정 본점'; // 기본값 설정
  
          let sessionType = 'regular';        
        
          if (!infos[0]?.includes('~')) {
            sessionType = 'oneday';
          }
          
          const location = "gangnam";
          const price = item.querySelector('.price')?.innerText.trim() || '';
  
          results.push({
            target,
            location,
            title,
            info,
            time,
            price,
            date,
            sessionType
          });
        });
        return results;
      });
    await browser.close();

    let existingCourses = [];
    if (fs.existsSync('apgujung_courses.json')) {
      const existingData = fs.readFileSync('apgujung_courses.json', 'utf-8');
      existingCourses = JSON.parse(existingData);
    }

    const updatedCourses = existingCourses.concat(courses);

    fs.writeFileSync('apgujung_courses.json', JSON.stringify(updatedCourses, null, 2), 'utf-8');
    console.log(`Page ${pageNumber} data successfully appended to courses.json`);
  } catch (error) {
    console.error(`Error fetching course data for page ${pageNumber}:`, error);
  }
}

async function main() {
  for (let i = 1; i <= 15; i++) {
    await fetchCourseData(i);
  }
}

main();
