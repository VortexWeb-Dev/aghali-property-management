import React from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

const DeleteEntity = ({ entityName, entityId }) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://vortexwebpropertymanagement.com/api/${entityName}/${entityId}`
      );
      if (response.status === 200) {
        navigate(`/${entityName}`);
        toast.success(
          entityName[0].toUpperCase() +
            entityName.slice(1, entityName.length - 1) +
            " deleted successfully!"
        );
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error deleting property");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="h-5 p-4 text-red-500 hover:h-6 hover:text-red-700 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 flex justify-center items-center"
    >
      <Trash2 className="w-6 h-6" />
    </button>
  );
};

export default DeleteEntity;
