import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';
import Course from '@/models/Course';

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  //const region = searchParams.get('region');
  const regions = searchParams.getAll('region');
  const target = searchParams.get('target');
  const sessionType = searchParams.get('sessionType');

  // 페이지네이션 파라미터 처리
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);

  // timeCategory를 배열로 가져오기
  const timeCategories = searchParams.getAll('timeCategory');

  // MongoDB 쿼리 객체 생성
  const filter: any = {};
  if (query) filter.title = new RegExp(query, 'i');
  if (regions.length > 0) {
    filter.location = { $in: regions };
  }
  //if (region && region !== 'all') filter.location = region;
  if (target && target !== 'all') filter.target = target;
  if (sessionType && sessionType !== 'all') filter.sessionType = sessionType;

  // timeCategory 필터 적용
  if (timeCategories.length > 0) {
    filter.timeCategory = { $in: timeCategories };
  }

  // 총 결과 수 계산
  const totalCourses = await Course.countDocuments(filter);

  // 페이지네이션 적용하여 코스 데이터 가져오기
  const courses = await Course.find(filter)
    .skip((page - 1) * perPage)
    .limit(perPage);

  return NextResponse.json({
    courses,
    total: totalCourses,
  });
}
