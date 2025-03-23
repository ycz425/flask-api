import { NextRequest, NextResponse } from 'next/server';
  
  export async function POST(request: NextRequest) {
    try {
      const { query, course, user_id } = await request.json()
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query, course: course, user_id: user_id }),
      });
      
      return NextResponse.json({
        message: (await response.json()).response,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } catch (error) {
      console.error('Error fetching assistant response:', error);
      throw new Error('Failed to get assistant response');
    }
  } 