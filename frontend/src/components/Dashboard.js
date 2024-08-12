// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title } from 'chart.js';
import axios from 'axios';
import './Dashboard.css';  // Add your CSS file for styling

ChartJS.register(LineElement, CategoryScale, LinearScale, Title);

const Dashboard = () => {
    const [resolvedIP, setResolvedIP] = useState('');
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/history');
            const data = response.data;
            // Transform the data into the format needed for the chart
            const labels = data.map(record => record.timestamp);
            const values = data.map(record => record.response_time);  // Adjust based on your data structure

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'DNS Query Response Time',
                        data: values,
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false,
                    },
                ],
            });
        } catch (err) {
            setError('Error occurred while fetching data');
        }
    };

    const handleResolve = async (domain) => {
        try {
            const response = await axios.get(`http://localhost:5000/resolve/${domain}`);
            setResolvedIP(response.data.ip);
        } catch (err) {
            setError('Error occurred while resolving');
        }
    };

    return (
        <div className="dashboard">
            <h2>DNS Query Response Time</h2>
            <Line data={chartData} />
            <input 
                type="text" 
                placeholder="Enter domain"
                onChange={(e) => handleResolve(e.target.value)}
            />
            <button onClick={() => handleResolve(document.querySelector('input').value)}>Resolve</button>
            <p>Resolved IP: {resolvedIP}</p>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Dashboard;
