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

  // MongoDB query object
  const filter: any = {};
  if (query) filter.title = new RegExp(query, 'i');
  if (region && region !== 'all') filter.location = region;
  if (target && target !== 'all') filter.target = target;

  // Filter by timeCategory if specified
  if (timeCategory && timeCategory !== 'all') filter.timeCategory = timeCategory;

  // Filter by sessionType
  if (sessionType && sessionType !== 'all') filter.sessionType = sessionType;

  // Fetch filtered courses
  const courses = await Course.find(filter);

  return NextResponse.json(courses);
}
