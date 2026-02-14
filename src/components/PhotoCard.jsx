/**
 * File: src/components/PhotoCard.jsx
 * Component hiển thị một ảnh trong gallery
 */

import { downloadPhoto } from "../services/api.js";

export default function PhotoCard({ photo }) {
  const {
    fileName,
    fileSize,
    viewLink,
    downloadLink,
    thumbnailLink,
    uploaderName,
    uploadDate,
  } = photo;

 const handleDownload = async () => {
   try {
     // Sử dụng downloadLink thay vì viewLink
     const response = await fetch(photo.downloadLink);
     const blob = await response.blob();

     // Tạo URL tạm thời từ blob
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.href = url;
     a.download = photo.fileName || "download.jpg";
     document.body.appendChild(a);
     a.click();

     // Cleanup
     window.URL.revokeObjectURL(url);
     document.body.removeChild(a);
   } catch (error) {
     console.error("Download error:", error);
     // Fallback: mở link trực tiếp
     window.open(photo.downloadLink, "_blank");
   }
 };

  const formatSize = (bytes) => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={thumbnailLink}
          alt={fileName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />

        {/* Overlay với actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            {/* View button */}
            <a
              href={viewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
               Xem chi tiết
            </a>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
               Tải về
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        {/* File name */}
        <h3
          className="text-sm font-semibold text-gray-800 truncate mb-2"
          title={fileName}
        >
          {fileName}
        </h3>

        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span>👤</span>
            <span className="truncate">{uploaderName}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{uploadDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>💾</span>
            <span>{formatSize(fileSize)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
