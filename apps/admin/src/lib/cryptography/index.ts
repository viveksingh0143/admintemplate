import CryptoJS from 'crypto-js';

export function encryptData<T>(data: T, secretKey: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

export function decryptData<T>(data: string, secretKey: string): T {
  return JSON.parse(CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8));
}
