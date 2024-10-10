const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// HTML을 통해 데이터 크롤링하기
async function scrapeMartClasses(url) {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 100, timeout: 60000 });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.search-info .unit .explain-scroll-in span.btn-link');
    await page.click('.search-info .unit .explain-scroll-in span.btn-link'); // 지점 선택 버튼 클릭
    await new Promise(r => setTimeout(r, 500));
    // 서울 지역 버튼 클릭
    await page.waitForSelector('.filter-menu-scroll ul li');
    const locations = await page.$$('.filter-menu-scroll ul li');
    for (let location of locations) {
      const locationText = await page.evaluate(el => el.textContent.trim(), location);
      if (locationText === '서울') {
        await location.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));
    await page.click('.filter-button-select-all span'); // 전체 선택 버튼 클릭
    await new Promise(r => setTimeout(r, 1000));
    await page.click('.filter-button-etc span'); // 선택하기 버튼 클릭
    await new Promise(r => setTimeout(r, 2000)); // 데이터 로딩 기다림

    let previousHeight = 0;
    const filePath = path.join(__dirname, 'classes.json');
    let classes = [];

    // 기존 데이터 로드
    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath);
      classes = JSON.parse(existingData);
    }

    // 스크롤을 반복적으로 수행하여 모든 데이터를 불러오기
    while (true) {
      // 특정 루트 요소를 선택하여 HTML 파싱
      await page.waitForSelector('div#root');
      const rootElement = await page.$('#root');
      if (!rootElement) {
        throw new Error('Root element (#root) not found');
      }
      const html = await page.evaluate(element => element.innerHTML, rootElement);
      const $ = cheerio.load(html);

      // 강좌 정보 추출
      $('.row-item').each((index, element) => {
        const title = $(element).find('.cls-title a').text().trim();
        const location = $(element).find('.cls-inf:contains("지점") .cls-inf-des').text().trim();
        const date = $(element).find('.cls-inf:contains("일정") .cls-inf-des').text().trim();
        const category = $(element).find('.cls-cate').text().trim();
        const time = date.split(' ')[1]; // 시간 정보 추출
        const target = category.includes('Children') ? 'children' : 'family';
        const sessionType = date.includes('1회') ? 'one-time' : 'regular';
        const timeCategory = time.split('-')[0] < '12:00' ? 'Morning' : 'Afternoon';

        const classData = {
          title,
          location,
          date,
          info: '마트 문화센터',
          target,
          time,
          sessionType,
          timeCategory,
        };

        // 중복 데이터 방지
        if (!classes.some(existingClass => existingClass.title === classData.title && existingClass.location === classData.location && existingClass.date === classData.date)) {
          classes.push(classData);
        }
      });

      // JSON 파일로 데이터 저장
      fs.writeFileSync(filePath, JSON.stringify(classes, null, 2));
      console.log(`Data saved to ${filePath}`);

      // 스크롤 수행
      await page.evaluate(() => {
        const scrollContainer = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
        if (scrollContainer) {
          scrollContainer.lastElementChild.scrollIntoView();
        }
      });
      await new Promise(r => setTimeout(r, 3000)); // 데이터 로딩을 기다림

      const currentHeight = await page.evaluate(() => document.querySelector('.ReactVirtualized__Grid__innerScrollContainer').scrollHeight);
      if (currentHeight === previousHeight) {
        break;
      }
      previousHeight = currentHeight;
    }

    await browser.close();
  } catch (error) {
    console.error('Error scraping data:', error);
  }
}

// 크롤링할 URL 지정
const url = 'https://m.cultureclub.emart.com/lecture';

scrapeMartClasses(url);