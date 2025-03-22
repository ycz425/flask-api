
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import AddCourseModal from '@/components/AddCourseModal';
import CourseSettingsModal from '@/components/CourseSettingsModal';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/components/TimeSelector';

interface Course {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  lectureCount?: number;
  nextSession?: string;
  hasSyllabus?: boolean;
  lectureTimes?: TimeSlot[];
  tutorialTimes?: TimeSlot[];
  officeHourTimes?: TimeSlot[];
  studySessionTimes?: TimeSlot[];
  schedule?: string;
}

const Index: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction to Computer Science",
      description: "Fundamental concepts of computer science, including algorithms, data structures, and computational thinking.",
      instructor: "Dr. Jane Smith",
      lectureCount: 5,
      nextSession: "Mon 10:00",
      hasSyllabus: true,
      schedule: "Mon, Wed 10:00-11:30"
    },
    {
      id: "2",
      title: "Calculus I",
      description: "Introduction to differential and integral calculus, including limits, derivatives, and applications.",
      instructor: "Dr. John Doe",
      lectureCount: 3,
      nextSession: "Wed 14:00",
      hasSyllabus: false,
      schedule: "Wed, Fri 14:00-15:30"
    }
  ]);

  const handleAddCourse = (courseData: any) => {
    // Calculate next session from time slots
    let nextSession;
    if (courseData.lectureTimes && courseData.lectureTimes.length > 0) {
      nextSession = `${courseData.lectureTimes[0].day} ${courseData.lectureTimes[0].time}`;
    } else if (courseData.tutorialTimes && courseData.tutorialTimes.length > 0) {
      nextSession = `${courseData.tutorialTimes[0].day} ${courseData.tutorialTimes[0].time}`;
    }
    
    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseData.title,
      description: courseData.description,
      instructor: courseData.instructor,
      lectureCount: 0,
      nextSession,
      hasSyllabus: !!courseData.syllabus,
      lectureTimes: courseData.lectureTimes,
      tutorialTimes: courseData.tutorialTimes,
      officeHourTimes: courseData.officeHourTimes,
      studySessionTimes: courseData.studySessionTimes
    };
    
    setCourses(prev => [...prev, newCourse]);
  };
  
  const handleOpenSettings = (course: Course) => {
    setSelectedCourse(course);
    setIsSettingsModalOpen(true);
  };
  
  const handleRemoveCourse = () => {
    if (selectedCourse) {
      setCourses(prev => prev.filter(course => course.id !== selectedCourse.id));
      setIsSettingsModalOpen(false);
      setSelectedCourse(null);
    }
  };
  
  const handleScheduleChange = (newSchedule: TimeSlot[]) => {
    if (selectedCourse) {
      // Group time slots by type
      const lectureTimes = newSchedule.filter(slot => slot.type === 'lecture');
      const tutorialTimes = newSchedule.filter(slot => slot.type === 'tutorial');
      const officeHourTimes = newSchedule.filter(slot => slot.type === 'office_hour');
      const studySessionTimes = newSchedule.filter(slot => slot.type === 'study_session');
      
      // Calculate next session
      let nextSession = selectedCourse.nextSession;
      if (lectureTimes.length > 0) {
        nextSession = `${lectureTimes[0].day} ${lectureTimes[0].time}`;
      } else if (tutorialTimes.length > 0) {
        nextSession = `${tutorialTimes[0].day} ${tutorialTimes[0].time}`;
      }
      
      // Update course
      setCourses(prev => prev.map(course => {
        if (course.id === selectedCourse.id) {
          return {
            ...course,
            lectureTimes,
            tutorialTimes,
            officeHourTimes,
            studySessionTimes,
            nextSession
          };
        }
        return course;
      }));
    }
  };
  
  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourses(prev => prev.map(course => {
      if (course.id === updatedCourse.id) {
        return updatedCourse;
      }
      return course;
    }));
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
                onClick={() => handleOpenSettings(course)}
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
      
      {selectedCourse && (
        <CourseSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          course={selectedCourse}
          onRemoveCourse={handleRemoveCourse}
          onScheduleChange={handleScheduleChange}
          onCourseUpdate={handleCourseUpdate}
        />
      )}
    </div>
  );
};

export default Index;
