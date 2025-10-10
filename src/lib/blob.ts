// Utilitários para Vercel Blob Storage
import { put, del } from '@vercel/blob'

export async function uploadImage(
  file: File,
  propertyId: number,
  type: 'banner' | 'gallery' | 'floor_plan' | 'apartment_variant'
): Promise<string> {
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `properties/${propertyId}/${type}-${timestamp}.${extension}`
  
  const blob = await put(filename, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
  
  return blob.url
}

export async function uploadMultipleImages(
  files: File[],
  propertyId: number,
  type: 'gallery' | 'floor_plan' | 'apartment_variant'
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, propertyId, type))
  return Promise.all(uploadPromises)
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

export async function deleteMultipleImages(urls: string[]): Promise<void> {
  const deletePromises = urls.map((url) => deleteImage(url))
  await Promise.all(deletePromises)
}

