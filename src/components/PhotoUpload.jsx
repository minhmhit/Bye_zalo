/**
 * File: src/components/PhotoUpload.jsx
 * Component để upload nhiều ảnh với drag & drop
 */

import { useState, useRef } from "react";
import { uploadPhotos } from "../services/api.js";
import {
  validateFiles,
  formatFileSize,
  createPreviewUrl,
  revokePreviewUrl,
} from "../utils/fileUtils.js";

export default function PhotoUpload({ onUploadSuccess }) {
  const [uploaderName, setUploaderName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Xử lý khi chọn files
  const handleFileSelect = (files) => {
    setError(null);

    // Validate files
    const validation = validateFiles(files, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
    });

    if (!validation.isValid) {
      setError(validation.errors.join("\n"));
      return;
    }

    // Tạo previews
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map((file) => ({
      file,
      url: createPreviewUrl(file),
      name: file.name,
      size: formatFileSize(file.size),
    }));

    setSelectedFiles(fileArray);

    // Cleanup old previews
    previews.forEach((preview) => revokePreviewUrl(preview.url));
    setPreviews(newPreviews);
  };

  // Xử lý input change
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Xử lý drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Xử lý click vào dropzone
  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  // Xóa file đã chọn
  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Cleanup removed preview
    revokePreviewUrl(previews[index].url);

    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  // Xử lý upload
  const handleUpload = async () => {
    setError(null);

    // Validate
    if (!uploaderName.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }

    if (selectedFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một ảnh");
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadPhotos(
        {
          uploaderName: uploaderName,
          files: selectedFiles,
        },
        (progress) => {
          setUploadProgress(progress);
        },
      );

      // Success
      console.log("Upload success:", result);

      // Reset form
      setUploaderName("");
      setSelectedFiles([]);
      previews.forEach((preview) => revokePreviewUrl(preview.url));
      setPreviews([]);
      setUploadProgress(null);

      // Notify parent
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      setError(err.message);
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup previews khi unmount
  useState(() => {
    return () => {
      previews.forEach((preview) => revokePreviewUrl(preview.url));
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Ảnh </h2>

      {/* Uploader Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên của photographer là: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Nhập tên của bạn..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-red-900"
          disabled={isUploading}
        />
      </div>

      {/* File Dropzone */}
      <div
        onClick={handleDropzoneClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-primary bg-red-50"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="text-6xl mb-4">🖼️</div>
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragging ? "Thả ảnh vào đây" : "Kéo thả ảnh hoặc click để chọn"}
        </p>
        <p className="text-sm text-gray-500">Hỗ trợ: JPG, PNG, GIF, WebP</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* Preview Selected Files */}
      {previews.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Đã chọn {previews.length} ảnh
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  ×
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {preview.name}
                </p>
                <p className="text-xs text-gray-500">{preview.size}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">{uploadProgress.message}</p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={
          isUploading || selectedFiles.length === 0 || !uploaderName.trim()
        }
        className={`
          mt-6 w-full py-3 px-6 rounded-lg font-semibold text-white
          transition-all duration-200
          ${
            isUploading || selectedFiles.length === 0 || !uploaderName.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary hover:bg-red-600 active:scale-95"
          }
        `}
      >
        {isUploading
          ? " Đang upload..."
          : ` Upload ${selectedFiles.length} ảnh`}
      </button>
    </div>
  );
}
