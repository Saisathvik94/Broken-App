"use client"

import { useEffect, useState } from 'react'
import { PlusCircle, Trash2, CheckCircle, Circle } from 'lucide-react'

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) as Task[] : [];
  });
  const [newTask, setNewTask] = useState('')
  const [completedTask, setCompletedTask] = useState<Task | null>(null);

  useEffect(()=>{
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },[tasks])
  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }])
      setNewTask('')
    }
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    setCompletedTask(task);
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
      setCompletedTask(null);
    }, 5000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-teal-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-purple-600">Task Tracker</h1>
          <div className="flex mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={e=>{
                if(e.key=='Enter'){
                  addTask()
                }
              }}
              placeholder="Add a new task..."
              className="flex-grow px-4 py-2 text-purple-900 bg-purple-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type='button'
              onClick={addTask}
              aria-label="Add task"
              className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
          </div>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center bg-teal-50 rounded-lg p-3 shadow-sm">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mr-2 focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <p className='text-black flex-1 px-2'>{task.text}</p>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300 focus:outline-none"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
            {completedTask && (
              <div className="fixed inset-0 flex items-center justify-center flex-col backdrop-blur-sm bg-black/30 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
                    🎉 Congrats! {completedTask.text} completed! 🎉
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
      <footer className="mt-auto py-4 text-center text-sm text-purple-600">
        <p>Yay you have fixed the broken code</p>
        <p>Go ahead and push a pr</p>
      </footer>
    </div>
  )
}