
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertCircle, BrainCircuit, Award, Clock, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  type: 'multiple-choice' | 'short-answer' | 'long-answer';
}

interface QuizProps {
  questions?: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete?: (score: number, totalQuestions: number) => void;
  showQuizContent?: boolean;
}

// Mock questions for different difficulty levels
const easyQuestions: QuizQuestion[] = [
  {
    id: "easy1",
    question: "What is the primary purpose of an algorithm?",
    options: [
      "To create visual designs",
      "To solve problems through a series of steps",
      "To write documentation",
      "To design hardware"
    ],
    correctAnswer: 1,
    type: 'multiple-choice'
  },
  {
    id: "easy2",
    question: "Which data structure operates on a Last-In-First-Out (LIFO) principle?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Tree"
    ],
    correctAnswer: 1,
    type: 'multiple-choice'
  },
  {
    id: "easy3",
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Processing Unit",
      "Central Program Unit",
      "Control Processing Unit"
    ],
    correctAnswer: 0,
    type: 'multiple-choice'
  }
];

const mediumQuestions: QuizQuestion[] = [
  {
    id: "medium1",
    question: "Explain the difference between a stack and a queue data structure.",
    type: 'short-answer',
    correctAnswer: "stack queue LIFO FIFO"
  },
  {
    id: "medium2",
    question: "What is recursion and provide a simple example of a recursive function.",
    type: 'short-answer',
    correctAnswer: "recursion function calls itself factorial fibonacci"
  }
];

const hardQuestions: QuizQuestion[] = [
  {
    id: "hard1",
    question: "Analyze the time and space complexity of quicksort algorithm. Discuss its best, average, and worst case scenarios and compare it with other sorting algorithms.",
    type: 'long-answer',
    correctAnswer: "quicksort O(n log n) O(n²) partitioning pivot comparison"
  }
];

