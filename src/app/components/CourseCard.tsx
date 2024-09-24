import React from 'react';
import { FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi'; // Import icons for aesthetic enhancement

interface CourseCardProps {
  course: {
    title: string;
    info: string;
    date: string;
    time: string;
    price: string;
    sessionType: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="course-card bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-semibold text-lg text-blue-800">{course.title}</h3>
      <div className="text-sm text-gray-600">
        <p className="flex items-center"><FiMapPin className="mr-2"/> {course.info}</p>
        <p className="flex items-center"><FiClock className="mr-2"/> {course.date} at {course.time}</p>
        <p className="flex items-center"><FiDollarSign className="mr-2"/> {course.price}</p>
        <p>{course.sessionType === 'oneday' ? '1일 체험' : '정규 강좌'}</p>
      </div>
    </div>
  );
}
