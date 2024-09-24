"use client"

import { useState } from 'react';
import SearchBar from './components/SearchBar';
import CourseCard from './components/CourseCard';

interface Course {
  id: number;
  title: string;
  location: string;
  date: string;
  description: string;
  sessionType: string;
  time: string; // Include time for display
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Course[]>([]);
  const [region, setRegion] = useState<string>('all');
  const [target, setTarget] = useState<string>('all');
  const [time, setTime] = useState<string>('all');
  const [sessionType, setSessionType] = useState<string>('all');
  const [visibleCourses, setVisibleCourses] = useState<number>(10); // To track how many courses to show

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      query: searchTerm,
      region,
      target,
      time,
      sessionType,
    });

    const response = await fetch(`/api/courses?${queryParams.toString()}`);
    const data: Course[] = await response.json();
    setResults(data);
    setVisibleCourses(10); // Reset visible courses after each search
  };

  const loadMoreCourses = () => {
    setVisibleCourses((prevVisible) => prevVisible + 10); // Show 10 more courses each time
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
      
      {/* Display the total number of results */}
      <div className="mt-4">
        {results.length > 0 ? (
          <p className="text-gray-700">검색된 강좌 수: {results.length}개</p>
        ) : (
          <p className="text-gray-700">검색된 강좌가 없습니다.</p>
        )}
      </div>

      <div className="mt-4">
        {/* Show only the number of courses set by visibleCourses */}
        {results.slice(0, visibleCourses).map((result) => (
          <CourseCard key={result.id} course={result} />
        ))}
      </div>

      {/* Show "Load More" button if there are more courses to load */}
      {visibleCourses < results.length && (
        <button
          onClick={loadMoreCourses}
          className="mt-4 p-2 bg-blue-500 text-white w-full"
        >
          더보기
        </button>
      )}
    </div>
  );
}
