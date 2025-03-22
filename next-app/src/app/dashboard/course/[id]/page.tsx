'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import TabContainer from '@/components/TabContainer';
import SummaryViewer from '@/components/SummaryViewer';
import FileUploader from '@/components/FileUploader';
import AssessmentSection from '@/components/AssessmentSection';
import CourseSettingsModal from '@/components/CourseSettingsModal';

interface CourseDetails {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) {
      // Placeholder for API call to fetch course details
      // This would be replaced with actual API call in a real app
      setTimeout(() => {
        setCourse({
          id,
          name: 'Introduction to React',
          description: 'Learn the fundamentals of React including components, state, and props.',
          createdAt: new Date().toISOString(),
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [user, id]);

  const handleUpdateCourse = (updatedCourse: Partial<CourseDetails>) => {
    if (course) {
      // Placeholder for API call to update course
      // This would be replaced with actual API call in a real app
      setCourse({
        ...course,
        ...updatedCourse,
      });
    }
    setIsSettingsModalOpen(false);
  };

  const handleDeleteCourse = () => {
    // Placeholder for API call to delete course
    // This would be replaced with actual API call in a real app
    router.push('/dashboard');
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'files', label: 'Files' },
    { id: 'assessment', label: 'Assessment' },
  ];

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

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Settings
          </button>
        </div>

        <TabContainer
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          {activeTab === 'summary' && (
            <SummaryViewer courseId={id} />
          )}
          {activeTab === 'files' && (
            <FileUploader courseId={id} />
          )}
          {activeTab === 'assessment' && (
            <AssessmentSection courseId={id} />
          )}
        </div>
      </main>

      <CourseSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        course={course}
        onUpdate={handleUpdateCourse}
        onDelete={handleDeleteCourse}
      />
    </div>
  );
} 