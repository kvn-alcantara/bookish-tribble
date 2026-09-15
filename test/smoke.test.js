const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');

test('a página contém os pontos principais do painel', () => {
  for (const selector of ['#session-list', '#progress-bar', '#complete-next', '#add-session']) {
    assert.match(html, new RegExp(selector.replace('#', 'id="')));
  }
});

test('o painel persiste sessões e calcula o progresso', () => {
  assert.match(app, /localStorage\.getItem/);
  assert.match(app, /localStorage\.setItem/);
  assert.match(app, /completedMinutes/);
  assert.match(app, /Math\.min\(100/);
});

test('títulos novos são escapados antes de entrar no HTML', () => {
  assert.match(app, /function escapeHtml/);
  assert.match(app, /escapeHtml\(session\.title\)/);
});