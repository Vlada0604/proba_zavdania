// Основний JS для TaskFlow

// --- Робота з локальним сховищем ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- Відображення завдань ---
function renderTasks() {
  const todayTasksEl = document.getElementById('today-tasks');
  const taskListEl = document.getElementById('task-list');
  const remindersEl = document.getElementById('reminders');

  if(todayTasksEl) todayTasksEl.innerHTML = '';
  if(taskListEl) taskListEl.innerHTML = '';
  if(remindersEl) remindersEl.innerHTML = '';

  const now = new Date();

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = `${task.title} - ${task.datetime ? new Date(task.datetime).toLocaleString() : ''}`;

    if(todayTasksEl && new Date(task.datetime).toDateString() === now.toDateString()) {
      todayTasksEl.appendChild(li);
    }

    if(taskListEl) taskListEl.appendChild(li);

    if(remindersEl && task.datetime && new Date(task.datetime) <= now) {
      remindersEl.appendChild(li.cloneNode(true));
      notify(task.title);
    }
  });
}

// --- Додавання нового завдання ---
function addTask(title, desc, datetime, priority) {
  tasks.push({title, desc, datetime, priority});
  saveTasks();
  renderTasks();
}

// --- Модальні вікна ---
function setupModal(modalId, btnId, saveBtnId, titleId, descId, datetimeId, priorityId) {
  const modal = document.getElementById(modalId);
  const btn = document.getElementById(btnId);
  const span = modal.querySelector('.close');
  const saveBtn = document.getElementById(saveBtnId);

  btn.onclick = () => modal.style.display = 'flex';
  span.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if(e.target == modal) modal.style.display='none'; }

  saveBtn.onclick = () => {
    const title = document.getElementById(titleId).value;
    const desc = document.getElementById(descId).value;
    const datetime = document.getElementById(datetimeId).value;
    const priority = document.getElementById(priorityId).value;
    if(title) addTask(title, desc, datetime, priority);
    modal.style.display = 'none';
  }
}

// --- Повідомлення ---
function notify(msg) {
  if(Notification.permission === 'granted') {
    new Notification("TaskFlow", { body: msg });
  }
}

// --- Налаштування ---
const enableNotifications = document.getElementById('enable-notifications');
if(enableNotifications) {
  enableNotifications.onchange = () => {
    if(enableNotifications.checked) Notification.requestPermission();
  }
}

const clearTasksBtn = document.getElementById('clear-tasks');
if(clearTasksBtn) clearTasksBtn.onclick = () => { tasks=[]; saveTasks(); renderTasks(); }

// --- Ініціалізація ---
renderTasks();
setupModal('task-modal','add-task-btn','save-task','task-title','task-desc','task-datetime','task-priority');
setupModal('task-modal-2','add-task-btn-2','save-task-2','task-title-2','task-desc-2','task-datetime-2','task-priority-2');
