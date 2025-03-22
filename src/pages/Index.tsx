
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import AddCourseModal from '@/components/AddCourseModal';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  title: string;
  description?: string;
  lectureCount?: number;
  nextSession?: string;
  hasSyllabus?: boolean;
}

const Index: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction to Computer Science",
      description: "Fundamental concepts of computer science, including algorithms, data structures, and computational thinking.",
      lectureCount: 5,
      nextSession: "Mon 10:00",
      hasSyllabus: true
    },
    {
      id: "2",
      title: "Calculus I",
      description: "Introduction to differential and integral calculus, including limits, derivatives, and applications.",
      lectureCount: 3,
      nextSession: "Wed 14:00",
      hasSyllabus: false
    }
  ]);

  const handleAddCourse = (courseData: any) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseData.title,
      description: courseData.description,
      lectureCount: 0,
      nextSession: courseData.lectureTimes.length > 0 
        ? `${courseData.lectureTimes[0].day} ${courseData.lectureTimes[0].time}` 
        : undefined,
      hasSyllabus: !!courseData.syllabus
    };
    
    setCourses(prev => [...prev, newCourse]);
  };

  return (
    <div className="min-h-screen bg-pattern animate-fade-in">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-primary font-medium mb-2 opacity-80 animate-slide-up">ORGANIZE YOUR LEARNING</p>
            <h1 className="text-4xl font-bold animate-slide-up animate-delay-100">Your Courses</h1>
          </div>
          
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 pl-5 pr-6 shadow-soft animate-slide-up animate-delay-200"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Course</span>
          </Button>
        </div>
        
        {courses.length === 0 ? (
          <div className="py-20 text-center animate-fade-in animate-delay-300">
            <h3 className="text-xl font-medium mb-4">No courses yet</h3>
            <p className="text-muted-foreground mb-8">Add your first course to get started</p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              Add Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        )}
      </main>
      
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCourse}
      />
    </div>
  );
};

export default Index;
