import React from 'react';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa'; // 위치와 타겟 아이콘
import { FiClock, FiClipboard } from 'react-icons/fi'; // 시간과 세션 아이콘
import Select from 'react-select';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  region: string[];
  //setRegion: (region: string) => void;
  setRegion: React.Dispatch<React.SetStateAction<string[]>>;
  target: string;
  setTarget: (target: string) => void;
  time: string[];
  //setTime: (time: string[]) => void;
  setTime: React.Dispatch<React.SetStateAction<string[]>>;
  sessionType: string;
  setSessionType: (type: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  handleSearch,
  region,
  setRegion,
  target,
  setTarget,
  time,
  setTime,
  sessionType,
  setSessionType,
}: SearchBarProps) {
  const buttonClass = (isSelected: boolean) =>
  `p-3 border rounded-lg shadow-md transition-all duration-200 ${
    isSelected ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white' : 'bg-gray-100 text-gray-600'
  } hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white`;

  const allTimes = ['Early Morning', 'Morning', 'Afternoon', 'Late Afternoon', 'Evening'];

  const regionOptions = [
    { value: 'gangnam', label: '강남구' },
    { value: 'gangdong', label: '강동구' },
    { value: 'gangbuk', label: '강북구' },
    { value: 'gangseo', label: '강서구' },
    { value: 'gwanak', label: '관악구' },
    { value: 'gwangjin', label: '광진구' },
    { value: 'guro', label: '구로구' },
    { value: 'geumcheon', label: '금천구' },
    { value: 'nowon', label: '노원구' },
    { value: 'dobong', label: '도봉구' },
    { value: 'dongdaemun', label: '동대문구' },
    { value: 'dongjak', label: '동작구' },
    { value: 'mapo', label: '마포구' },
    { value: 'seodaemun', label: '서대문구' },
    { value: 'seocho', label: '서초구' },
    { value: 'seongdong', label: '성동구' },
    { value: 'seongbuk', label: '성북구' },
    { value: 'songpa', label: '송파구' },
    { value: 'yangcheon', label: '양천구' },
    { value: 'yeongdeungpo', label: '영등포구' },
    { value: 'yongsan', label: '용산구' },
    { value: 'eunpyeong', label: '은평구' },
    { value: 'jung', label: '중구' },
    { value: 'jungnang', label: '중랑구' },
  ];

  const timeOptions = [
    { value: 'Early Morning', label: '아침' },
    { value: 'Morning', label: '오전' },
    { value: 'Afternoon', label: '점심' },
    { value: 'Late Afternoon', label: '오후' },
    { value: 'Evening', label: '저녁' },
  ];

  return (
    <div className="mb-4 font-sans"> {/* Tailwind에서 폰트를 설정 */}
      {/* 지역 선택 */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold flex items-center">
          <FaMapMarkerAlt className="mr-2" /> 지역:
        </label>
        <Select
          isMulti
          closeMenuOnSelect={false} // 이 속성을 추가합니다.
          isClearable={true}
          options={regionOptions}
          value={regionOptions.filter((option) => region.includes(option.value))}
          onChange={(selectedOptions) => {
            setRegion(selectedOptions.map((option) => option.value));
          }}
          placeholder="지역을 선택하세요"
        />
      </div>

      {/* 대상 선택 버튼 */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold flex items-center">
          <FaUsers className="mr-2" /> 대상:
        </label>
        <div className="flex space-x-3">
          <button
            className={buttonClass(target === 'adult')}
            onClick={() => setTarget('adult')}
          >
            성인
          </button>
          <button
            className={buttonClass(target === 'child')}
            onClick={() => setTarget('child')}
          >
            유아 어린이
          </button>
          <button
            className={buttonClass(target === 'family')}
            onClick={() => setTarget('family')}
          >
            엄마랑 아기랑
          </button>
        </div>
      </div>

      {/* 시간대 선택 버튼 */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold flex items-center">
          <FiClock className="mr-2" /> 시간대:
        </label>
        
        <div className="flex space-x-3">
          {allTimes.map((timeSlot) => (
            <button
              key={timeSlot}
              className={buttonClass(time.includes(timeSlot))}
              onClick={() => {
                setTime((prevTime) => {
                  if (prevTime.includes(timeSlot)) {
                    return prevTime.filter((t) => t !== timeSlot);
                  } else {
                    return [...prevTime, timeSlot];
                  }
                });
              }}
            >
              {timeSlot === 'Early Morning' && '아침'}
              {timeSlot === 'Morning' && '오전'}
              {timeSlot === 'Afternoon' && '점심'}
              {timeSlot === 'Late Afternoon' && '오후'}
              {timeSlot === 'Evening' && '저녁'}
            </button>
          ))}
          <button
          className={buttonClass(time.length === 0)}
          onClick={() => {
            setTime([]); // 모든 선택 해제
          }}
          >
          전체 해제
          </button>
        </div>
      </div>

      {/* 세션 유형 선택 버튼 */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold flex items-center">
          <FiClipboard className="mr-2" /> 강좌:
        </label>
        <div className="flex space-x-3">
          <button
            className={buttonClass(sessionType === 'all')}
            onClick={() => setSessionType('all')}
          >
            All
          </button>
          <button
            className={buttonClass(sessionType === 'oneday')}
            onClick={() => setSessionType('oneday')}
          >
            1일 체험
          </button>
          <button
            className={buttonClass(sessionType === 'regular')}
            onClick={() => setSessionType('regular')}
          >
            정규 강좌
          </button>
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        className="mt-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white w-full rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
      >
        찾아보기
      </button>
    </div>
  );
}
