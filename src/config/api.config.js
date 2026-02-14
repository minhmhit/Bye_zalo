/**
 * File: src/config/api.config.js
 * Cấu hình API endpoint cho Google Apps Script
 *
 * HƯỚNG DẪN:
 * 1. Deploy code.gs lên Google Apps Script
 * 2. Lấy URL Web App (Deploy > New deployment > Web app)
 * 3. Thay thế YOUR_DEPLOYED_WEB_APP_URL bên dưới
 */

export const API_CONFIG = {
  // TODO: Thay thế URL này bằng URL Web App của bạn
  BASE_URL:
    "https://script.google.com/macros/s/AKfycbw57HprLnCJh61eWVsolaHZ8VLgnEliQUjWCrQgh7Wed83_FHSVJJmx6rzWIKxFlGBXSA/exec",

  // Các endpoint
  ENDPOINTS: {
    UPLOAD_PHOTOS: "", // POST to BASE_URL
    GET_PHOTOS: "?action=getPhotos", // GET
    TEST_CONNECTION: "?action=testConnection", // GET
  },

  // Timeout cho request (ms)
  TIMEOUT: 30000,
};

// Helper để tạo full URL
export const getApiUrl = (endpoint = "") => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
