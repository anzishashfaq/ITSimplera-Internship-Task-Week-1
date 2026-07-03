import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiList,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
  FiSearch,
  FiPlus,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import { getTasks, getStats, deleteTask } from '../services/taskService';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const { data } = await getStats();
      setStats(data.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const { data } = await getTasks({ search, status, priority, page, limit: 6 });
      setTasks(data.data);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, [search, status, priority, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const chartData = stats
    ? [
        { name: 'Pending', value: stats.pending },
        { name: 'In Progress', value: stats.inProgress },
        { name: 'Completed', value: stats.completed },
      ]
    : [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          <FiPlus /> New Task
        </Link>
      </div>

      {loadingStats ? (
        <Loader />
      ) : (
        <>
          <div className="cards-grid">
            <DashboardCard icon={<FiList />} label="Total Tasks" value={stats.total} accent="#6366f1" />
            <DashboardCard icon={<FiClock />} label="Pending" value={stats.pending} accent="#f59e0b" />
            <DashboardCard icon={<FiTrendingUp />} label="In Progress" value={stats.inProgress} accent="#3b82f6" />
            <DashboardCard icon={<FiCheckCircle />} label="Completed" value={stats.completed} accent="#10b981" />
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <h2>Task Status Overview</h2>
              {stats.total > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="empty-state">No data yet — create your first task!</p>
              )}
            </div>

            <div className="panel">
              <h2>Recent Activity</h2>
              {stats.recent.length === 0 ? (
                <p className="empty-state">No recent activity</p>
              ) : (
                <ul className="activity-list">
                  {stats.recent.map((t) => (
                    <li key={t._id}>
                      <span className="activity-title">{t.title}</span>
                      <span className="activity-meta">
                        {t.status} · {new Date(t.updatedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      <div className="panel">
        <div className="filters-row">
          <div className="search-box">
            <FiSearch />
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {loadingTasks ? (
          <Loader />
        ) : (
          <>
            <DataTable tasks={tasks} onDelete={handleDelete} />

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
