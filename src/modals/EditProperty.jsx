import React, { useState } from "react";
import axios from "axios";
import { Upload, X } from "lucide-react";
import { Edit } from "lucide-react";
const UpdatePropertyButton = ({
  onUpdateProperty,
  //   isLoading,
  existingProperty,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(existingProperty.photos[0]);
  const [updatedProperty, setUpdatedProperty] = useState(existingProperty);
  const [files, setFiles] = useState([]);

  const handleImgFileUpload = async (e) => {
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

          // Upload file to S3 using the pre-signed URL
          await axios.put(data.presignedUrl.presignedUrl, file, {
            headers: { "Content-Type": file.type },
          });

          return `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`;
        })
      );

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const nonImageFiles = files.filter(
        (file) => !file.type.startsWith("image/")
      );

      setUpdatedProperty((prev) => ({
        ...prev,
        ...(imageFiles.length > 0 && { photos: uploadedUrl }),
        ...(nonImageFiles.length > 0 && { attachments: uploadedUrl }),
      }));
      // Set preview for the first image file
      if (imageFiles.length > 0) {
        const fileUrl = URL.createObjectURL(imageFiles[0]);
        setPreview(fileUrl);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
    setFiles(files);
  };

  const handleDocFileUpload = async (e) => {
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

          // Upload file to S3 using the pre-signed URL
          await axios.put(data.presignedUrl.presignedUrl, file, {
            headers: { "Content-Type": file.type },
          });

          return `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`;
        })
      );

      // const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const nonImageFiles = files.filter(
        (file) => !file.type.startsWith("image/")
      );

      setUpdatedProperty((prev) => ({
        ...prev,
        ...(nonImageFiles.length > 0 && { attachments: uploadedUrl }),
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
    }
    setFiles(files);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProperty(updatedProperty);
    setShowModal(false);
  };

  const removeFile = (indexToRemove, isPhoto) => {
    if (isPhoto) {
      setPreview(null);
    } else {
      setFiles(files.filter((_, index) => index !== indexToRemove));
    }

    // Reset the input value to allow re-uploading the same file
    const input = document.getElementById("file-upload");
    if (input) {
      input.value = "";
    }
  };

  const generalFields = [
    { name: "name", type: "text", placeholder: "Property Name" },
    { name: "buildYear", type: "number", placeholder: "Year Built" },
    { name: "address", type: "text", placeholder: "Address" },
    { name: "city", type: "text", placeholder: "City" },
    { name: "stateOrRegion", type: "text", placeholder: "State / Region" },
    { name: "zip", type: "text", placeholder: "Zip" },
    { name: "country", type: "text", placeholder: "Country" },
  ];

  return (
    <>
      <button
          className="flex items-center text-green-600 hover:text-gray-900 transition-colors duration-200"
          onClick={() => setShowModal(true)}
          >
          <Edit className="w-8 h-8 m-3" />
            Edit
          </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99] overflow-y-auto p-6">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex gap-[75%]">
            <h2 className="text-2xl w-[50%] font-bold mb-6 text-gray-800">
              Update Property
            </h2>
            <X className="h-8 w-8 text-gray-400 hover:text-gray-900 " onClick={()=> setShowModal(false)}/>
            </div>

            <form
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              onSubmit={handleSubmit}
            >
              {/* Left Column - Property Details */}
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Property Photo
                  </h2>
                  <div className="flex flex-col gap-4">
                    <label className="group relative flex items-center justify-center gap-3 px-5 py-4 bg-white border-2 border-dashed border-blue-400 hover:border-blue-500 text-blue-600 font-medium rounded-xl cursor-pointer transition-colors duration-200">
                      <Upload className="w-5 h-5" />
                      <span>Upload Property Photo</span>
                      <input
                        type="file"
                        name="photos"
                        className="hidden"
                        onChange={handleImgFileUpload}
                        accept="image/*"
                      />
                    </label>

                    {preview && (
                      <div className="mt-2">
                        <div className="relative group">
                          <img
                            src={preview}
                            alt="Property photo"
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* General Information */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    General Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {generalFields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          {field.placeholder}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          value={updatedProperty[field.name]}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Property Type
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`p-5 rounded-xl border-2 transition-all ${
                        updatedProperty.type === "Single Unit"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="Single Unit"
                          checked={updatedProperty.type === "Single Unit"}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium block mb-1">
                            Single Unit
                          </span>
                          <p className="text-sm text-gray-600">
                            Single family rentals (SFR) with only one rental
                            unit per address.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div
                      className={`p-5 rounded-xl border-2 transition-all ${
                        updatedProperty.type === "Multi Unit"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="Multi Unit"
                          checked={updatedProperty.type === "Multi Unit"}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 text-green-500 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium block mb-1">
                            Multi Unit
                          </span>
                          <p className="text-sm text-gray-600">
                            Multiple rental units sharing a single property
                            address.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
              
              </div>

              {/* Right Column - Features, Amenities, Attachments */}
              <div className="space-y-6">
                {/* Features */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {updatedProperty.feature &&
                      updatedProperty.feature.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1.5 text-sm"
                        >
                          {item}
                          <button
                            onClick={() => {
                              const newFeatures = [...updatedProperty.feature];
                              newFeatures.splice(index, 1);
                              setUpdatedProperty((prev) => ({
                                ...prev,
                                feature: newFeatures,
                              }));
                            }}
                            className="hover:text-blue-600 p-0.5"
                            type="button"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="feature-input"
                      placeholder="Enter feature and press Add"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value) {
                            setUpdatedProperty((prev) => ({
                              ...prev,
                              feature: [...(prev.feature || []), value],
                            }));
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("feature-input");
                        const value = input.value.trim();
                        if (value) {
                          setUpdatedProperty((prev) => ({
                            ...prev,
                            feature: [...(prev.feature || []), value],
                          }));
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {updatedProperty.amenities &&
                      updatedProperty.amenities.map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1.5 text-sm"
                        >
                          {item}
                          <button
                            onClick={() => {
                              const newAmenities = [
                                ...updatedProperty.amenities,
                              ];
                              newAmenities.splice(index, 1);
                              setUpdatedProperty((prev) => ({
                                ...prev,
                                amenities: newAmenities,
                              }));
                            }}
                            className="hover:text-blue-600 p-0.5"
                            type="button"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="amenities-input"
                      placeholder="Enter amenities and press Add"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value) {
                            setUpdatedProperty((prev) => ({
                              ...prev,
                              amenities: [...(prev.amenities || []), value],
                            }));
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input =
                          document.getElementById("amenities-input");
                        const value = input.value.trim();
                        if (value) {
                          setUpdatedProperty((prev) => ({
                            ...prev,
                            amenities: [...(prev.amenities || []), value],
                          }));
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Documents & Attachments
                  </h2>
                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-6 transition-colors"
                    >
                      <div className="flex justify-center items-center w-14 h-14 bg-gray-50 text-gray-500 rounded-full mb-2">
                        <span className="text-2xl font-bold">+</span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Upload Documents
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        Store contracts, templates, and other files
                      </span>
                    </label>

                    <input
                      id="file-upload"
                      type="file"
                      name="attachments"
                      multiple
                      className="hidden"
                      onChange={handleDocFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.html,.htm,.xml,.json,.csv,.tsv,.epub,.djvu,.ps,.eps,.tex,.latex,.blend,.ai,.psd,.indd,.zip,.rar,.7z"
                    />

                    {files.filter((file) => !file.type.startsWith("image/"))
                      .length > 0 && (
                      <div className="mt-2">
                        <h3 className="font-medium text-gray-700 mb-2">
                          Uploaded Documents
                        </h3>
                        <div className="space-y-2">
                          {files
                            .filter((file) => !file.type.startsWith("image/"))
                            .map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                              >
                                <span className="text-sm text-gray-700">
                                  {file.name}
                                </span>
                                <button
                                  onClick={() => removeFile(index, false)}
                                  className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                                  aria-label={`Remove ${file.name}`}
                                  type="button"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Property Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Beds
                      </label>
                      <input
                        type="number"
                        name="beds"
                        placeholder="Number of beds"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={updatedProperty.beds}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Baths
                      </label>
                      <input
                        type="number"
                        name="baths"
                        placeholder="Number of baths"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={updatedProperty.baths}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Size (sq.ft)
                      </label>
                      <input
                        type="number"
                        name="size"
                        placeholder="Property size"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={updatedProperty.size}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Market Rent
                      </label>
                      <input
                        type="number"
                        name="marketRent"
                        placeholder="Monthly rent"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={updatedProperty.marketRent}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Deposit
                      </label>
                      <input
                        type="number"
                        name="deposit"
                        placeholder="Security deposit"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={updatedProperty.deposit}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Parking
                      </label>
                      <select
                        name="parking"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        onChange={handleInputChange}
                        defaultValue={existingProperty.parking}
                      >
                        <option value="Covered">Covered</option>
                        <option value="Uncovered">Uncovered</option>
                        <option value="None">None</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Laundry
                      </label>
                      <select
                        name="laundry"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        onChange={handleInputChange}
                        defaultValue={existingProperty.laundry}
                      >
                        <option value="In-Unit">In-Unit</option>
                        <option value="Shared">Shared</option>
                        <option value="None">None</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        AC Type
                      </label>
                      <select
                        name="ac"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        onChange={handleInputChange}
                        defaultValue={existingProperty.ac}
                      >
                        <option value="Central">Central</option>
                        <option value="Window">Window</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Button - Full Width */}
              <div className="col-span-1 lg:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Update Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePropertyButton;
