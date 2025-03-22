
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  description?: string;
  lectureCount?: number;
  nextSession?: string;
  hasSyllabus?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description = 'No description provided',
  lectureCount = 0,
  nextSession,
  hasSyllabus = false
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/course/${id}`);
  };

  return (
    <Card 
      className="card-hover glass-card overflow-hidden cursor-pointer animate-fade-in"
      onClick={handleClick}
    >
      <div className="h-2 bg-primary"></div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        
        <div className="flex items-center justify-between text-sm mt-4">
          <div className="flex items-center text-muted-foreground">
            <FileText className="h-4 w-4 mr-1" />
            <span>{lectureCount} lectures</span>
          </div>
          
          {nextSession && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{nextSession}</span>
            </div>
          )}
          
          {hasSyllabus && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Syllabus</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
