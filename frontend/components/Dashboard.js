// frontend/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import io from 'socket.io-client';
import axios from 'axios';
import styles from '../styles/styles.module.css';

// Connect to your backend WebSocket server
const socket = io('http://localhost:5000'); // Replace with your backend URL

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(50);
    const [realTimeData, setRealTimeData] = useState([]);

    useEffect(() => {
        socket.on('connect', () => console.log('Connected to WebSocket'));

        // Listen for incoming data
        socket.on('data', (newData) => {
            setRealTimeData((prevData) => [...prevData, newData]); // Update with real-time data
        });

        return () => {
            socket.off('data'); // Clean up the listener on component unmount
            socket.disconnect(); // Disconnect from the socket when component unmounts
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/data', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(response.data); // Store the fetched data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Prepare chart data
    const chartData = {
        labels: realTimeData.map((_, index) => index + 1), // X-axis labels (e.g., data point index)
        datasets: [
            {
                label: 'Real-Time Data',
                data: realTimeData,
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(data.length / recordsPerPage);

    return (
        <div className={styles.container}>
            <h2>Dashboard</h2>
            <Line data={chartData} />
            <div>
                {currentRecords.map((record, index) => (
                    <div key={index} className={styles.record}>
                        {/* Display your data here, adjust according to your data structure */}
                        <p>{record.someField}</p> {/* Replace 'someField' with actual field name */}
                    </div>
                ))}
            </div>
            <div className={styles.pagination}>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
