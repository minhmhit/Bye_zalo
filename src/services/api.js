/**
 * File: src/services/api.js
 * Service để giao tiếp với Google Apps Script API
 */

import { API_CONFIG, getApiUrl } from "../config/api.config.js";
import { filesToBase64Array } from "../utils/fileUtils.js";

/**
 * Kiểm tra kết nối với API
 * @returns {Promise<Object>} Response data
 */
export const testConnection = async () => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.TEST_CONNECTION);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Test connection error:", error);
    throw new Error("Không thể kết nối đến server: " + error.message);
  }
};

/**
 * Lấy danh sách tất cả photos
 * @returns {Promise<Object>} {success, photos, count}
 */
export const getPhotos = async () => {
  try {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.GET_PHOTOS);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Lỗi khi tải danh sách ảnh");
    }

    return data;
  } catch (error) {
    console.error("Get photos error:", error);
    throw new Error("Không thể tải danh sách ảnh: " + error.message);
  }
};

/**
 * Upload photos lên Google Drive
 * @param {Object} uploadData - {uploaderName: string, files: FileList|File[]}
 * @param {Function} onProgress - Callback để cập nhật tiến trình
 * @returns {Promise<Object>} Response data
 */
export const uploadPhotos = async (uploadData, onProgress = null) => {
  try {
    const { uploaderName, files } = uploadData;

    // Validate input
    if (!uploaderName || !uploaderName.trim()) {
      throw new Error("Vui lòng nhập tên người upload");
    }

    if (!files || files.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một ảnh");
    }

    // Update progress: Converting files
    if (onProgress) {
      onProgress({
        stage: "converting",
        message: "Đang chuyển đổi ảnh...",
        percent: 10,
      });
    }

    // Chuyển đổi files sang base64
    const base64Files = await filesToBase64Array(files);

    // Update progress: Uploading
    if (onProgress) {
      onProgress({
        stage: "uploading",
        message: `Đang upload ${files.length} ảnh...`,
        percent: 30,
      });
    }

    // Tạo payload
    const payload = {
      uploader_name: uploaderName.trim(),
      files: base64Files,
    };

    // Gửi request
    const url = getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_PHOTOS);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Upload thất bại");
    }

    // Update progress: Complete
    if (onProgress) {
      onProgress({
        stage: "complete",
        message: "Upload thành công!",
        percent: 100,
      });
    }

    return data;
  } catch (error) {
    console.error("Upload photos error:", error);

    // Update progress: Error
    if (onProgress) {
      onProgress({
        stage: "error",
        message: error.message,
        percent: 0,
      });
    }

    throw new Error("Upload thất bại: " + error.message);
  }
};

/**
 * Download ảnh từ Google Drive
 * @param {string} downloadLink - Link download từ API
 * @param {string} fileName - Tên file để save
 */
export const downloadPhoto = (downloadLink, fileName) => {
  const link = document.createElement("a");
  link.href = downloadLink;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  testConnection,
  getPhotos,
  uploadPhotos,
  downloadPhoto,
};
