import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';

// ÖNEMLİ: Dosyalar bilerek `public/` klasörünün DIŞINA yazılıyor.
// Çoğu deploy akışı (git pull + rebuild, docker image'ı yeniden build etme,
// rsync --delete vb.) `public/` klasörünü her seferinde sıfırlar/yeniden
// kopyalar — bu yüzden oraya yazılan yüklenen dosyalar bir sonraki deploy'da
// kaybolur (uygulama "başarılı" der ama dosya bir süre sonra 404 verir).
// UPLOAD_DIR, ortam değişkeni ile kalıcı bir diske (ör. bir Docker volume
// veya sunucuda deploy'un dokunmadığı ayrı bir klasör) yönlendirilebilir;
// tanımlı değilse proje kökünün yanında `uploads-data` klasörü kullanılır.
export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads-data');

// Dosyalar artık public/ altında olmadığından statik olarak servis edilemez;
// src/app/api/uploads/[filename]/route.ts bu prefix'i karşılayıp UPLOAD_DIR'dan okur.
export const UPLOAD_URL_PREFIX = '/api/uploads';

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
