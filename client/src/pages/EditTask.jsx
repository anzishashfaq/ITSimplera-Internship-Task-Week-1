import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTask, updateTask } from '../services/taskService';
import Loader from '../components/Loader';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await getTask(id);
        const task = data.data;
        setForm({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        });
      } catch (error) {
        toast.error('Task not found');
        navigate('/dashboard');
      } finally {
        setFetching(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

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
      await updateTask(id, form);
      toast.success('Task updated successfully');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Failed to update task';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader fullPage />;
  if (!form) return null;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit Task</h1>
      </div>

      <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span>Title</span>
          <input name="title" value={form.title} onChange={handleChange} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label className="form-field">
          <span>Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
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
            {loading ? <Loader size="sm" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
