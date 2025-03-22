
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, CalendarClock } from 'lucide-react';
import TimeSelector from './TimeSelector';

interface CourseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onRemoveCourse: () => void;
  onScheduleChange: (newSchedule: Array<{day: string, time: string}>) => void;
}

const CourseSettingsModal: React.FC<CourseSettingsModalProps> = ({
  isOpen,
  onClose,
  course,
  onRemoveCourse,
  onScheduleChange
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [lectureTimes, setLectureTimes] = useState<Array<{day: string, time: string}>>([]);
  
  // Parse current schedule
  const parseCourseSchedule = () => {
    // This is a simplified example - in a real app, you'd parse the schedule string
    // Format: "Mon, Wed 10:00-11:30"
    if (!course.schedule) return [];
    
    try {
      // Basic parsing logic for "Mon, Wed 10:00-11:30" format
      const parts = course.schedule.split(' ');
      const days = parts[0].replace(',', '').split(','); // ['Mon', 'Wed']
      const timeRange = parts[1].split('-'); // ['10:00', '11:30']
      const startTime = timeRange[0]; // '10:00'
      
      return days.map(day => ({ day, time: startTime }));
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return [
        { day: 'Mon', time: '10:00' },
        { day: 'Wed', time: '10:00' }
      ];
    }
  };
  
  useEffect(() => {
    // Initialize lecture times when the component mounts or course changes
    if (course) {
      setLectureTimes(parseCourseSchedule());
    }
  }, [course]);
  
  const handleScheduleUpdate = () => {
    onScheduleChange(lectureTimes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Course Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <div className="max-h-[400px] overflow-y-auto">
            <TabsContent value="general" className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input 
                  id="courseName"
                  value={course?.title || ''} 
                  readOnly 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input 
                  id="instructor"
                  value={course?.instructor || ''} 
                  readOnly 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule">Current Schedule</Label>
                <Input 
                  id="schedule"
                  value={course?.schedule || ''} 
                  readOnly 
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
                <Button 
                  variant="destructive" 
                  onClick={onRemoveCourse}
                  className="w-full justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Course
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <CalendarClock className="h-4 w-4" />
                <span className="text-sm">Update your course schedule</span>
              </div>
              
              <TimeSelector 
                label="Lecture Schedule" 
                onChange={setLectureTimes}
                initialSelected={parseCourseSchedule()}
              />
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleScheduleUpdate}>
                  Update Schedule
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CourseSettingsModal;
