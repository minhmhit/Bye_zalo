/**
 * File: src/App.jsx
 * Main application component - Landing page
 */

import { useState } from "react";
import PhotoUpload from "./components/PhotoUpload.jsx";
import PhotoGallery from "./components/PhotoGallery.jsx";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("gallery"); // 'gallery' hoặc 'upload'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback khi upload thành công
  const handleUploadSuccess = (result) => {
    console.log("Upload success:", result);

    // Show toast notification
    alert(`✅ Upload thành công ${result.files?.length || 0} ảnh!`);

    // Switch to gallery tab
    setActiveTab("gallery");

    // Trigger gallery refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo & Title */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-primary">
                Ảnh tết
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Tạm biệt za lô
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all
                  ${
                    activeTab === "gallery"
                      ? "bg-white text-primary shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                Xem ảnh
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all
                  ${
                    activeTab === "upload"
                      ? "bg-white text-primary shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
              Upload
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === "upload" ? (
          <div className="max-w-4xl mx-auto px-4">
            <PhotoUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <PhotoGallery refreshTrigger={refreshTrigger} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">Dự án tết 2026 _ Minh Mai</p>
            <p className="text-xs text-gray-500">
              Lưu hành nội bộ gia đình, không chia sẻ đường dẫn ra bên ngoài. Mọi thắc mắc liên hệ: <a href="mailto:minh.maihoang.71@gmail.com" className="text-blue-600 hover:underline">minh.maihoang.71@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
