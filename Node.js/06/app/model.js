const tasks = [
  { id: 1, title: 'zadanie 1', description: 'łatwe', completed: false },
  { id: 2, title: 'zadanie 2', description: 'średnie', completed: true },
  { id: 3, title: 'zadanie 3', description: 'trudne', completed: false },
];

export function getAllTasks() {
  return tasks;
}

export function getTaskById(id) {
  return tasks.find((t) => t.id === id);
}

export function addTask(task) {
  tasks.push(task);
}

export function updateTaskById(id, task) {
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return false;

  tasks[index] = task;
  return true;
}

export function deleteTaskById(id) {
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
