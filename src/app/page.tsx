"use client"

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CourseCard from './components/CourseCard';
import { Course } from '../types/Course';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<number>(0);
  //const [region, setRegion] = useState<string>('all');
  const [region, setRegion] = useState<string[]>([]);
  const [target, setTarget] = useState<string>('all');
  const [time, setTime] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false); // 초기값을 false로 설정
  const perPage = 10;

  const fetchCourses = async (reset = false) => {
    try {
      const timeCategoryParam = time.map(encodeURIComponent).join(',');

      const queryParams = new URLSearchParams({
        query: searchTerm,
        target,
        sessionType,
        page: page.toString(),
        perPage: perPage.toString(),
      });

      // region 파라미터 추가
      region.forEach((regionValue) => {
        queryParams.append('region', regionValue);
      });

      // timeCategory 파라미터 추가
      time.forEach((timeCategory) => {
        queryParams.append('timeCategory', timeCategory);
      });

      const response = await fetch(`/api/courses?${queryParams.toString()}`);
      const data = await response.json();

      if (reset) {
        setCourses(data.courses);
      } else {
        setCourses((prevCourses) => [...prevCourses, ...data.courses]);
      }

      // 총 결과 수 업데이트
      setResults(data.total);

      // 현재까지 로드된 데이터 개수 계산
      const totalLoadedCourses = reset ? data.courses.length : courses.length + data.courses.length;

      // 더 불러올 데이터가 있는지 여부 설정
      if (totalLoadedCourses >= data.total) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  // 페이지 번호가 변경될 때마다 데이터 불러오기
  useEffect(() => {
    if (page === 1) return;
    fetchCourses();
  }, [page]);

  // 검색 조건 변경 시 이전 검색 결과 초기화
  useEffect(() => {
    setCourses([]);
    setResults(0);
    setHasMore(false);
  }, [searchTerm, region, target, time, sessionType]);

  // "더보기" 버튼 클릭 시 호출되는 함수
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // handleSearch 함수
  const handleSearch = () => {
    setPage(1);
    fetchCourses(true);
  };

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        region={region}
        setRegion={setRegion}
        target={target}
        setTarget={setTarget}
        time={time}
        setTime={setTime}
        sessionType={sessionType}
        setSessionType={setSessionType}
      />

      {/* 검색 결과 메시지 */}
      <div className="mt-4">
        {results > 0 ? (
          <p className="text-gray-700">검색된 강좌 수: {results}개</p>
        ) : (
          <p className="text-gray-700">검색된 강좌가 없습니다.</p>
        )}
      </div>

      {/* 코스 목록 렌더링 */}
      <div className="course-list mt-4 space-y-4">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* "더보기" 버튼 */}
      {hasMore && courses.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="mt-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
