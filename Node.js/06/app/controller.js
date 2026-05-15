import * as model from './model.js';

const get = (id) => {
  const task = model.getTaskById(id);

  if (task) {
    return {
      status: 200,
      task,
    };
  }

  return {
    status: 404,
    message: 'Task not found',
  };
};

const add = (task) => {
  model.addTask(task);
};

const deleteTask = (id) => {
  if (model.deleteTaskById(id)) {
    return {
      status: 202,
      message: `Task ${id} deleted successfully`,
    };
  }

  return {
    status: 404,
    message: 'Task not found',
  };
};

const update = (id) => {
  if (!model.updateTaskById(id)) {
    return {
      status: 404,
      message: 'Task ',
    };
  }
};

const getAll = () => {
  return model.getAllTasks();
};

export {
  get,
  add,
  deleteTask, // 'delete' to słowo zastrzeżone
  update,
  getAll,
};
