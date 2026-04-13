// ── Nav items registry ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '#/claude-code',        icon: '🤖', title: 'Manual Claude Code',  cat: 'IA',           desc: 'Domine o CLI de IA mais poderoso da atualidade' },
  { href: '#/devops/docker',      icon: '🐳', title: 'Docker Básico',        cat: 'DevOps',       desc: 'Containers, imagens, volumes e redes' },
  { href: '#/devops/ubuntu',      icon: '🐧', title: 'Guia Ubuntu/Linux',    cat: 'DevOps',       desc: 'Comandos essenciais e administração do sistema' },
  { href: '#/devops/nginx',       icon: '🌐', title: 'Manual do Nginx',      cat: 'DevOps',       desc: 'Proxy reverso, SSL e otimizações' },
  { href: '#/devops/vps-deploy',  icon: '🚀', title: 'Deploy & SSL na VPS',  cat: 'DevOps',       desc: 'Deploy seguro com HTTPS e CI/CD' },
  { href: '#/ferramentas/git',    icon: '🐙', title: 'Git & GitHub',          cat: 'Ferramentas',  desc: 'Versionamento, branches e pull requests' },
  { href: '#/fullstack/roadmap',  icon: '🗺️', title: 'Roadmap 2026',         cat: 'Full Stack',   desc: 'Trilha de aprendizado para devs full stack' },
  { href: '#/fullstack/springboot',icon: '☕', title: 'Java Spring Boot',     cat: 'Full Stack',   desc: 'APIs REST com Spring Boot e JPA' },
  { href: '#/fullstack/angular',                  icon: '🅰️', title: 'Angular',               cat: 'Full Stack',      desc: 'Framework frontend da Google para SPAs corporativas' },
  { href: '#/versionamento/01-git',               icon: '🌿', title: 'Git',                   cat: 'Versionamento',   desc: 'Controle de versão distribuído do zero ao avançado' },
  { href: '#/versionamento/02-github',            icon: '🐱', title: 'GitHub',                cat: 'Versionamento',   desc: 'Plataforma de colaboração, PRs, Issues e Releases' },
  { href: '#/versionamento/03-github-actions',    icon: '⚙️', title: 'GitHub Actions',        cat: 'Versionamento',   desc: 'Automação de CI/CD nativa do GitHub' },
  { href: '#/versionamento/04-fluxos-profissionais', icon: '🔄', title: 'Fluxos Profissionais', cat: 'Versionamento', desc: 'Git Flow, GitHub Flow, Conventional Commits e SemVer' },
  { href: '#/versionamento/05-ci-cd-angular',     icon: '🅰️', title: 'CI/CD Angular',         cat: 'Versionamento',   desc: 'Pipeline completa de build, teste e deploy para Angular' },
  { href: '#/versionamento/06-ci-cd-spring-boot', icon: '☕', title: 'CI/CD Spring Boot',     cat: 'Versionamento',   desc: 'Pipeline com Maven, Docker e deploy zero downtime' },
];

// ── DOM refs ───────────────────────────────────────────────────────────────
const contentArea  = document.getElementById('content-area');
const searchInput  = document.getElementById('search-input');
const searchDrop   = document.getElementById('search-dropdown');
const progressBar  = document.getElementById('progress');
const btt          = document.getElementById('btt');
const sidebar      = document.getElementById('sidebar');
const overlay      = document.getElementById('overlay');

// ── Sidebar toggle (mobile) ────────────────────────────────────────────────
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

// ── Section collapse ───────────────────────────────────────────────────────
function toggleSection(header) {
  header.classList.toggle('collapsed');
  const links = header.nextElementSibling;
  links.classList.toggle('hidden');
}

// ── Active link ────────────────────────────────────────────────────────────
function setActiveLink(hash) {
  document.querySelectorAll('.nav-link').forEach(a => {
    const linkHash = a.getAttribute('href');
    a.classList.toggle('active', linkHash === hash);
  });
}

// ── Breadcrumb builder ─────────────────────────────────────────────────────
function buildBreadcrumb(hash) {
  const item = NAV_ITEMS.find(n => n.href === hash);
  if (!item) return '';
  return `
    <nav class="breadcrumb">
      <a href="#/">Início</a>
      <span class="bc-sep">›</span>
      <span>${item.cat}</span>
      <span class="bc-sep">›</span>
      <span>${item.title}</span>
    </nav>`;
}

