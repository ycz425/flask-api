
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimeSelector, { TimeSlot } from './TimeSelector';
import { FileUp } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: any) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onSave }) => {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [syllabus, setSyllabus] = useState<File | null>(null);
  
  const handleSyllabusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSyllabus(e.target.files[0]);
    }
  };
  
  const handleSubmit = () => {
    // Separate time slots by type
    const lectureTimes = timeSlots.filter(slot => slot.type === 'lecture');
    const tutorialTimes = timeSlots.filter(slot => slot.type === 'tutorial');
    const officeHourTimes = timeSlots.filter(slot => slot.type === 'office_hour');
    const studySessionTimes = timeSlots.filter(slot => slot.type === 'study_session');
    
    // Create a course object with all the data
    const courseData = {
      id: Date.now().toString(),
      title: courseName,
      description,
      instructor,
      lectureTimes,
      tutorialTimes,
      officeHourTimes,
      studySessionTimes,
      syllabus: syllabus ? syllabus.name : null,
      hasSyllabus: !!syllabus
    };
    
    onSave(courseData);
    
    // Reset form
    setCourseName('');
    setDescription('');
    setInstructor('');
    setTimeSlots([]);
    setSyllabus(null);
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Enter the details for your new course.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="grid gap-6 py-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                placeholder="e.g., Introduction to Computer Science"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="animate-fade-in"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                placeholder="e.g., Professor Smith"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="animate-fade-in"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter a description of the course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24 animate-fade-in"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="syllabus">Syllabus (Optional)</Label>
              <div className="flex items-center space-x-4">
                <label 
                  htmlFor="syllabus"
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-muted rounded-md p-6 w-full hover:border-primary/50 transition-colors animate-fade-in"
                >
                  <div className="text-center">
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {syllabus ? syllabus.name : "Upload PDF syllabus"}
                    </p>
                  </div>
                  <input
                    id="syllabus"
                    type="file"
                    accept=".pdf"
                    onChange={handleSyllabusChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <TimeSelector 
              label="Course Schedule" 
              onChange={setTimeSlots} 
            />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!courseName}>Save Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseModal;
