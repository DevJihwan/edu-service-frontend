import React from 'react';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa'; // 위치와 타겟 아이콘
import { FiClock, FiClipboard } from 'react-icons/fi'; // 시간과 세션 아이콘

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  region: string;
  setRegion: (region: string) => void;
  target: string;
  setTarget: (target: string) => void;
  time: string;
  setTime: (time: string) => void;
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
  // 버튼 스타일 및 호버 스타일
  const buttonClass = (selected: boolean) =>
    `p-3 border rounded-lg shadow-md transition-all duration-200 ${
      selected ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white' : 'bg-gray-100 text-gray-600'
    } hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white`;

  return (
    <div className="mb-4 font-sans"> {/* Tailwind에서 폰트를 설정 */}
      {/* 지역 선택 */}
      <div className="mb-4">
        <label htmlFor="region" className="block mb-2 font-semibold flex items-center">
          <FaMapMarkerAlt className="mr-2" /> 지역:
        </label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="all">All</option>
          <option value="gangnam">강남구</option>
          <option value="gangdong">강동구</option>
          <option value="gangbuk">강북구</option>
          <option value="gangseo">강서구</option>
          <option value="gwanak">관악구</option>
          <option value="gwangjin">광진구</option>
          <option value="guro">구로구</option>
          <option value="geumcheon">금천구</option>
          <option value="nowon">노원구</option>
          <option value="dobong">도봉구</option>
          <option value="dongdaemun">동대문구</option>
          <option value="dongjak">동작구</option>
          <option value="mapo">마포구</option>
          <option value="seodaemun">서대문구</option>
          <option value="seocho">서초구</option>
          <option value="seongdong">성동구</option>
          <option value="seongbuk">성북구</option>
          <option value="songpa">송파구</option>
          <option value="yangcheon">양천구</option>
          <option value="yeongdeungpo">영등포구</option>
          <option value="yongsan">용산구</option>
          <option value="eunpyeong">은평구</option>
          <option value="jung">중구</option>
          <option value="jungnang">중랑구</option>
        </select>
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
          <button
            className={buttonClass(time === 'morning')}
            onClick={() => setTime('morning')}
          >
            아침
          </button>
          <button
            className={buttonClass(time === 'midmorning')}
            onClick={() => setTime('midmorning')}
          >
            오전
          </button>
          <button
            className={buttonClass(time === 'afternoon')}
            onClick={() => setTime('afternoon')}
          >
            점심
          </button>
          <button
            className={buttonClass(time === 'Late Afternoon')}
            onClick={() => setTime('Late Afternoon')}
          >
            오후
          </button>
          <button
            className={buttonClass(time === 'Evening')}
            onClick={() => setTime('Evening')}
          >
            저녁
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
