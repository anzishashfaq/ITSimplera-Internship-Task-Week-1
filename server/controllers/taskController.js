const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user (search, filter, paginate)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, page = 1, limit = 8, sort = '-createdAt' } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.$text = { $search: search };
  }
  if (status) {
    query.status = status;
  }
  if (priority) {
    query.priority = priority;
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 8, 1);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sort).skip(skip).limit(limitNum),
    Task.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    priority,
    status,
    dueDate,
  });

  res.status(201).json({ success: true, data: task });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { title, description, priority, status, dueDate } = req.body;

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.priority = priority ?? task.priority;
  task.status = status ?? task.status;
  task.dueDate = dueDate ?? task.dueDate;

  task = await task.save();

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Dashboard statistics + recent activity
// @route   GET /api/tasks/stats/summary
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [total, pending, inProgress, completed, highPriority, recent] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: 'Pending' }),
    Task.countDocuments({ user: userId, status: 'In Progress' }),
    Task.countDocuments({ user: userId, status: 'Completed' }),
    Task.countDocuments({ user: userId, priority: 'High' }),
    Task.find({ user: userId }).sort('-updatedAt').limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      pending,
      inProgress,
      completed,
      highPriority,
      recent,
    },
  });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats };
