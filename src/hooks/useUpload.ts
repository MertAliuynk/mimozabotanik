import { useState } from 'react';
import { api } from '../utils/providers';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const confirmUploadMutation = api.upload.confirmUpload.useMutation();

  const uploadFile = async (file: File, alt?: string, postId?: string) => {
    try {
      setUploadState({ isUploading: true, progress: 0, error: null });

      // Upload file to local storage via the REST endpoint
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const { url: fileUrl, fileName } = await uploadResponse.json();

      setUploadState(prev => ({ ...prev, progress: 100 }));

      // Confirm upload in database
      const image = await confirmUploadMutation.mutateAsync({
        filename: fileName,
        mimeType: file.type,
        size: file.size,
        alt,
        postId,
      });

      setUploadState({ isUploading: false, progress: 100, error: null });
      return { image, fileUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState({ isUploading: false, progress: 0, error: errorMessage });
      throw error;
    }
  };

  return {
    uploadFile,
    ...uploadState,
  };
}
