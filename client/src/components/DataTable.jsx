import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

const priorityClass = {
  Low: 'badge badge-low',
  Medium: 'badge badge-medium',
  High: 'badge badge-high',
};

const statusClass = {
  Pending: 'badge badge-pending',
  'In Progress': 'badge badge-progress',
  Completed: 'badge badge-completed',
};

const DataTable = ({ tasks, onDelete }) => {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return <p className="empty-state">No tasks found. Try adjusting your filters or create a new task.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th className="hide-mobile">Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th className="hide-mobile">Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td data-label="Title">{task.title}</td>
              <td className="hide-mobile" data-label="Description">
                {task.description ? task.description.slice(0, 60) : '—'}
              </td>
              <td data-label="Priority">
                <span className={priorityClass[task.priority]}>{task.priority}</span>
              </td>
              <td data-label="Status">
                <span className={statusClass[task.status]}>{task.status}</span>
              </td>
              <td className="hide-mobile" data-label="Due Date">
                <FiCalendar size={14} style={{ marginRight: 4 }} />
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td data-label="Actions">
                <div className="row-actions">
                  <button
                    className="icon-btn"
                    onClick={() => navigate(`/tasks/${task._id}/edit`)}
                    aria-label="Edit task"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    className="icon-btn icon-btn-danger"
                    onClick={() => onDelete(task._id)}
                    aria-label="Delete task"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
