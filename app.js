const defaultSessions = [
  { id: 1, title: 'Revisar fundamentos de Git', minutes: 25, completed: false },
  { id: 2, title: 'Ler sobre pipelines CI/CD', minutes: 20, completed: false },
  { id: 3, title: 'Escrever uma nota de aprendizado', minutes: 15, completed: false }
];

const state = {
  sessions: loadSessions(),
  selectedId: null
};

const elements = {
  date: document.querySelector('#current-date'),
  list: document.querySelector('#session-list'),
  empty: document.querySelector('#empty-state'),
  nextTask: document.querySelector('#next-task'),
  completeNext: document.querySelector('#complete-next'),
  minutes: document.querySelector('#minutes-complete'),
  percent: document.querySelector('#progress-percent'),
  progressBar: document.querySelector('#progress-bar'),
  progressMessage: document.querySelector('#progress-message'),
  streak: document.querySelector('#streak-count'),
  addSession: document.querySelector('#add-session')
};

function loadSessions() {
  try {
    const saved = localStorage.getItem('study-garden-sessions');
    return saved ? JSON.parse(saved) : defaultSessions;
  } catch {
    return defaultSessions;
  }
}

function saveSessions() {
  localStorage.setItem('study-garden-sessions', JSON.stringify(state.sessions));
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

function getSelectedSession() {
  return state.sessions.find((session) => session.id === state.selectedId);
}

function render() {
  const completedMinutes = state.sessions.filter((session) => session.completed).reduce((total, session) => total + session.minutes, 0);
  const progress = Math.min(100, Math.round((completedMinutes / 60) * 100));
  const selected = getSelectedSession();
  const nextSession = state.sessions.find((session) => !session.completed);

  elements.date.textContent = formatDate();
  elements.minutes.textContent = completedMinutes;
  elements.percent.textContent = `${progress}%`;
  elements.progressBar.style.width = `${progress}%`;
  elements.progressMessage.textContent = progress >= 100 ? 'Meta cumprida. O jardim está florescendo.' : `${60 - completedMinutes} min até completar a meta de hoje.`;
  elements.streak.textContent = state.sessions.some((session) => session.completed) ? '1' : '0';
  elements.nextTask.textContent = selected ? selected.title : nextSession ? nextSession.title : 'Tudo concluído por hoje';
  elements.completeNext.disabled = !selected && !nextSession;
  elements.list.innerHTML = state.sessions.map(sessionTemplate).join('');
  elements.empty.hidden = state.sessions.length > 0;
}

function sessionTemplate(session, index) {
  return `<article class="session-item${session.completed ? ' is-complete' : ''}" data-session-id="${session.id}">
    <span class="session-index">0${index + 1}</span>
    <div><p class="session-name">${escapeHtml(session.title)}</p><p class="session-meta">${session.minutes} min de foco</p></div>
    <button class="session-action" type="button" data-action="toggle">${session.completed ? 'Refazer' : 'Concluir'}</button>
  </article>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

elements.list.addEventListener('click', (event) => {
  const item = event.target.closest('[data-session-id]');
  if (!item) return;
  const id = Number(item.dataset.sessionId);
  if (event.target.dataset.action === 'toggle') {
    const session = state.sessions.find((entry) => entry.id === id);
    session.completed = !session.completed;
    saveSessions();
  } else {
    state.selectedId = id;
  }
  render();
});

elements.completeNext.addEventListener('click', () => {
  const session = getSelectedSession() || state.sessions.find((entry) => !entry.completed);
  if (session) {
    session.completed = true;
    state.selectedId = null;
    saveSessions();
    render();
  }
});

elements.addSession.addEventListener('click', () => {
  const title = window.prompt('Qual será o próximo foco?');
  if (!title?.trim()) return;
  const minutes = Number(window.prompt('Quantos minutos?', '20')) || 20;
  state.sessions.push({ id: Date.now(), title: title.trim(), minutes: Math.max(5, minutes), completed: false });
  saveSessions();
  render();
});

render();