// ── Welcome page ───────────────────────────────────────────────────────────
function renderWelcome() {
  const cats = [...new Set(NAV_ITEMS.map(n => n.cat))];

  const sections = cats.map(cat => {
    const items = NAV_ITEMS.filter(n => n.cat === cat);
    const cards = items.map(n => `
      <a href="${n.href}" class="topic-card">
        <div class="card-ico">${n.icon}</div>
        <div class="card-cat">${n.cat}</div>
        <div class="card-name">${n.title}</div>
        <div class="card-desc">${n.desc}</div>
      </a>`).join('');
    return `
      <div class="grid-label">${cat}</div>
      <div class="cards-grid">${cards}</div>`;
  }).join('');

  contentArea.innerHTML = `
    <div class="welcome">
      <div class="welcome-hero">
        <div class="welcome-badge">✦ Manual do Iniciante — v1.0.0</div>
        <h1>Sua base de conhecimento<br>de desenvolvimento</h1>
        <p>Guias práticos sobre IA, DevOps, ferramentas e desenvolvimento full stack.</p>
        <a href="#/claude-code" class="cta-btn">Começar com Claude Code →</a>
      </div>
      ${sections}
    </div>`;
}

// ── Page loader ────────────────────────────────────────────────────────────
async function loadPage() {
  let hash = window.location.hash || '#/';
  const route = hash.replace(/^#/, '') || '/';

  setActiveLink(hash);
  closeSidebar();

  // Welcome
  if (route === '/' || route === '') {
    renderWelcome();
    window.scrollTo(0, 0);
    return;
  }

  // Loading state
  contentArea.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Carregando…</span>
    </div>`;

  const path = route.replace(/^\//, '');
  const base = 'pages/' + path;

  // Progress: start
  progressBar.style.transform = 'scaleX(0.3)';

  try {
    // Try markdown first
    let res = await fetch(base + '.md');
    progressBar.style.transform = 'scaleX(0.7)';

    if (res.ok) {
      const text = await res.text();
      progressBar.style.transform = 'scaleX(1)';
      contentArea.innerHTML = `
        <div class="page-wrap">
          ${buildBreadcrumb(hash)}
          <div class="markdown-body">${marked.parse(text)}</div>
        </div>`;
      window.scrollTo(0, 0);
      setTimeout(() => { progressBar.style.transform = 'scaleX(0)'; }, 300);
      return;
    }

    // Try HTML
    res = await fetch(base + '.html');
    progressBar.style.transform = 'scaleX(0.9)';

    if (res.ok) {
      const text = await res.text();
      progressBar.style.transform = 'scaleX(1)';
      contentArea.innerHTML = `
        <div class="page-wrap">
          ${buildBreadcrumb(hash)}
          ${text}
        </div>`;
      window.scrollTo(0, 0);
      setTimeout(() => { progressBar.style.transform = 'scaleX(0)'; }, 300);
      return;
    }

    // 404
    progressBar.style.transform = 'scaleX(1)';
    contentArea.innerHTML = `
      <div class="page-wrap">
        <div class="markdown-body">
          <h1>404 — Página não encontrada</h1>
          <p>O conteúdo que você está procurando ainda não foi criado ou o link está quebrado.</p>
          <p><a href="#/">← Voltar ao início</a></p>
        </div>
      </div>`;
    setTimeout(() => { progressBar.style.transform = 'scaleX(0)'; }, 300);
  } catch (e) {
    console.error(e);
    progressBar.style.transform = 'scaleX(0)';
    contentArea.innerHTML = `
      <div class="page-wrap">
        <div class="markdown-body">
          <h1>Erro de conexão</h1>
          <p>Não foi possível carregar o conteúdo. Verifique sua conexão e tente novamente.</p>
          <p><a href="#/">← Voltar ao início</a></p>
        </div>
      </div>`;
  }
}

// ── Search ─────────────────────────────────────────────────────────────────
function runSearch(q) {
  const query = q.trim().toLowerCase();
  if (!query) { searchDrop.classList.remove('open'); return; }

  const results = NAV_ITEMS.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.cat.toLowerCase().includes(query) ||
    n.desc.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    searchDrop.innerHTML = `<div class="sr-empty">Nenhum resultado para "<strong>${q}</strong>"</div>`;
  } else {
    searchDrop.innerHTML = results.map(n => `
      <a class="sr-item" href="${n.href}">
        <span class="sr-icon">${n.icon}</span>
        <div>
          <div class="sr-title">${n.title}</div>
          <div class="sr-cat">${n.cat}</div>
        </div>
      </a>`).join('');
  }
  searchDrop.classList.add('open');
}

searchInput.addEventListener('input', e => runSearch(e.target.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchDrop.classList.remove('open'); searchInput.blur(); }
});
document.addEventListener('click', e => {
  if (!e.target.closest('#search-wrap')) searchDrop.classList.remove('open');
});

// Keyboard shortcut: "/" focuses search
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

// ── Progress on scroll ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const total  = document.body.scrollHeight - window.innerHeight;
  const pct    = total > 0 ? window.scrollY / total : 0;
  progressBar.style.transform = `scaleX(${pct})`;

  btt.classList.toggle('show', window.scrollY > 320);
}, { passive: true });

// ── Back to top ────────────────────────────────────────────────────────────
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Init ───────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', loadPage);
document.addEventListener('DOMContentLoaded', loadPage);
