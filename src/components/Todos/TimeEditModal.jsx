import React, { useState, useEffect } from "react";

const TimeEditModal = ({ isOpen, onClose, todo, onSave }) => {
  const [editData, setEditData] = useState({
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (todo) {
      setEditData({
        startTime: todo.startTime || "",
        endTime: todo.endTime || "",
      });
    }
  }, [todo]);

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Set Task Time</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={editData.startTime}
              onChange={(e) =>
                setEditData({ ...editData, startTime: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="datetime-local"
              value={editData.endTime}
              onChange={(e) =>
                setEditData({ ...editData, endTime: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeEditModal;
