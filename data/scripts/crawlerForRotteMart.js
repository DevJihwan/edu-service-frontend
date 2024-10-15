const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://culture.lottemart.com/cu/gus/course/schedule/scheduleCourse.do', { waitUntil: 'networkidle2' });

    const branches = [
      { id: '103', name: '영등포점' },
      { id: '322', name: '송파점' },
      { id: '328', name: '양평점' },
      { id: '342', name: '은평점' },
      { id: '307', name: '중계점' },
    ];

    const courses = [];

    for (const branch of branches) {
      // Select the branch
      await page.evaluate((branchId) => {
        const branchElement = document.querySelector(`li[tagid='${branchId}'] a`);
        if (branchElement) {
          branchElement.click();
        }
      }, branch.id);

      console.log(`Branch ID: ${branch.id}, Branch Name: ${branch.name}`);

      // Wait for the page to load the branch-specific content
      //await page.waitForTimeout(2000);
      await new Promise(r => setTimeout(r, 1000));

      // Select all checkboxes for 성인, 영유아, 어린이
      const targets = ['#clsTarget2', '#clsTarget3', '#clsTarget4'];
      for (const target of targets) {
        await page.evaluate((target) => {
          const checkbox = document.querySelector(target);
          if (checkbox && !checkbox.checked) {
            checkbox.click();
          }
        }, target);
      }

      // Click the search button to update the course list
      await page.click('.btn_sch-srch');

      // Wait for the search results to load
      await page.waitForSelector('#time_body > tr', { timeout: 10000 });

      const days = [
        "chkDay_01", // 월요일
        "chkDay_02", // 화요일
        "chkDay_03", // 수요일
        "chkDay_04", // 목요일
        "chkDay_05", // 금요일
        "chkDay_06", // 토요일
        "chkDay_07", // 일요일
      ];

      for (const dayId of days) {
        // Click each day to get courses for that day
        await page.evaluate((dayId) => {
          const dayElement = document.querySelector(`#${dayId} > a`);
          if (dayElement) {
            dayElement.click();
          }
        }, dayId);

        // Wait for the content to update after clicking the day
        //await page.waitForTimeout(2000);
        await new Promise(r => setTimeout(r, 1000));

        // Log the class of the clicked day element to check if 'active' class is added
        const isActive = await page.evaluate((dayId) => {
          const dayElement = document.getElementById(dayId);
          return dayElement ? dayElement.classList.contains('active') : false;
        }, dayId);
        console.log(`Day ${dayId} active status: ${isActive}`);

        // Wait for the course list to be visible
        await page.waitForSelector('#time_body > tr', { timeout: 10000 });

        // Get HTML of the page after clicking on a specific day
        const html = await page.content();
        const $ = cheerio.load(html);

        // Extract course information from the updated HTML
        $('#time_body > tr').each((i, elem) => {
          const roomName = $(elem).find('th').text().trim();
          const tds = $(elem).find('td');

          tds.each((tdIndex, tdElem) => {
            const timeRange = getTimeRange(tdIndex); // 시간대 계산 함수
            const courseList = $(tdElem).find('ul.lst_sch-wrap > li');

            courseList.each((_, liElem) => {
              const course = {};

              // 강좌 상세 정보 링크에서 ID 추출
              const onClickText = $(liElem).find('a').attr('onclick');
              const courseIdMatch = onClickText ? onClickText.match(/doView\((\d+)\)/) : null;
              const courseId = courseIdMatch ? courseIdMatch[1] : '';

              // 강좌 제목 및 시간 정보 추출
              const title = $(liElem).find('div:nth-child(2)').text().trim();
              const infoText = $(liElem).find('div:nth-child(1)').text().trim();
              const [target, sessions, time] = parseInfoText(infoText);

              // 가격 정보 추출
              const priceText = $(liElem).find('ul.lst_week-sch > li').first().text().trim();
              const price = priceText.replace(/,/g, '');

              // 세션 타입 결정 (e.g., 정관, 특강)
              const sessionType = determineSessionType(sessions);

              // 시간대 카테고리 결정
              const timeCategory = getTimeCategory(time);

              // 지역 결정
              if (branch.name.includes('영등포')){
                course.location = 'yeongdeungpo';
              }else if(branch.name.includes('송파')){
                course.location = 'songpa';
              }else if(branch.name.includes('양평')){
                course.location = 'yeongdeungpo';
              }else if(branch.name.includes('은평')){
                course.location = 'eunpyeong';
              }else if(branch.name.includes('중계')){
                course.location = 'nowon';
              }


              course.courseId = courseId;
              course.title = title;
              course.date = '2024.09.01 ~ 2024.11.30'; // 날짜 정보는 별도로 제공되지 않으니 필요 시 추가 작업 필요
              course.time = time;
              course.target = target;
              course.location = course.location;
              course.sessionType = sessionType;
              course.timeCategory = timeCategory;
              course.info = `롯데마트 ${branch.name}`;
              course.price = price;

              courses.push(course);
            });
          });
        });
      }
    }
    // 결과를 JSON 파일로 저장
    fs.writeFileSync('lottemart_courses.json', JSON.stringify(courses, null, 2));

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();

