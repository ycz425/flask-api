
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileUp, File, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedFileTypes = ".pdf,.doc,.docx,.ppt,.pptx",
  multiple = false
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate file upload with progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploading(false);
        // Notify parent component about uploaded files
        files.forEach(file => onFileUpload(file));
        // Show success message
        toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
        // Clear the files list
        setFiles([]);
      }
    }, 300);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-all"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          accept={acceptedFileTypes}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload files</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop or click to upload
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOCX, PPT
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/30 rounded p-3 animate-slide-up">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {uploading && (
            <Progress value={progress} className="h-2 animate-fade-in" />
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={uploading || files.length === 0}
              className="px-6"
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
