// src/app/components/SearchBar.tsx

'use client';

import React from 'react';
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa'; // 위치와 타겟 아이콘
import { FiClock, FiClipboard } from 'react-icons/fi'; // 시간과 세션 아이콘
import Select from 'react-select';
import * as gtag from '../../lib/gtag';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  region: string[];
  setRegion: React.Dispatch<React.SetStateAction<string[]>>;
  target: string;
  setTarget: (target: string) => void;
  time: string[];
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
    // ... 나머지 지역 옵션들 ...
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
    <div className="mb-4 font-sans">
      {/* 지역 선택 */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold flex items-center">
          <FaMapMarkerAlt className="mr-2" /> 지역:
        </label>
        <Select
          isMulti
          closeMenuOnSelect={false}
          isClearable={true}
          options={regionOptions}
          value={regionOptions.filter((option) => region.includes(option.value))}
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions.map((option) => option.value);
            setRegion(selectedValues);
            // GA 이벤트 전송
            gtag.event('select_region', {
              region: selectedValues.join(','),
            });
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
            onClick={() => {
              setTarget('adult'); 
              gtag.event('select_target', {
                target_type: 'adult',
              });
            }}
          >
            성인
          </button>
          <button
            className={buttonClass(target === 'child')}
            onClick={() => {
              setTarget('child');
              gtag.event('select_target', {
                target_type: 'child',
              });
            }}
          >
            유아 어린이
          </button>
          <button
            className={buttonClass(target === 'family')}
            onClick={() => {
              setTarget('family');
              gtag.event('select_target', {
                target_type: 'family',
              });
            }}
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
                  let updatedTime;
                  if (prevTime.includes(timeSlot)) {
                    updatedTime = prevTime.filter((t) => t !== timeSlot);
                  } else {
                    updatedTime = [...prevTime, timeSlot];
                  }
                  // GA 이벤트 전송
                  gtag.event('select_time_slot', {
                    time_slot: timeSlot,
                    selected_times: updatedTime.join(','),
                  });
                  return updatedTime;
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
              setTime([]);
              // GA 이벤트 전송
              gtag.event('clear_time_slots', {
                action: 'clear_all',
              });
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
            onClick={() => {
              setSessionType('all');
              gtag.event('select_session_type', {
                session_type: 'all',
              });
            }}
          >
            All
          </button>
          <button
            className={buttonClass(sessionType === 'oneday')}
            onClick={() => {
              setSessionType('oneday');
              gtag.event('select_session_type', {
                session_type: 'oneday',
              });
            }}
          >
            1일 체험
          </button>
          <button
            className={buttonClass(sessionType === 'regular')}
            onClick={() => {
              setSessionType('regular');
              gtag.event('select_session_type', {
                session_type: 'regular',
              });
            }}
          >
            정규 강좌
          </button>
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        onClick={() => {
          handleSearch();
          gtag.event('click_search', {
            search_term: searchTerm,
            region: region.join(','),
            target: target,
            time_slots: time.join(','),
            session_type: sessionType,
          });
        }}
        className="mt-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white w-full rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
      >
        찾아보기
      </button>
    </div>
  );
}
