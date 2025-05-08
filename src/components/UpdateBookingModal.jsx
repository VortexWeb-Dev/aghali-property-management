import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, AlertCircle } from "lucide-react";

const UpdateBookingModal = ({
  isOpen,
  onClose,
  singleBooking,
  onBookingUpdated,
}) => {
  const [booking, setBooking] = useState(
    // {
    // title: "",
    // notes: "",
    // bookingType: "",
    // bookingStatus: "",
    // availableFrom: "",
    // start_date: "",
    // end_date: ""
    singleBooking
    // }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  //   useEffect(() => {
  //     if (isOpen && bookingId) {
  //       fetchBookingDetails();
  //     }
  //   }, [isOpen, bookingId]);

  //   const fetchBookingDetails = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `https://vortexwebpropertymanagement.com/api/bookings/${bookingId}`
  //       );
  //       setBooking(response.data);
  //     } catch (err) {
  //       setError("Failed to fetch booking details");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  useEffect(() => {
    // console.log(booking)
    console.log(singleBooking);
  }, [singleBooking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.patch(
        `https://vortexwebpropertymanagement.com/api/bookings/${booking.id}`,
        booking
      );
      setSuccess(true);
      if (onBookingUpdated) {
        onBookingUpdated();
      }
      // Close modal after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError("Failed to update booking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl border border-blue-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Booking</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {loading && !error && (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <p className="text-green-500">Booking updated successfully!</p>
          </div>
        )}

        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={
                    booking.start_date
                      ? booking.start_date.substring(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={
                    booking.end_date ? booking.end_date.substring(0, 10) : ""
                  }
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={booking.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 mr-4 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateBookingModal;