const Quiz: React.FC<QuizProps> = ({ 
  difficulty, 
  onComplete = () => {}, 
  showQuizContent = false,
  questions: customQuestions
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showQuizList, setShowQuizList] = useState(false);

  useEffect(() => {
    // Set questions based on difficulty or use custom questions if provided
    if (customQuestions && customQuestions.length > 0) {
      setQuestions(customQuestions);
    } else {
      switch (difficulty) {
        case 'easy':
          setQuestions(easyQuestions);
          break;
        case 'medium':
          setQuestions(mediumQuestions);
          break;
        case 'hard':
          setQuestions(hardQuestions);
          break;
      }
    }
  }, [difficulty, customQuestions]);
  
  // If not showing quiz content, just return empty
  if (!showQuizContent) {
    return null;
  }
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswered) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAnswer(e.target.value);
  };
  
  const handleCheckAnswer = () => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.type === 'multiple-choice') {
      if (selectedOption === null) return;
      
      setIsAnswered(true);
      if (selectedOption === currentQ.correctAnswer) {
        setScore(score + 1);
      }
    } else {
      if (textAnswer.trim() === '') return;
      
      setIsAnswered(true);
      
      // For text answers, check if key terms are included
      // This is a simple implementation - in real app, you'd use more sophisticated methods
      const correctAnswerStr = currentQ.correctAnswer as string;
      const keyTerms = correctAnswerStr.split(' ');
      
      let matches = 0;
      keyTerms.forEach(term => {
        if (textAnswer.toLowerCase().includes(term.toLowerCase())) {
          matches++;
        }
      });
      
      // If more than 60% of key terms are found, count it as correct
      if (matches / keyTerms.length > 0.6) {
        setScore(score + 1);
      }
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setTextAnswer("");
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      onComplete(score + (isAnswered && (
        (questions[currentQuestion].type === 'multiple-choice' && selectedOption === questions[currentQuestion].correctAnswer) || 
        (questions[currentQuestion].type !== 'multiple-choice' && textAnswer.includes(questions[currentQuestion].correctAnswer as string))
      ) ? 1 : 0), questions.length);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setTextAnswer("");
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const handleReturnToQuizList = () => {
    setShowQuizList(true);
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };
  
  const getDifficultyTitle = () => {
    switch (difficulty) {
      case 'easy': return 'Basic Concepts';
      case 'medium': return 'Intermediate Application';
      case 'hard': return 'Advanced Analysis';
      default: return 'Quiz';
    }
  };

  if (showQuizList) {
    // Return null to trigger the parent component to return to quiz list
    return null;
  }

  if (isCompleted) {
    const percentage = (score / questions.length) * 100;
    const isPerfect = percentage === 100;
    
    return (
      <Card className="shadow-soft animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isPerfect ? 'bg-green-100' : 'bg-primary/10'} mb-6`}>
            {isPerfect ? (
              <Award className="h-8 w-8 text-green-500" />
            ) : (
              <Check className="h-8 w-8 text-primary" />
            )}
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">Quiz Completed!</h2>
          <p className="text-muted-foreground mb-2">
            You scored {score} out of {questions.length}
          </p>
          
          {isPerfect && (
            <p className="text-green-500 font-medium mb-4">
              Perfect score! Next difficulty level unlocked.
            </p>
          )}
          
          <div className="w-full bg-muted h-3 rounded-full mb-6">
            <div 
              className={`${isPerfect ? 'bg-green-500' : 'bg-primary'} h-3 rounded-full transition-all`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={resetQuiz} className="px-8">Try Again</Button>
            <Button onClick={handleReturnToQuizList} variant="outline">Return to Quiz Selection</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <BrainCircuit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className={cn("text-sm font-medium", getDifficultyColor())}>
            {getDifficultyTitle()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReturnToQuizList}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Quiz Selection
          </Button>
          <div className="text-sm font-medium">
            Score: {score}
          </div>
        </div>
      </div>
      
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {currentQ.question}
          </h3>
          
          {currentQ.type === 'multiple-choice' && (
            <RadioGroup className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center space-x-2 rounded-md border p-4 cursor-pointer transition-all",
                    selectedOption === index && !isAnswered && "border-primary bg-primary/5",
                    isAnswered && index === currentQ.correctAnswer && "border-green-500 bg-green-50",
                    isAnswered && selectedOption === index && selectedOption !== currentQ.correctAnswer && "border-red-500 bg-red-50"
                  )}
                  onClick={() => handleOptionSelect(index)}
                >
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`} 
                    checked={selectedOption === index}
                    className="pointer-events-none"
                  />
                  <Label 
                    htmlFor={`option-${index}`}
                    className={cn(
                      "flex-1 cursor-pointer",
                      isAnswered && index === currentQ.correctAnswer && "text-green-700",
                      isAnswered && selectedOption === index && selectedOption !== currentQ.correctAnswer && "text-red-700"
                    )}
                  >
                    {option}
                  </Label>
                  
                  {isAnswered && index === currentQ.correctAnswer && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  
                  {isAnswered && selectedOption === index && selectedOption !== currentQ.correctAnswer && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}
          
          {(currentQ.type === 'short-answer' || currentQ.type === 'long-answer') && (
            <div>
              <Textarea 
                value={textAnswer}
                onChange={handleTextChange}
                placeholder={currentQ.type === 'short-answer' ? 
                  "Enter your brief answer (1-2 sentences)" : 
                  "Enter your detailed analysis"
                }
                className={cn(
                  "w-full transition-all",
                  currentQ.type === 'long-answer' ? "min-h-32" : "min-h-20",
                  isAnswered && "border-primary"
                )}
                disabled={isAnswered}
              />
              
              {isAnswered && (
                <div className="mt-4 bg-muted/20 p-3 rounded-md border">
                  <h4 className="text-sm font-medium mb-1">Key concepts to include:</h4>
                  <p className="text-sm text-muted-foreground">
                    {(currentQ.correctAnswer as string).split(' ').join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-3">
        {!isAnswered ? (
          <Button 
            onClick={handleCheckAnswer}
            disabled={currentQ.type === 'multiple-choice' ? 
              selectedOption === null : 
              textAnswer.trim() === ''
            }
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? "Next Question" : "View Results"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
