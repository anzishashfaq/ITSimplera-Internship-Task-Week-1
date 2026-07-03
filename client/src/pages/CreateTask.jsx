import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTask } from '../services/taskService';
import Loader from '../components/Loader';

const initialState = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

const CreateTask = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createTask(form);
      toast.success('Task created successfully');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Failed to create task';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Create Task</h1>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span>Title</span>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label className="form-field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add more details about this task..."
          />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Priority</span>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="form-field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <label className="form-field">
            <span>Due Date</span>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader size="sm" /> : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
