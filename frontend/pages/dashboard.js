// frontend/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import io from 'socket.io-client';
import axios from 'axios';

// Connect to your backend WebSocket server
const socket = io('http://localhost:5000'); // Replace with your backend URL

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [realTimeData, setRealTimeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const recordsPerPage = 50;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch initial data from the backend
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            try {
                const response = await axios.get('http://localhost:5000/api/data', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(response.data); // Set the fetched data to state
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchData();

        // WebSocket setup
        socket.on('connect', () => console.log('Connected to WebSocket'));
        socket.on('data', (newData) => {
            setRealTimeData((prevData) => [...prevData, newData]);
        });

        return () => {
            socket.off('data');
            socket.disconnect();
        };
    }, []);

    // Prepare chart data from fetched data
    const chartData = {
        labels: data.map((record) => record.Date), // Assuming 'Date' is a field in your data
        datasets: [
            {
                label: 'Close Prices', // Change label as needed
                data: data.map((record) => record.Close), // Assuming 'Close' is a field in your data
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

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            {data.length > 0 ? (
                <Line data={chartData} />
            ) : (
                <div>No data available for chart</div>
            )}
            <div>
                {currentRecords.length > 0 ? (
                    currentRecords.map((record, index) => (
                        <div key={index}>
                            <p>{record.someField}</p> {/* Replace 'someField' with actual field name */}
                        </div>
                    ))
                ) : (
                    <div>No records available for pagination</div>
                )}
            </div>
            <div>
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
