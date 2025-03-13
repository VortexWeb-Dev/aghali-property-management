import React, { useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";

const AddContactButton = ({ onAddContact, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [preview, setPreview] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    try {
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

      setNewContact((prev) => ({
        ...prev,
        avatar: `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddContact(newContact);
    setShowModal(false);
    setNewContact({ name: "", email: "", phone: "", avatar: "" });
    setPreview("");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
      >
        <PlusCircle className="w-5 h-5" />
        Add Contact
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[199]">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newContact.name}
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
                  value={newContact.email}
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
                  value={newContact.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-100 p-3 text-center text-gray-700 hover:bg-gray-200 transition">
                  Upload Photo
                  <input
                    type="file"
                    name="photo"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {preview && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full border"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPreview("");
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  {isLoading ? "Adding..." : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddContactButton;
