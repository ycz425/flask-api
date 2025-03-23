'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Book, BrainCircuit } from 'lucide-react';

interface QuizParametersProps {
  onStartQuiz: (parameters: QuizParameters) => void;
}

export interface QuizParameters {
  difficulty: 'easy' | 'medium' | 'hard';
  fromLecture: number;
  toLecture: number;
}

const QuizParameters: React.FC<QuizParametersProps> = ({ onStartQuiz }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [lectureRange, setLectureRange] = useState([1, 5]);
  const maxLectures = 10; // You can adjust this based on your course data
  
  const handleStart = () => {
    onStartQuiz({
      difficulty,
      fromLecture: lectureRange[0],
      toLecture: lectureRange[1]
    });
  };
  
  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2" />
          Quiz Parameters
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Select Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
            >
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Easy
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="hard">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    Hard
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Lecture Coverage</Label>
              <span className="text-sm text-muted-foreground">
                Lectures {lectureRange[0]} to {lectureRange[1]}
              </span>
            </div>
            
            <Slider
              defaultValue={[1, 5]}
              max={maxLectures}
              min={1}
              step={1}
              value={lectureRange}
              onValueChange={setLectureRange}
              className="py-4"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Lecture 1</span>
              <span>Lecture {maxLectures}</span>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleStart} className="w-full">
              Start Quiz
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizParameters;
