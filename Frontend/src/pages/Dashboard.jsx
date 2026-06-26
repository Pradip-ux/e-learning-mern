import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaExternalLinkAlt } from "react-icons/fa";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Users</h3>
          <p className="text-xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Courses</h3>
          <p className="text-xl font-bold">{stats.totalCourses}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Revenue</h3>
          <p className="text-xl font-bold">₹{stats.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;