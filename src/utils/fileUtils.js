/**
 * File: src/utils/fileUtils.js
 * Các hàm tiện ích để xử lý file
 */

/**
 * Chuyển đổi File object sang Base64 string
 * @param {File} file - File object từ input
 * @returns {Promise<string>} Base64 string (không có prefix)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Lấy kết quả và loại bỏ prefix "data:image/...;base64,"
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Chuyển đổi nhiều files sang Base64
 * @param {FileList|File[]} files - Danh sách files
 * @returns {Promise<Array>} Mảng các object {name, type, data}
 */
export const filesToBase64Array = async (files) => {
  const fileArray = Array.from(files);

  const promises = fileArray.map(async (file) => {
    const base64Data = await fileToBase64(file);
    return {
      name: file.name,
      type: file.type,
      data: base64Data,
      size: file.size,
    };
  });

  return Promise.all(promises);
};

/**
 * Validate file trước khi upload
 * @param {File} file - File cần validate
 * @param {Object} options - Các tùy chọn validate
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB mặc định
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  } = options;

  // Kiểm tra loại file
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File ${file.name}: Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)`,
    };
  }

  // Kiểm tra kích thước
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
    return {
      isValid: false,
      error: `File ${file.name}: Kích thước vượt quá ${maxSizeMB}MB`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validate danh sách files
 * @param {FileList|File[]} files - Danh sách files
 * @param {Object} options - Các tùy chọn validate
 * @returns {Object} {isValid: boolean, errors: string[]}
 */
export const validateFiles = (files, options = {}) => {
  const fileArray = Array.from(files);
  const errors = [];

  fileArray.forEach((file) => {
    const validation = validateFile(file, options);
    if (!validation.isValid) {
      errors.push(validation.error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format kích thước file thành dạng có thể đọc
 * @param {number} bytes - Kích thước file tính bằng bytes
 * @returns {string} Kích thước đã format (VD: "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Tạo preview URL cho file ảnh
 * @param {File} file - File ảnh
 * @returns {string} URL preview
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Giải phóng preview URL
 * @param {string} url - URL cần giải phóng
 */
export const revokePreviewUrl = (url) => {
  URL.revokeObjectURL(url);
};
