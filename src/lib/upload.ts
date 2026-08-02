import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const UPLOAD_URL_PREFIX = '/uploads';

export const ensureUploadDirExists = async () => {
  await mkdir(UPLOAD_DIR, { recursive: true });
};

export const generateUniqueFilename = (originalName: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

export const saveUploadedFile = async (buffer: Buffer, fileName: string) => {
  await ensureUploadDirExists();
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);
  return `${UPLOAD_URL_PREFIX}/${fileName}`;
};

export const deleteUploadedFile = async (fileName: string) => {
  try {
    await unlink(path.join(UPLOAD_DIR, fileName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
};
