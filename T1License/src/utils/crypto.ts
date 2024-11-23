import CryptoJS from 'crypto-js';

export const cryptoUtils = {
  // 第一次哈希（注册和登录共用）
  generateFirstHash(password: string): string {
    return CryptoJS.SHA256(password).toString();
  },
};
