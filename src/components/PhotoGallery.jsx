/**
 * File: src/components/PhotoGallery.jsx
 * Component hiển thị grid gallery các ảnh
 */

import { useState, useEffect } from "react";
import PhotoCard from "./PhotoCard.jsx";
import { getPhotos } from "../services/api.js";

export default function PhotoGallery({ refreshTrigger }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load photos
  const loadPhotos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPhotos();
      setPhotos(result.photos || []);
    } catch (err) {
      setError(err.message);
      console.error("Load photos error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load photos on mount và khi có refresh trigger
  useEffect(() => {
    loadPhotos();
  }, [refreshTrigger]);

  // Filter photos theo search query
  const filteredPhotos = photos.filter((photo) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      photo.fileName?.toLowerCase().includes(query) ||
      photo.uploaderName?.toLowerCase().includes(query)
    );
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Đang tải ảnh...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPhotos}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (photos.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có ảnh nào
          </h3>
          <p className="text-gray-500">Hãy nổ phát súng đầu tiên</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ảnh tết</h2>
            <p className="text-gray-600 mt-1">Tổng cộng {photos.length} ảnh</p>
          </div>

          {/* Refresh button */}
          <button
            onClick={loadPhotos}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            🔄 load ảnh mới
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=" Tìm kiếm theo tên file hoặc người upload..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-red-900"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Không tìm thấy ảnh nào với từ khóa "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <PhotoCard key={photo.fileId} photo={photo} />
          ))}
        </div>
      )}

      {/* Footer info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        {filteredPhotos.length !== photos.length && (
          <p>
            Hiển thị {filteredPhotos.length} / {photos.length} ảnh
          </p>
        )}
      </div>
    </div>
  );
}
