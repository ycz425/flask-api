'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const CourseCard = ({ course, onClick }: { course: Course, onClick: () => void }) => {
  const router = useRouter();
  const formattedDate = new Date(course.createdAt).toLocaleDateString();

  return (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{course.name}</h3>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-3">Created {formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
