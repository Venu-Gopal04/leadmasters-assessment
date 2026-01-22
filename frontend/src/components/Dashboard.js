import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Dashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");

    // Statistics (Static for now)
    const [stats, setStats] = useState({ 
        total_tasks: 0, 
        productivity_score: 0, 
        high_priority_pending: 0 
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            fetchTasks(token);
        }
    }, [navigate]);

    const fetchTasks = async (token) => {
        try {
            const res = await axios.get('https://leadmasters-assessment.onrender.com/api/tasks', {
                headers: { 'auth-token': token }
            });
            setTasks(res.data);
            
            // Simple logic to update stats without Python
            setStats({
                total_tasks: res.data.length,
                productivity_score: 0,
                high_priority_pending: res.data.filter(t => t.priority === "High").length
            });

        } catch (err) {
            console.error(err);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://leadmasters-assessment.onrender.com/api/tasks', 
                { title, description, priority, dueDate },
                { headers: { 'auth-token': token } }
            );
            setTitle("");
            setDescription("");
            setPriority("Medium");
            setDueDate("");
            
            fetchTasks(token);
            
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo-section">
                    <h1>🚀 Project Dashboard</h1>
                    <p className="subtitle">Powered by MERN Stack</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.total_tasks}</h3>
                    <p>📂 Total Tasks</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.productivity_score}%</h3>
                    <p>📈 Productivity</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.high_priority_pending}</h3>
                    <p>🔥 High Priority</p>
                </div>
            </div>

            <div className="main-content">
                <div className="task-form-card">
                    <h3>✨ Create New Task</h3>
                    <form onSubmit={handleAddTask}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                placeholder="Task Title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-row">
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="Low">Low Priority</option>
                            </select>
                            <input 
                                type="date" 
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <textarea 
                            placeholder="Description (Optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <button type="submit" className="add-task-btn">+ Add Task</button>
                    </form>
                </div>

                <div className="tasks-list-section">
                    <h3>📌 Active Tasks</h3>
                    <div className="tasks-grid">
                        {tasks.map(task => (
                            <div key={task._id} className={`task-card ${task.priority.toLowerCase()}`}>
                                <div className="task-header">
                                    <h4>{task.title}</h4>
                                    <span className={`badge ${task.priority}`}>{task.priority}</span>
                                </div>
                                <p>{task.description}</p>
                                <small>📅 Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;