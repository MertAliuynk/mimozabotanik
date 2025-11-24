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

  const getUploadUrlMutation = api.upload.getUploadUrl.useMutation();
  const confirmUploadMutation = api.upload.confirmUpload.useMutation();

  const uploadFile = async (file: File, alt?: string, postId?: string) => {
    try {
      setUploadState({ isUploading: true, progress: 0, error: null });

      // Get upload URL
      const { uploadUrl, fileUrl, filename } = await getUploadUrlMutation.mutateAsync({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      });

      // Upload to Minio
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      setUploadState(prev => ({ ...prev, progress: 100 }));

      // Confirm upload in database
      const image = await confirmUploadMutation.mutateAsync({
        filename,
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