const fs = require('fs');

function splitTime(data) {
  return data.map(item => {
    // 정규식을 사용하여 날짜와 시간 부분 추출
    const dateMatch = item.time.match(/(\d{4}\.\d{2}\.\d{2}\(.\)) ~ (\d{4}\.\d{2}\.\d{2}\(.\))/);
    const timeMatch = item.time.match(/(\d{2}:\d{2}-\d{2}:\d{2})/);

    const date = dateMatch ? dateMatch[0] : '';
    const time = timeMatch ? timeMatch[0] : '';

    return {
      ...item,
      date: date.trim(),
      time: time.trim()
    };
  });
}

function extractDateFromTitle(title) {
    const datePattern = /\d{1,2}\.\d{1,2}\)/;
    const match = title.match(datePattern);
    if (match) {
      const today = new Date();
      const year = today.getFullYear();
      const [month, day] = match[0].slice(0, -1).split('.').map(num => num.padStart(2, '0'));
      return {
        date: `${year}.${month}.${day}`,
        cleanedTitle: title.replace(datePattern, '').trim(), // 날짜 형식을 제거하고 나머지 타이틀만 남김
      };
    }
    return { date: '', cleanedTitle: title };
  }


  function updateCourseInfo(courses) {
    return courses.map(course => {

      //let updatedCourseInfo = '이마트 ' + course.info;
      let updatedTarget = course.target;

      if(course.title.includes('성인') ||
        course.title.includes('줌바')                 
      
      ){
        updatedTarget = 'adult'
      }

      /*
      let updatedCourselocation;

      if (course.location == "가든5점"){
        updatedCourselocation = "songpa";
      }else if(course.location == "은평점"){
        updatedCourselocation = "eunpyeong";
      }else if(course.location == "월계점"){
        updatedCourselocation = "nowon";
      }else if(course.location == "청계천점"){
        updatedCourselocation = "jung";
      }else if(course.location == "묵동(중랑)점"){
        updatedCourselocation = "jungnang";
      }else if(course.location == "목동(양천)점"){
        updatedCourselocation = "yangcheon";
      }else if(course.location == "구로점"){
        updatedCourselocation = "guro";
      }else if(course.location == "명일점"){
        updatedCourselocation = "gangdong";
      }else if(course.location == "신도림점"){
        updatedCourselocation = "guro";
      }else if(course.location == "하월곡점"){
        updatedCourselocation = "seongbuk";
      }

      */


      return {
        ...course,
        target: updatedTarget
      };
    });
  }  


  function classifyCourse(course) {
    let sessionType = '정규 강좌';
  
    // date 값이 특정 날짜 형식(YYYY.MM.DD)인지 확인
    if (course.date && !course.date.includes('~')) {
      sessionType = '1일 체험';
    }
  
    return {
      ...course,
      sessionType, // sessionType 필드 추가
    };
  }


  function updateSessionType(courses) {
    return courses.map(course => {
      let updatedSessionType = course.sessionType;
      
      if (course.sessionType === "one-time") {
        updatedSessionType = "oneday";
      }
  
      return {
        ...course,
        sessionType: updatedSessionType,
      };
    });
  }  


  // course.json 파일을 읽어서 location 값을 변경하는 함수
function updateLocation(courses) {
    return courses.map(course => {
      if (course.location === "yangcheon") {
        return { ...course, location: "seodaemun" };
      }
      return course;
    });
  }

function updateCourseJson() {
  // course.json 파일 읽기
  const rawData = fs.readFileSync('classes.json', 'utf-8');
  const courses = JSON.parse(rawData);

  // time을 date와 time으로 분리
  //const updatedCourses = splitTime(courses);
  // 데이터 업데이트
  const updatedCourses = updateCourseInfo(courses);
  

  // 결과를 다시 courses.json에 저장
  fs.writeFileSync('classes.json', JSON.stringify(updatedCourses, null, 2), 'utf-8');
  console.log('classes.json 파일이 성공적으로 업데이트되었습니다.');
}

updateCourseJson();
