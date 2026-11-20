import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabase, STORAGE_BUCKET } from './supabase.js';
import { EXT_BY_MIME, UPLOADS_DIR } from '../middlewares/upload.js';

const PUBLIC_PATH_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isLegacyLocalFilename(value: string) {
  return !isAbsoluteUrl(value) && !value.includes('/') && !value.includes('\\');
}

export function isImageAvailable(value?: string | null) {
  if (!value) return false;
  if (isAbsoluteUrl(value) || storagePathFromStoredValue(value)) return true;
  if (isLegacyLocalFilename(value)) {
    return existsSync(path.join(UPLOADS_DIR, path.basename(value)));
  }
  return false;
}

export function extensionFromMime(mimeType: string) {
  return EXT_BY_MIME[mimeType] || '.img';
}

export function buildStoragePath(prefix: 'preperitajes' | 'avatars', ownerId: string, mimeType: string) {
  const timestamp = Date.now();
  const random = crypto.randomUUID().slice(0, 8);
  return `${prefix}/${ownerId}/${timestamp}-${random}${extensionFromMime(mimeType)}`;
}

export function storagePathFromStoredValue(value?: string | null) {
  if (!value) return null;

  const cleanValue = value.split('?')[0];
  let decoded = cleanValue;
  try {
    decoded = decodeURIComponent(cleanValue);
  } catch {
    decoded = cleanValue;
  }

  const markerIndex = decoded.indexOf(PUBLIC_PATH_MARKER);
  if (markerIndex >= 0) {
    return decoded.slice(markerIndex + PUBLIC_PATH_MARKER.length).replace(/^\/+/, '');
  }

  if (decoded.startsWith('preperitajes/') || decoded.startsWith('avatars/')) {
    return decoded.replace(/^\/+/, '');
  }

  return null;
}

export async function uploadImage(filePath: string, buffer: Buffer, contentType: string) {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, buffer, {
    contentType,
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || 'No se pudo subir la imagen a Supabase Storage.');
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function removeStoredImage(value?: string | null) {
  const filePath = storagePathFromStoredValue(value);
  if (!filePath) return;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
  if (error) {
    console.error('No se pudo eliminar la imagen de Supabase Storage:', error.message);
  }
}

export async function readImageBytes(value: string): Promise<Buffer> {
  const filePath = storagePathFromStoredValue(value);

  if (filePath) {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(filePath);
    if (error) {
      throw new Error(error.message || 'No se pudo descargar la imagen desde Supabase Storage.');
    }
    return Buffer.from(await data.arrayBuffer());
  }

  if (isAbsoluteUrl(value)) {
    const response = await fetch(value);
    if (!response.ok) {
      throw new Error('No se pudo descargar la imagen desde Supabase Storage.');
    }
    return Buffer.from(await response.arrayBuffer());
  }

  if (isLegacyLocalFilename(value)) {
    return fs.readFile(path.join(UPLOADS_DIR, path.basename(value)));
  }

  throw new Error('La imagen no está disponible en Supabase Storage.');
}
