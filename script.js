// Sayfa yüklendiğinde yapılacaklar yüklensin ve dinleyiciler ayarlansın
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  document.getElementById("todoInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo(); // Enter tuşu ile görev ekleme
  });
  document.getElementById("themeToggle").addEventListener("click", toggleTheme); // Tema geçişi
});

// Yeni görev ekleme fonksiyonu
function addTodo() {
  const input = document.getElementById('todoInput');
  const task = input.value.trim();

  if (task) {
    createTodo(task);
    input.value = '';
    saveTodos();
  }
  checkEmpty();
}

// Yeni görev oluşturma (li elemanı)
function createTodo(text, isCompleted = false) {
  const list = document.getElementById('todoList');

  const li = document.createElement('li');
  li.dataset.status = isCompleted ? 'completed' : 'active';
  if (isCompleted) li.classList.add('completed');

  li.textContent = text;

  // Göreve tıklandığında tamamlandı olarak işaretle
  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    li.dataset.status = li.classList.contains('completed') ? 'completed' : 'active';
    saveTodos();
    updateTaskCount();
  });

  // Silme butonu oluştur
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✖';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    saveTodos();
    updateTaskCount();
    checkEmpty();
  });

  li.appendChild(deleteBtn);
  list.appendChild(li);
  updateTaskCount();
  checkEmpty();
}

// Kalan görev sayısını güncelle
function updateTaskCount() {
  const total = document.querySelectorAll('#todoList li').length;
  const completed = document.querySelectorAll('#todoList li.completed').length;
  const remaining = total - completed;
  document.getElementById('taskCount').textContent = `${remaining} tasks remaining`;
}

// Görevleri localStorage'a kaydet
function saveTodos() {
  const todos = [];
  document.querySelectorAll('#todoList li').forEach(li => {
    const text = li.firstChild.textContent;
    const isCompleted = li.classList.contains('completed');
    todos.push({ text, isCompleted });
  });
  localStorage.setItem('todoApp', JSON.stringify(todos));
}

// Sayfa yüklendiğinde kayıtlı görevleri yükle
function loadTodos() {
  const saved = JSON.parse(localStorage.getItem('todoApp') || '[]');
  saved.forEach(todo => {
    createTodo(todo.text, todo.isCompleted);
  });
  checkEmpty();
}

// Filtreleme fonksiyonu (Tümü, Aktif, Tamamlanan)
function filterTodos(filter) {
  const items = document.querySelectorAll('#todoList li');
  items.forEach(item => {
    const isCompleted = item.classList.contains('completed');
    if (filter === 'all') item.style.display = '';
    else if (filter === 'active') item.style.display = isCompleted ? 'none' : '';
    else if (filter === 'completed') item.style.display = isCompleted ? '' : 'none';
  });
}

// Liste boşsa mesaj göster/gizle
function checkEmpty() {
  const list = document.getElementById('todoList');
  const msg = document.getElementById('emptyMessage');
  msg.classList.toggle('hidden', list.children.length > 0);
}

// Tema geçişini sağla ve kaydet
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Sayfa yüklendiğinde kaydedilen tema ayarını uygula
(function applyStoredTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
})();