import React, { useEffect, useState } from "react";
import { calculateTimePercentage } from "../../services/calculateTimePercentage";
import ProgressCircle from "./ProgressCircle";

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [timePercentage, setTimePercentage] = useState(
    calculateTimePercentage(todo.startTime, todo.endTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePercentage(calculateTimePercentage(todo.startTime, todo.endTime));
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [todo.startTime, todo.endTime]);

  // const formatTime = (dateTime) => {
  //   return new Date(dateTime).toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  return (
    <div
      className={`flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
        todo.isImportant ? "border-yellow-400" : "border-transparent"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Checkbox completed */}
            <button
              onClick={() => onToggle(todo.id, "completed")}
              className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                todo.isCompleted
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 hover:border-blue-400"
              } transition-colors`}
            >
              {todo.isCompleted && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            {/* title todo */}
            <span
              className={`text-gray-800 ${
                todo.isCompleted ? "line-through text-gray-400" : ""
              } ${todo.isImportant ? "font-semibold" : ""}`}
            >
              {todo.title}
            </span>
          </div>
          {/* button group action */}
          <div className="flex space-x-2">
            {/* button important */}
            <button
              onClick={() => onToggle(todo.id, "important")}
              className={`p-2 rounded-full hover:bg-yellow-50 ${
                todo.isImportant ? "text-yellow-500" : "text-gray-400"
              }`}
              aria-label={
                todo.isImportant ? "Unmark important" : "Mark important"
              }
            >
              {todo.isImportant ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              )}
            </button>

            {/* button delete */}
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500"
              aria-label="Delete"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <div className="mr-4 mt-1">
              <ProgressCircle
                percentage={timePercentage}
                onClick={onEdit}
                todo={todo}
              />
            </div>
          </div>
          {/* Hiển thị thời gian
          <div className="mt-2 ml-8 text-xs text-gray-500 flex items-center justify-between gap-1">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
              🕒 {formatTime(todo.startTime)}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              🏁 {formatTime(todo.endTime)}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
