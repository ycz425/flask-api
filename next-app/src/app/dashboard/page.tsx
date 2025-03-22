'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AddCourseModal from '@/components/AddCourseModal';
import CourseCard from '@/components/CourseCard';
import Navbar from '@/components/Navbar';

interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Placeholder for API call to fetch courses
      // This would be replaced with actual API call in a real app
      setTimeout(() => {
        setCourses([
          {
            id: '1',
            name: 'Introduction to React',
            description: 'Learn the fundamentals of React including components, state, and props.',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Advanced JavaScript Concepts',
            description: 'Explore closures, prototypes, and asynchronous programming in JavaScript.',
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const handleAddCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    // Placeholder for API call to add a course
    // This would be replaced with actual API call in a real app
    const newCourse = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    setIsAddCourseModalOpen(false);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/dashboard/course/${courseId}`);
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">You don't have any courses yet.</p>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create your first course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        )}
      </main>

      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default Dashboard; 