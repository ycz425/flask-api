/**
 * Utility functions for file uploading and processing
 */

/**
 * Uploads a file to an API endpoint for analysis and returns the text response
 * @param file File to be uploaded
 * @param endpoint Optional API endpoint URL
 * @returns Promise with analysis text
 */
export async function uploadFileForAnalysis(
  file: File,
  endpoint?: string
): Promise<string> {
  try {
    // Create a FormData instance to handle file upload
    const formData = new FormData();
    formData.append('file', file);

    // Use default API endpoint if none provided
    const apiEndpoint = endpoint || '/api/lectures/analyze';

    // Send the request to the API endpoint
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      body: formData,
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`File upload failed with status: ${response.status}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Return analysis text or fallback to a placeholder
    return data.analysis || "File received successfully. Analysis pending.";
  } catch (error) {
    console.error('Error uploading file for analysis:', error);
    throw error;
  }
}

/**
 * Handles file validation before upload
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSizeMB Maximum file size in MB
 * @returns Boolean indicating if file is valid
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = [],
  maxSizeMB: number = 10
): { valid: boolean; message?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      message: `File size exceeds the maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  // Check file type if allowedTypes is provided
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
} 