// 시간대 인덱스에 따른 시간 범위를 반환하는 함수
function getTimeRange(index) {
  switch (index) {
    case 0:
      return '09:00~13:00';
    case 1:
      return '13:00~17:00';
    case 2:
      return '17:00~21:00';
    default:
      return '';
  }
}

// infoText를 파싱하여 대상, 회차, 시간을 추출하는 함수
function parseInfoText(text) {
  const infoParts = text.split('|').map((part) => part.trim());
  const rawTarget = infoParts[0];
  const target = mapTarget(rawTarget); // target 매핑 함수 호출
  const sessionsAndTime = infoParts[1];
  const sessionsMatch = sessionsAndTime.match(/(\d+)회/);
  const sessions = sessionsMatch ? sessionsMatch[1] : '';
  const timeMatch = sessionsAndTime.match(/(\d{2}:\d{2}~\d{2}:\d{2})/);
  const time = timeMatch ? timeMatch[1] : '';
  return [target, sessions, time];
}

function mapTarget(rawTarget) {
  rawTarget = rawTarget.trim();
  if (rawTarget.includes('성인강좌')) {
    return 'adult';
  } else if (rawTarget.includes('유아강좌') || rawTarget.includes('어린이청소년')) {
    return 'children';
  } else if (rawTarget.includes('영아강좌') || rawTarget.includes('가족강좌')) {
    return 'family';
  }
  return 'unknown';
}

// 세션 타입을 결정하는 함수
function determineSessionType(sessions) {
  const sessionCount = parseInt(sessions, 10);
  if (sessionCount >= 10) {
    return 'regular'; // 정규 강좌
  } else {
    return 'special'; // 특강
  }
}

function getTimeCategory(timeString) {
  if (!timeString || !timeString.includes('~')) {
    return 'Unknown';
  }

  const startTime = timeString.split('~')[0];
  const hourMinute = startTime.split(':');
  if (hourMinute.length < 2) {
    return 'Unknown';
  }

  const hour = parseInt(hourMinute[0], 10);

  if (isNaN(hour)) {
    return 'Unknown';
  }

  let timeCategory = 'Unknown';

  if (hour >= 6 && hour < 9) {
    timeCategory = 'Early Morning';
  } else if (hour >= 9 && hour < 12) {
    timeCategory = 'Morning';
  } else if (hour >= 12 && hour < 15) {
    timeCategory = 'Afternoon';
  } else if (hour >= 15 && hour < 18) {
    timeCategory = 'Late Afternoon';
  } else if (hour >= 18 && hour < 21) {
    timeCategory = 'Evening';
  }

  return timeCategory;
}