import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';
import Course from '@/models/Course';

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const region = searchParams.get('region');
  const target = searchParams.get('target');
  const timeCategory = searchParams.get('timeCategory'); // Use timeCategory for filtering
  const sessionType = searchParams.get('sessionType');

  // MongoDB 쿼리 객체 생성
  const filter: any = {};
  if (query) filter.title = new RegExp(query, 'i');
  if (region && region !== 'all') filter.location = region;
  if (target && target !== 'all') filter.target = target;

  // timeCategory로 필터링
  if (timeCategory && timeCategory !== 'all') filter.timeCategory = timeCategory;

  // sessionType으로 필터링
  if (sessionType && sessionType !== 'all') filter.sessionType = sessionType;

  // 필터링된 코스 데이터 가져오기
  const courses = await Course.find(filter);

  return NextResponse.json(courses);
}
