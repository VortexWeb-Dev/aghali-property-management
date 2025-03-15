import React, { useState } from "react";
import axios from "axios";
import { Edit } from "lucide-react";

const UpdateContactButton = ({
  onUpdateContact,
  isLoading,
  existingContact,
  showModal,
  setShowModal
}) => {
  const [updatedContact, setUpdatedContact] = useState(existingContact);
  const [preview, setPreview] = useState(existingContact.avatar || "");

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const uploadedUrl = await Promise.all(
        files.map(async (file) => {
          const { data } = await axios.post(
            "https://vortexwebpropertymanagement.com/api/files/presigned-url",
            {
              key: file.name,
              contentType: file.type,
            }
          );

          await axios.put(data.presignedUrl.presignedUrl, file, {
            headers: { "Content-Type": file.type },
          });

          return `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`;
        })
      );

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        setPreview(URL.createObjectURL(imageFiles[0]));
        setUpdatedContact((prev) => ({ ...prev, avatar: uploadedUrl[0] }));
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateContact(updatedContact);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded transition"
      >
        <Edit className="h-6 w-6 text-blue-600 hover:text-blue-800"/>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] overflow-aut">
          <div className="bg-white p-6 rounded-lg w-96 relative z-[1001]">
            <h2 className="text-xl font-bold mb-4">Update Contact</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedContact.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedContact.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={updatedContact.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-100 p-3 text-center text-gray-700 hover:bg-gray-200 transition">
                  Upload Photo
                  <input
                    type="file"
                    name="photos"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {preview && <img src={preview} alt="Preview" className="mt-2 w-24 h-24 rounded-lg" />}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateContactButton;