import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ 
        total_tasks: 0, 
        completed_tasks: 0, 
        high_priority: 0, 
        completion_rate: 0 
    });
    
    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchTasks(token);
            fetchStats();
        }
    }, [navigate]);

    const fetchTasks = async (token) => {
        try {
            const res = await axios.get('https://leadmasters-assessment.onrender.com/api/tasks', {
                headers: { 'auth-token': token }
            });
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStats = async () => {
        try {
        //    const res = await axios.get('http://localhost:5001/api/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Error connecting to Python Service:", err);
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
            setTimeout(fetchStats, 500); 
        } catch (err) {
            console.error(err);
        }
    };

    // NEW: Mark as Completed Function
    const handleComplete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            // Update status to "Completed"
            await axios.put(`/api/tasks/${id}`, 
                { status: "Completed" },
                { headers: { 'auth-token': token } }
            );
            fetchTasks(token);
            setTimeout(fetchStats, 500); // Ask Python to recalculate
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/tasks/${id}`, {
                headers: { 'auth-token': token }
            });
            fetchTasks(token);
            setTimeout(fetchStats, 500);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No Date";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🚀 Project Dashboard</h1>
                    <p style={{ opacity: 0.9, marginTop: '5px' }}>Powered by MERN + Python 🐍</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            {/* Stats Section */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-number">{stats.total_tasks}</div>
                    <div className="stat-label">📂 Total Tasks</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.completion_rate}%</div>
                    <div className="stat-label">📈 Productivity</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.high_priority}</div>
                    <div className="stat-label">🔥 High Priority</div>
                </div>
            </div>

            {/* Form Section */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>✨ Create New Task</h3>
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input 
                            type="text" 
                            placeholder="Task Title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input 
                            type="date" 
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)} 
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <input 
                            type="text" 
                            placeholder="Description (Optional)" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '15px' }}>+ Add Task</button>
                </form>
            </div>

            {/* Task List */}
            <h3 style={{ color: 'white', marginBottom: '20px' }}>📌 Active Tasks</h3>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} style={{ 
                        borderLeft: `6px solid ${task.status === 'Completed' ? '#10b981' : task.priority === 'High' ? '#ef4444' : '#f59e0b'}`,
                        opacity: task.status === 'Completed' ? 0.7 : 1 
                    }}>
                        <div>
                            <div className="task-header" style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                                {task.title} 
                                <span style={{ fontSize: '0.8rem', marginLeft: '10px', opacity: 0.7 }}>
                                    (Due: {formatDate(task.dueDate)})
                                </span>
                            </div>
                            <div className="task-desc">{task.description}</div>
                        </div>
                        <div className="task-footer">
                            <span className={`priority-${task.priority.toLowerCase()}`}>
                                {task.status === 'Completed' ? '✅ DONE' : `${task.priority} Priority`}
                            </span>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {/* SHOW COMPLETE BUTTON ONLY IF NOT COMPLETED */}
                                {task.status !== 'Completed' && (
                                    <button 
                                        onClick={() => handleComplete(task._id)}
                                        style={{ background: '#10b981', padding: '8px 12px', fontSize: '0.8rem' }}
                                    >
                                        ✓ Done
                                    </button>
                                )}
                                <button className="danger-btn" onClick={() => handleDelete(task._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;