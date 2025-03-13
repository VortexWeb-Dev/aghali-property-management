import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Upload, PlusCircle } from "lucide-react";

const AddProperty = () => {
  const navigate = useNavigate();

  const generalFields = [
    { name: "name", type: "text", placeholder: "Property Name" },
    { name: "buildYear", type: "number", placeholder: "Year Built" },
    { name: "address", type: "text", placeholder: "Address" },
    { name: "city", type: "text", placeholder: "City" },
    { name: "stateOrRegion", type: "text", placeholder: "State / Region" },
    { name: "zip", type: "text", placeholder: "Zip" },
    { name: "country", type: "text", placeholder: "Country" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    buildYear: "",
    address: "",
    city: "",
    stateOrRegion: "",
    zip: "",
    country: "",
    type: "Single Unit",
    beds: 1,
    baths: 1,
    size: "",
    marketRent: "",
    deposit: "",
    parking: "",
    laundry: "",
    ac: "",
    feature: [],
    amenities: [],
    photos: [],
    attachments: [],
  });

  const [files, setFiles] = useState([]);
  const [previewImg, setPreviewImg] = useState([]);
  const [previewDoc, setPreviewDoc] = useState([]);
  const [showFeatureInput, setShowFeatureInput] = useState(false);
  const [showAmenityInput, setShowAmenityInput] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');


  const handleAdd = (type) => {
    if (type === 'feature' && newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        feature: [...prev.feature, newFeature.trim()]
      }));
      setNewFeature('');
      setShowFeatureInput(false);
    } else if (type === 'amenity' && newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
      setShowAmenityInput(false);
    }
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImgFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    try {
      const uploadedUrls = await Promise.all(
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

          console.log(data);
          return `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`;
          // return data.publicUrl; // Store the public URL
        })
      );

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));


      setFormData((prev) => ({
        ...prev,
        ...(imageFiles.length > 0 && { photos: uploadedUrls })
      }));

      const fileUrl = URL.createObjectURL(...imageFiles);
      console.log(fileUrl);
      
      setPreviewImg((prev) => [...prev, fileUrl]);
      console.log(previewImg)
    } catch (error) {
      console.error("Error uploading files:", error);
    }


    setFiles(files);
  };

  const handleDocFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    try {
      const uploadedUrls = await Promise.all(
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

          console.log(data);
          return `https://aghali.s3.ap-south-1.amazonaws.com/${file.name}`;
          // return data.publicUrl; // Store the public URL
        })
      );

      const nonImageFiles = files.filter(
        (file) => !file.type.startsWith("image/")
      );

      setFormData((prev) => ({
        ...prev,
        ...(nonImageFiles.length > 0 && { attachments: uploadedUrls }),
      }));

      console.log(nonImageFiles);
      const fileUrl = URL.createObjectURL(...nonImageFiles);
      console.log(fileUrl);
      

      setPreviewDoc((prev) => [...prev, fileUrl]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }


    setFiles(files);
  };

  const removeFile = (indexToRemove, isPhoto) => {
    if(isPhoto){
      const photoInput = document.getElementById("photo-upload");
      if (photoInput) {
        photoInput.value = "";
      }
      setPreviewImg('');
      // const photoFiles = files.filter((file) => file.type.startsWith("image/"));
      // setFiles(files.filter((file) => !file.type.startsWith("image/")));
      setFormData(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== indexToRemove)
      }));
    }


    else{
      const input = document.getElementById("file-upload");
      if (input) {
        input.value = "";
      }
      setFiles(files.filter((_, index) => index !== indexToRemove));

      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== indexToRemove)
      }))
      setPreviewDoc(prev => prev.filter((_, i) => i !== indexToRemove))

      // Reset the input value to allow re-uploading the same file
    }
      
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://vortexwebpropertymanagement.com/api/properties",
        formData
      );
      navigate("/properties"); // Redirect after successful submission
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

