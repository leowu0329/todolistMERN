import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Input } from './ui/input';
import DeleteIcon from './icons/DeleteIcon';
import EditIcon from './icons/EditIcon';
import TickIcon from './icons/TickIcon';
import { CircleUserRound, Plus } from 'lucide-react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';

const fetcher = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const Todos = () => {
  const navigate = useNavigate();
  const [newTodo, setNewTodo] = useState('');

  const { data, error, isLoading, mutate } = useSWR(
    'http://localhost:3000/api/todos',
    fetcher,
    {
      onError: (error) => {
        if (error.message === 'Unauthorized') {
          navigate('/login');
        }
      },
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (error?.message === 'Unauthorized') {
      navigate('/login');
    }
  }, [error, navigate]);

  if (error) {
    return null;
  }

  if (isLoading) {
    return <h1 className="text-2xl py-2 text-center">Loading...</h1>;
  }

  const todos = Array.isArray(data?.todos) ? data.todos : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error('Todo cannot be empty');
      return;
    }

    const optimisticTodo = {
      _id: Date.now().toString(),
      title: newTodo,
      isCompleted: false,
    };

    try {
      await mutate(
        async () => {
          const response = await fetcher('http://localhost:3000/api/todos', {
            method: 'POST',
            body: { title: newTodo.trim() },
          });

          return {
            todos: [...todos, response.todo],
          };
        },
        {
          optimisticData: { todos: [...todos, optimisticTodo] },
          rollbackOnError: true,
          revalidate: false,
        },
      );

      setNewTodo('');
      toast.success('Todo added successfully!');
    } catch (error) {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to add todo');
      }
    }
  };

  const handleToggle = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      await mutate(
        async () => {
          const response = await fetcher(
            `http://localhost:3000/api/todos/${id}`,
            {
              method: 'PUT',
              body: { isCompleted: !todo.isCompleted },
            },
          );
          return {
            todos: todos.map((t) => (t._id === id ? response.todo : t)),
          };
        },
        {
          optimisticData: {
            todos: todos.map((t) =>
              t._id === id ? { ...t, isCompleted: !t.isCompleted } : t,
            ),
          },
          rollbackOnError: true,
          revalidate: false,
        },
      );
      toast.success('Todo updated successfully!');
    } catch (error) {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      } else {
        toast.error('Failed to update todo');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    try {
      await mutate(
        async () => {
          await fetcher(`http://localhost:3000/api/todos/${id}`, {
            method: 'DELETE',
          });
          return {
            todos: todos.filter((t) => t._id !== id),
          };
        },
        {
          optimisticData: {
            todos: todos.filter((t) => t._id !== id),
          },
          rollbackOnError: true,
          revalidate: false,
        },
      );
      toast.success('Todo deleted successfully!');
    } catch (error) {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      } else {
        toast.error('Failed to delete todo');
      }
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;

    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-lg px-4 w-full flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="hover:text-primary"
          title="Logout"
        >
          <CircleUserRound className="w-8 h-8" />
        </button>
      </div>
      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text">
        Todo List
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Enter a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          className="shadow-md"
        />
        <button
          type="submit"
          className="h-9 rounded-md border border-input bg-transparent px-4 text-base shadow-md hover:bg-primary hover:text-white transition-colors"
          title="Add todo"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <span
              className={`text-lg ${
                todo.isCompleted ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.title}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(todo._id)}
                className="p-1 hover:text-primary"
                title="Toggle completion"
              >
                <TickIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="p-1 hover:text-destructive"
                title="Delete todo"
              >
                <DeleteIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
