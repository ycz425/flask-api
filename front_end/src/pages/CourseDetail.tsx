import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TabContainer, { TabPanel } from '@/components/TabContainer';
import FileUploader from '@/components/FileUploader';
import SummaryViewer from '@/components/SummaryViewer';
import Quiz from '@/components/Quiz';
import AssessmentSection from '@/components/AssessmentSection';
import ChatSection from '@/components/ChatSection';
import CourseSettingsModal from '@/components/CourseSettingsModal';
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  BrainCircuit, 
  Award,
  Settings,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mockCourses = {
  "1": {
    id: "1",
    title: "Introduction to Computer Science",
    description: "Fundamental concepts of computer science, including algorithms, data structures, and computational thinking.",
    schedule: "Mon, Wed 10:00-11:30",
    instructor: "Dr. Smith",
    lectureCount: 5,
    summaries: [
      {
        id: "s1",
        title: "Introduction to Algorithms",
        fileName: "algorithms_intro.pdf",
        date: "September 15, 2023",
        fileType: "PDF",
        summary: "This lecture introduces the fundamental concepts of algorithms. It covers the definition of algorithms, their importance in computer science, common algorithm design paradigms, and basic examples. Key topics include time and space complexity analysis, Big O notation, and how to evaluate algorithm efficiency. The lecture also briefly introduces sorting algorithms and their comparative analysis."
      },
      {
        id: "s2",
        title: "Data Structures Overview",
        fileName: "data_structures.pdf",
        date: "September 22, 2023",
        fileType: "PDF",
        summary: "An overview of fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. The lecture explains how these structures store and organize data, and discusses their advantages and limitations."
      }
    ],
    assignments: [
      {
        id: "a1",
        title: "Algorithm Implementation",
        description: "Implement three sorting algorithms and compare their performance",
        dueDate: "October 5, 2023",
        status: "pending"
      }
    ],
    nextExam: {
      title: "Midterm Examination",
      date: "October 15, 2023",
      exactDate: "2023-10-15T14:00:00",
      location: "Main Hall, Building A"
    }
  },
  "2": {
    id: "2",
    title: "Calculus I",
    description: "Introduction to differential and integral calculus, including limits, derivatives, and applications.",
    schedule: "Tue, Thu 14:00-15:30",
    instructor: "Dr. Johnson",
    lectureCount: 3,
    summaries: [],
    assignments: [],
    nextExam: {
      title: "Quiz 1",
      date: "September 28, 2023",
      exactDate: "2023-09-28T10:00:00",
      location: "Room 204, Math Building"
    }
  }
};

