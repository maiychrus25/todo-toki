import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import TodoItem from "./TodoItem";
import TimeEditModal from "./TimeEditModal";

const ACTION_TYPES = {
  CREATE: "CREATE",
  DELETE: "DELETE",
  TOGGLE_COMPLETED: "TOGGLE_COMPLETED",
  TOGGLE_IMPORTANT: "TOGGLE_IMPORTANT",
  UPDATE: "UPDATE",
};

const initTodos = JSON.parse(localStorage.getItem("todos")) || [];

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
  const [modalTodo, setModalTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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

  const handleAddNewTodo = (event, action = "") => {
    if (event.code === "Enter" || action === "ADD-TODO") {
      const title = inputRef.current.value.trim();
      if (title) {
        setTempTitle(title);
        setModalTodo({
          startTime: new Date().toISOString().slice(0, 16),
          endTime: new Date().toISOString().slice(0, 16),
        });
        setIsModalOpen(true);
        setIsEditing(false);
        inputRef.current.value = "";
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

  const activeTodos = todos.filter((todo) => !todo.isDeleted);
  const deletedCount = todos.length - activeTodos.length;
  const importantCount = activeTodos.filter((todo) => todo.isImportant).length;
  const completedCount = activeTodos.filter((todo) => todo.isCompleted).length;

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen shadow-md">
      <header className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
          Todo App
        </h1>
        <p className="text-gray-500 mb-6">
          Get things done, one task at a time
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <input
              type="text"
              ref={inputRef}
              onKeyDown={handleAddNewTodo}
              placeholder="What needs to be done?"
              className="w-full p-4 pl-12 pr-16 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
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

          <button
            onClick={(event) => handleAddNewTodo(event, "ADD-TODO")}
            className="relative inline-block px-6 py-4 overflow-hidden font-medium text-white uppercase tracking-wider text-sm transition-all duration-300 rounded-xl group"
          >
            <span className="relative z-10">Add</span>
            <span className="absolute inset-0 bg-cyan-500 rounded-xl z-0"></span>
            <span className="absolute inset-0 w-0 bg-cyan-600 rounded-xl transition-all duration-300 group-hover:w-full z-0"></span>
          </button>
        </div>
      </header>

      <div className="mb-6">
        {isLoading ? (
          // Hiển thị skeleton loading trong 3 giây
          Array(5)
            .fill()
            .map((_, index) => <TodoItem key={`skeleton-${index}`} isLoading />)
        ) : activeTodos.length === 0 ? (
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
          activeTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={() => handleEditClick(todo)}
              isLoading={isLoading}
            />
          ))
        )}
      </div>

      <footer className="pt-4 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex justify-between mb-1">
          <span>
            Total: <strong>{activeTodos.length}</strong>
          </span>
          <span>
            Deleted: <strong>{deletedCount}</strong>
          </span>
        </div>
        <div className="flex justify-between">
          <span>
            Important: <strong>{importantCount}</strong>
          </span>
          <span>
            Completed: <strong>{completedCount}</strong>
          </span>
        </div>
      </footer>

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
