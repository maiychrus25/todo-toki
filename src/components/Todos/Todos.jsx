import React, { useCallback, useEffect, useReducer, useState } from "react";
import TodoItem from "./TodoItem";
import TimeEditModal from "./TimeEditModal";

const ACTION_TYPES = {
  CREATE: "CREATE",
  DELETE: "DELETE",
  TOGGLE_COMPLETED: "TOGGLE_COMPLETED",
  TOGGLE_IMPORTANT: "TOGGLE_IMPORTANT",
  UPDATE: "UPDATE",
};

const initTodos = JSON.parse(localStorage.getItem("todos")) || [
  {
    id: 1,
    title: "Learn Piano",
    isCompleted: false,
    isImportant: true,
    isDeleted: false,
    startTime: "2025-04-22T09:00",
    endTime: "2025-04-26T09:00",
  },
];

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.CREATE:
      return [...state, action.payload.todo];
    case ACTION_TYPES.DELETE:
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, isDeleted: true } : todo
      );
    case ACTION_TYPES.TOGGLE_COMPLETED:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      );
    case ACTION_TYPES.TOGGLE_IMPORTANT:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, isImportant: !todo.isImportant }
          : todo
      );
    case ACTION_TYPES.UPDATE:
      return state.map((todo) =>
        todo.id === action.payload.todo.id ? action.payload.todo : todo
      );
    default:
      return state;
  }
};

const Todos = () => {
  const [todos, dispatch] = useReducer(reducer, initTodos);
  const [tempTitle, setTempTitle] = useState("");
  const [modalTodo, setModalTodo] = useState(null); // todo đang chỉnh sửa (hoặc thêm)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // phân biệt đang add hay edit

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleToggle = useCallback((id, field) => {
    dispatch({
      type: `TOGGLE_${field.toUpperCase()}`,
      payload: { id },
    });
  }, []);

  const handleDelete = useCallback((id) => {
    dispatch({
      type: ACTION_TYPES.DELETE,
      payload: { id },
    });
  }, []);

  const handleAddNewTodo = (event) => {
    if (event.code === "Enter") {
      const title = event.target.value.trim();
      if (title) {
        setTempTitle(title);
        setModalTodo({
          startTime: new Date().toISOString().slice(0, 16),
          endTime: new Date().toISOString().slice(0, 16),
        });
        setIsModalOpen(true);
        setIsEditing(false);
        event.target.value = "";
      } else {
        alert("Please enter the task details.");
        return;
      }
    }
  };

  const handleSaveTodo = (timeData) => {
    if (isEditing && modalTodo?.id) {
      dispatch({
        type: ACTION_TYPES.UPDATE,
        payload: {
          todo: {
            ...modalTodo,
            ...timeData,
          },
        },
      });
    } else {
      dispatch({
        type: ACTION_TYPES.CREATE,
        payload: {
          todo: {
            id: crypto.randomUUID(),
            title: tempTitle,
            isCompleted: false,
            isImportant: false,
            isDeleted: false,
            startTime: timeData.startTime,
            endTime: timeData.endTime,
          },
        },
      });
    }

    setIsModalOpen(false);
    setModalTodo(null);
    setTempTitle("");
  };

  const handleEditClick = (todo) => {
    setModalTodo(todo);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen shadow-md">
      <header className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
          Todo App
        </h1>
        <p className="text-gray-500 mb-1">
          Get things done, one task at a time
        </p>
        <div className="relative mb-6">
          <input
            type="text"
            onKeyDown={handleAddNewTodo}
            placeholder="What needs to be done?"
            className="w-full p-4 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </span>
        </div>
      </header>

      <div className="mb-6">
        {todos.filter((todo) => !todo.isDeleted).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No tasks yet. Add one above!</p>
          </div>
        ) : (
          todos
            .filter((todo) => !todo.isDeleted)
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={() => handleEditClick(todo)}
              />
            ))
        )}
      </div>

      <footer className="pt-4 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex justify-between mb-1">
          <span>
            Total:{" "}
            <strong>{todos.filter((todo) => !todo.isDeleted).length}</strong>
          </span>
          <span>
            Deleted: <strong>{todos.filter((t) => t.isDeleted).length}</strong>
          </span>
        </div>
        <div className="flex justify-between">
          <span>
            Important:{" "}
            <strong>
              {
                todos.filter((todo) => !todo.isDeleted && todo.isImportant)
                  .length
              }
            </strong>
          </span>
          <span>
            Completed:{" "}
            <strong>
              {todos.filter((t) => t.isCompleted && !t.isDeleted).length}
            </strong>
          </span>
        </div>
      </footer>

      {/* Modal dùng chung cho cả add & edit */}
      {modalTodo && (
        <TimeEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          todo={modalTodo}
          onSave={handleSaveTodo}
        />
      )}
    </div>
  );
};

export default Todos;