const quizDifficulties = [
  {
    level: "easy",
    isUnlocked: true,
    title: "Basic Concepts",
    description: "Test your knowledge of fundamental course concepts",
    questionsCount: 10
  },
  {
    level: "medium",
    isUnlocked: false,
    title: "Intermediate Application",
    description: "Apply concepts to solve more complex problems",
    questionsCount: 8
  },
  {
    level: "hard",
    isUnlocked: false,
    title: "Advanced Analysis",
    description: "Analyze and evaluate complex scenarios",
    questionsCount: 6
  }
];

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("summary");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showingQuiz, setShowingQuiz] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [unlockedLevels, setUnlockedLevels] = useState({
    easy: true,
    medium: false,
    hard: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const course = mockCourses[courseId as keyof typeof mockCourses] || {
    id: "not-found",
    title: "Course Not Found",
    description: "",
    schedule: "",
    instructor: "",
    lectureCount: 0,
    summaries: [],
    assignments: [],
    nextExam: null
  };
  
  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
      duration: 3000,
    });
  };

  const handleRemoveCourse = () => {
    toast({
      title: "Course Removed",
      description: `${course.title} has been removed from your courses.`,
      duration: 3000,
    });
    
    navigate('/');
  };

  const handleScheduleChange = (newSchedule: Array<{day: string, time: string}>) => {
    console.log("New schedule:", newSchedule);
    toast({
      title: "Schedule Updated",
      description: "Your course schedule has been updated successfully.",
      duration: 3000,
    });
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage === 100) {
      if (quizDifficulty === 'easy' && !unlockedLevels.medium) {
        setUnlockedLevels(prev => ({ ...prev, medium: true }));
        toast({
          title: "Medium Difficulty Unlocked!",
          description: "You've unlocked the intermediate difficulty quiz.",
          duration: 3000,
        });
      } else if (quizDifficulty === 'medium' && !unlockedLevels.hard) {
        setUnlockedLevels(prev => ({ ...prev, hard: true }));
        toast({
          title: "Hard Difficulty Unlocked!",
          description: "You've unlocked the advanced difficulty quiz.",
          duration: 3000,
        });
      }
    }
  };

  const handleReturnFromQuiz = () => {
    setShowingQuiz(false);
  };

  const lectureForm = useForm({
    defaultValues: {
      title: "",
      lectureNumber: "",
      date: "",
      file: null as File | null
    }
  });

  const handleAddLecture = (data: any) => {
    console.log("New lecture:", data);
    toast({
      title: "Lecture Added",
      description: `${data.title} has been added to your lectures.`,
      duration: 3000,
    });
  };

  const assignmentForm = useForm({
    defaultValues: {
      title: "",
      dueDate: "",
      file: null as File | null
    }
  });

  const handleAddAssignment = (data: any) => {
    console.log("New assignment:", data);
    toast({
      title: "Assignment Added",
      description: `${data.title} has been added to your assignments.`,
      duration: 3000,
    });
  };

  const assessmentForm = useForm({
    defaultValues: {
      type: "quiz",
      title: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      lectureRange: "",
      file: null as File | null
    }
  });

  const handleAddAssessment = (data: any) => {
    console.log("New assessment:", data);
    toast({
      title: "Assessment Added",
      description: `${data.title} has been added to your assessments.`,
      duration: 3000,
    });
  };

  const handleStartQuiz = (difficulty: 'easy' | 'medium' | 'hard') => {
    setQuizDifficulty(difficulty);
    setShowingQuiz(true);
  };

  return (
    <div className="min-h-screen bg-pattern animate-fade-in">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-3 animate-slide-right">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Courses
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div className="animate-slide-up">
              <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
              <p className="text-muted-foreground text-sm">{course.description}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground animate-slide-up animate-delay-100">
              {course.schedule && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{course.schedule}</span>
                </div>
              )}
              
              {course.instructor && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{course.instructor}</span>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center gap-1.5"
                  onClick={() => setShowSettingsDialog(true)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Course Settings</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-soft border animate-fade-in animate-delay-200">
          <TabContainer
            tabs={[
              { label: "Summary", id: "summary" },
              { label: "Lectures", id: "lectures" },
              { label: "Assignments", id: "assignments" },
              { label: "Quiz", id: "quiz" },
              { label: "Assessments", id: "assessments" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <TabPanel id="summary">
              <div className="p-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold mb-3 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Course Overview
                    </h2>
                    
                    <div className="h-[calc(100vh-350px)] overflow-auto">
                      <ChatSection />
                    </div>
                  </div>
                  
                  <div>
                    {course.nextExam && (
                      <div className="mb-3">
                        <h2 className="text-lg font-semibold mb-2 flex items-center">
                          <Award className="h-5 w-5 mr-2" />
                          Next Exam
                        </h2>
                        <div className="p-3 border rounded-lg bg-primary/5 border-primary/20">
                          <p className="font-medium">{course.nextExam.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(course.nextExam.exactDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">{course.nextExam.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {course.assignments && course.assignments.length > 0 && (
                      <div className="mb-3">
                        <h2 className="text-lg font-semibold mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Upcoming Assignment
                        </h2>
                        <div className="p-3 border rounded-lg bg-primary/5 border-primary/20">
                          <p className="font-medium">{course.assignments[0].title}</p>
                          <p className="text-xs mt-1">{course.assignments[0].description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Due: {course.assignments[0].dueDate}</p>
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-lg font-semibold mb-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Sessions
                    </h2>
                    
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg bg-muted/10">
                        <p className="font-medium">Lecture</p>
                        <p className="text-xs text-muted-foreground mt-1">Monday, 10:00 AM</p>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-muted/10">
                        <p className="font-medium">Tutorial</p>
                        <p className="text-xs text-muted-foreground mt-1">Wednesday, 2:00 PM</p>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-muted/10">
                        <p className="font-medium">Office Hours</p>
                        <p className="text-xs text-muted-foreground mt-1">Friday, 11:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <TabPanel id="lectures">
              <div className="p-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Lecture Materials
                  </h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" />
                        <span>Add Lecture</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Lecture</DialogTitle>
                      </DialogHeader>
                      <Form {...lectureForm}>
                        <form onSubmit={lectureForm.handleSubmit(handleAddLecture)} className="space-y-4">
                          <FormField
                            control={lectureForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lecture Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter lecture title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={lectureForm.control}
                            name="lectureNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lecture Number</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={lectureForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mb-4">
                            <FormLabel>Upload File</FormLabel>
                            <div className="mt-2">
                              <FileUploader onFileUpload={(file) => {
                                lectureForm.setValue('file', file);
                              }} />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add Lecture</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {course.summaries.length > 0 ? (
                  <div className="space-y-3">
                    {course.summaries.map(summary => (
                      <Collapsible key={summary.id} className="border rounded-lg overflow-hidden">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30 focus:outline-none">
                          <div>
                            <h3 className="font-medium">{summary.title}</h3>
                            <p className="text-sm text-muted-foreground">{summary.date}</p>
                          </div>
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform ui-open:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="border-t px-4 py-3 bg-muted/10">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded flex items-center justify-center bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{summary.fileName}</p>
                                  <p className="text-xs text-muted-foreground">{summary.fileType} • {summary.date}</p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs h-7">Download</Button>
                              </div>
                              <div className="mt-3">
                                <h4 className="text-sm font-medium mb-1">Summary</h4>
                                <p className="text-sm text-muted-foreground">{summary.summary}</p>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/20 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">No lecture materials yet</p>
                    <p className="text-muted-foreground mt-1 mb-6">Click the Add Lecture button to upload materials</p>
                  </div>
                )}
              </div>
            </TabPanel>
            
            <TabPanel id="assignments">
              <div className="p-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Assignments
                  </h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" />
                        <span>Add Assignment</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Assignment</DialogTitle>
                      </DialogHeader>
                      <Form {...assignmentForm}>
                        <form onSubmit={assignmentForm.handleSubmit(handleAddAssignment)} className="space-y-4">
                          <FormField
                            control={assignmentForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assignment Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter assignment title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assignmentForm.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mb-4">
                            <FormLabel>Upload Assignment File</FormLabel>
                            <div className="mt-2">
                              <FileUploader onFileUpload={(file) => {
                                assignmentForm.setValue('file', file);
                              }} />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add Assignment</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {course.assignments && course.assignments.length > 0 ? (
                  <div className="space-y-3">
                    {course.assignments.map(assignment => (
                      <Collapsible key={assignment.id} className="border rounded-lg overflow-hidden">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30 focus:outline-none">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                          </div>
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform ui-open:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="border-t px-4 py-3 bg-muted/10">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{assignment.description}</p>
                            <div className="mt-4 flex justify-end">
                              <Button size="sm">Upload Submission</Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/20 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">No assignments yet</p>
                    <p className="text-muted-foreground mt-1 mb-6">Click the Add Assignment button to create assignments</p>
                  </div>
                )}
              </div>
            </TabPanel>
            
            <TabPanel id="quiz">
              <div className="p-1">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BrainCircuit className="h-5 w-5 mr-2" />
                  Practice Quiz
                </h2>
                
                {showingQuiz ? (
                  <Quiz 
                    difficulty={quizDifficulty} 
                    onComplete={handleQuizComplete}
                    showQuizContent={true}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quizDifficulties.map((difficulty, index) => {
                      const isUnlocked = index === 0 ? true : 
                                        index === 1 ? unlockedLevels.medium : 
                                        unlockedLevels.hard;
                      
                      return (
                        <div 
                          key={difficulty.level}
                          className={`border rounded-lg overflow-hidden shadow-soft ${!isUnlocked ? 'opacity-70' : ''}`}
                        >
                          <div className={`p-4 ${difficulty.level === 'easy' ? 'bg-green-50' : difficulty.level === 'medium' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                            <h3 className="font-semibold">{difficulty.title}</h3>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">{difficulty.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{difficulty.questionsCount} questions</span>
                              {isUnlocked ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStartQuiz(difficulty.level as 'easy' | 'medium' | 'hard')}
                                >
                                  Start Quiz
                                </Button>
                              ) : (
                                <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                                  <Clock className="h-4 w-4" />
                                  <span>Locked</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabPanel>
            
            <TabPanel id="assessments">
              <div className="p-1">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Assessments
                  </h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4" />
                        <span>Add Assessment</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Assessment</DialogTitle>
                      </DialogHeader>
                      <Form {...assessmentForm}>
                        <form onSubmit={assessmentForm.handleSubmit(handleAddAssessment)} className="space-y-4">
                          <FormField
                            control={assessmentForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assessment Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="test">Test</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assessmentForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter assessment title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assessmentForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assessmentForm.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assessmentForm.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration (minutes)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="60" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assessmentForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter location" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={assessmentForm.control}
                            name="lectureRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lecture Range</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Lectures 1-5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mb-4">
                            <FormLabel>Upload File (Optional)</FormLabel>
                            <div className="mt-2">
                              <FileUploader onFileUpload={(file) => {
                                assessmentForm.setValue('file', file);
                              }} />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add Assessment</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <AssessmentSection />
              </div>
            </TabPanel>
          </TabContainer>
        </div>
      </main>
      
      <CourseSettingsModal 
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        course={course}
        onRemoveCourse={handleRemoveCourse}
        onScheduleChange={handleScheduleChange}
      />
    </div>
  );
};

export default CourseDetail;