return (
  <div className="p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
    <h1 className="text-3xl font-bold mb-8 text-gray-800">Add New Property</h1>
    
    <form className="grid grid-cols-1 lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
      {/* Left Column - Property Details */}
      <div className="space-y-6">
        {/* Currency Selection */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            name="currency"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            onChange={handleChange}
            defaultValue="AED"
          >
            <option value="AED">د.إ AED</option>
            <option value="$ US Dollar">$ US Dollar</option>
          </select>
        </div>

        {/* General Information */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">General Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {generalFields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{field.placeholder}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-xl border-2 transition-all ${
              formData.type === "Single Unit" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Single Unit"
                  checked={formData.type === "Single Unit"}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium block mb-1">Single Unit</span>
                  <p className="text-sm text-gray-600">
                    Single family rentals (SFR) with only one rental unit per address.
                  </p>
                </div>
              </label>
            </div>

            <div className={`p-5 rounded-xl border-2 transition-all ${
              formData.type === "Multi Unit" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="Multi Unit"
                  checked={formData.type === "Multi Unit"}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium block mb-1">Multi Unit</span>
                  <p className="text-sm text-gray-600">
                    Multiple rental units sharing a single property address.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm md:w-[200%]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 ">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Beds</label>
              <input
                type="number"
                name="beds"
                placeholder="Number of beds"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.beds}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Baths</label>
              <input
                type="number"
                name="baths"
                placeholder="Number of baths"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.baths}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Size (sq.ft)</label>
              <input
                type="number"
                name="size"
                placeholder="Property size"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.size}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Market Rent</label>
              <input
                type="number"
                name="marketRent"
                placeholder="Monthly rent"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.marketRent}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Deposit</label>
              <input
                type="number"
                name="deposit"
                placeholder="Security deposit"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.deposit}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Parking</label>
              <select
                name="parking"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                defaultValue="Covered"
              >
                <option value="Covered">Covered</option>
                <option value="Uncovered">Uncovered</option>
                <option value="None">None</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Laundry</label>
              <select
                name="laundry"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                defaultValue="In-Unit"
              >
                <option value="In-Unit">In-Unit</option>
                <option value="Shared">Shared</option>
                <option value="None">None</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">AC Type</label>
              <select
                name="ac"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={handleChange}
                defaultValue="Central"
              >
                <option value="Central">Central</option>
                <option value="Window">Window</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Features, Photos, Attachments */}
      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Photos</h2>
          <div className="flex flex-col gap-4">
            <label className="group relative flex items-center justify-center gap-3 px-5 py-4 bg-white border-2 border-dashed border-blue-400 hover:border-blue-500 text-blue-600 font-medium rounded-xl cursor-pointer transition-colors duration-200">
              <Upload className="w-5 h-5" />
              <span>Upload Property Photos</span>
              <input
                type="file"
                name="photos"
                className="hidden"
                onChange={handleImgFileUpload}
                multiple={true}
                accept="image/*"
              />
            </label>
            
            {previewImg && previewImg.length > 0 && (
                
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {[previewImg[0]].map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => removeFile(index, true)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Features */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Features</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.feature.map((item, index) => (
              <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1.5 text-sm">
                {item}
                <button
                  onClick={() => removeItem('feature', index)}
                  className="hover:text-blue-600 p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          
          {showFeatureInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter feature"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd('feature')}
              />
              <button
                onClick={() => handleAdd('feature')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowFeatureInput(true)}
              className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <PlusCircle size={16} />
              Add Feature
            </button>
          )}
        </div>
        
        {/* Amenities */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.amenities.map((item, index) => (
              <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-1.5 text-sm">
                {item}
                <button
                  onClick={() => removeItem('amenities', index)}
                  className="hover:text-blue-600 p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          
          {showAmenityInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amenity"
                onKeyPress={(e) => e.key === 'Enter' && handleAdd('amenity')}
              />
              <button
                onClick={() => handleAdd('amenity')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAmenityInput(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <PlusCircle size={16} />
              Add Amenity
            </button>
          )}
        </div>
        
        {/* Document Upload */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-80">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Documents & Attachments</h2>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-6 transition-colors"
            >
              <div className="flex justify-center items-center w-14 h-14 bg-gray-50 text-gray-500 rounded-full mb-2">
                <span className="text-2xl font-bold">+</span>
              </div>
              <span className="text-gray-700 font-medium">Upload Documents</span>
              <span className="text-sm text-gray-500 mt-1">Store contracts, templates, and other files</span>
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
            
            {files.filter((file) => !file.type.startsWith("image/")).length > 0 && (
              <div className="mt-2">
                <h3 className="font-medium text-gray-700 mb-2">Uploaded Documents</h3>
                <div className="space-y-2">
                  {files.filter((file) => !file.type.startsWith("image/")).map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index, false)}
                        className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                        aria-label={`Remove ${file.name}`}
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
      </div>
      
      {/* Submit Button - Full Width */}
      <div className="col-span-1 lg:col-span-2 mt-4">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          Create Property
        </button>
      </div>
    </form>
  </div>
);
};

export default AddProperty;
