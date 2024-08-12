import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title } from 'chart.js';
import axios from 'axios';
import './App.css'; // Import the CSS file

ChartJS.register(LineElement, CategoryScale, LinearScale, Title);

const Dashboard = () => {
    const [resolvedIP, setResolvedIP] = useState('');
    const [responseTimes, setResponseTimes] = useState([]);
    const [error, setError] = useState('');
    const [domain, setDomain] = useState('');

    const handleResolve = async () => {
        if (!domain) return;
        try {
            const response = await axios.get(`http://localhost:5000/resolve/${domain}`);
            setResolvedIP(response.data.ip);
            fetchResponseTimes();
        } catch (err) {
            setError('Error occurred while resolving');
        }
    };

    const fetchResponseTimes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-response-times');
            setResponseTimes(response.data);
        } catch (err) {
            setError('Error fetching response times');
        }
    };

    const data = {
        labels: responseTimes.map(rt => new Date(rt.timestamp).toLocaleString()),
        datasets: [
            {
                label: 'DNS Query Response Time (seconds)',
                data: responseTimes.map(rt => rt.time),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <h2>DNS Query Response Time</h2>
            <div className="input-container">
                <input 
                    type="text" 
                    placeholder="Enter domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                />
                <button onClick={handleResolve}>Resolve</button>
            </div>
            <Line data={data} />
            <p className="resolved-ip">Resolved IP: {resolvedIP}</p>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Dashboard;
