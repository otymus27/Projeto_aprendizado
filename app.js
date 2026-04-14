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
  { href: '#/fullstack/angular',                   icon: '🅰️', title: 'Angular',               cat: 'Full Stack',    desc: 'Framework frontend da Google para SPAs corporativas' },
  { href: '#/versionamento/01-git',                icon: '🌿', title: 'Git',                   cat: 'Versionamento', desc: 'Controle de versão distribuído do zero ao avançado' },
  { href: '#/versionamento/02-github',             icon: '🐱', title: 'GitHub',                cat: 'Versionamento', desc: 'Plataforma de colaboração, PRs, Issues e Releases' },
  { href: '#/versionamento/03-github-actions',     icon: '⚙️', title: 'GitHub Actions',        cat: 'Versionamento', desc: 'Automação de CI/CD nativa do GitHub' },
  { href: '#/versionamento/04-fluxos-profissionais',icon:'🔄', title: 'Fluxos Profissionais',  cat: 'Versionamento', desc: 'Git Flow, GitHub Flow, Conventional Commits e SemVer' },
  { href: '#/versionamento/05-ci-cd-angular',      icon: '🅰️', title: 'CI/CD Angular',         cat: 'Versionamento', desc: 'Pipeline completa de build, teste e deploy para Angular' },
  { href: '#/versionamento/06-ci-cd-spring-boot',  icon: '☕', title: 'CI/CD Spring Boot',     cat: 'Versionamento', desc: 'Pipeline com Maven, Docker e deploy zero downtime' },
];

// ── DOM refs ───────────────────────────────────────────────────────────────
const contentArea = document.getElementById('content-area');
const searchInput = document.getElementById('search-input');
const searchDrop  = document.getElementById('search-dropdown');
const progressBar = document.getElementById('progress');
const btt         = document.getElementById('btt');
const sidebar     = document.getElementById('sidebar');
const overlay     = document.getElementById('overlay');

// ── Sidebar toggle (mobile) ────────────────────────────────────────────────
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

// ── Left sidebar section collapse ─────────────────────────────────────────
function toggleSection(header) {
  header.classList.toggle('collapsed');
  header.nextElementSibling.classList.toggle('hidden');
}

// ── Active nav link ────────────────────────────────────────────────────────
function setActiveLink(hash) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === hash);
  });
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────
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

// ── TOC: slugify heading text ──────────────────────────────────────────────
const _usedIds = new Set();

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // remove diacríticos (ã→a, é→e)
    .replace(/[^\w\s-]/g, ' ')         // remove emojis e símbolos
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

function uniqueId(base) {
  let id = base;
  let n = 2;
  while (_usedIds.has(id)) id = `${base}-${n++}`;
  _usedIds.add(id);
  return id;
}

// ── TOC: adiciona IDs nas headings do markdown ─────────────────────────────
function addHeadingIds(container) {
  _usedIds.clear();
  container.querySelectorAll('h2, h3').forEach(el => {
    el.id = uniqueId(slugify(el.textContent));
  });
}

// ── TOC: toggle grupo H2 retrátil ─────────────────────────────────────────
function toggleTocGroup(btn) {
  btn.closest('.toc-group').classList.toggle('open');
}

// ── TOC: constrói e injeta o TOC após renderizar o conteúdo ───────────────
function buildToc(container) {
  const headings = [...container.querySelectorAll('h2, h3')];
  if (headings.length < 3) return;  // páginas curtas não precisam de TOC

  // Agrupa H2 com seus H3 filhos
  const groups = [];
  let current = null;

  headings.forEach(el => {
    if (el.tagName === 'H2') {
      current = { id: el.id, text: el.textContent.trim(), children: [] };
      groups.push(current);
    } else if (current) {
      current.children.push({ id: el.id, text: el.textContent.trim() });
    }
  });

  // ── TOC Desktop (aside lateral) ──
  const tocAsideEl = contentArea.querySelector('.toc-aside');
  if (!tocAsideEl) return;

  const desktopHtml = groups.map(g => {
    const hasChildren = g.children.length > 0;

    const childrenHtml = hasChildren
      ? `<div class="toc-children">
           ${g.children.map(c =>
             `<a class="toc-h3-link" href="#${c.id}">${c.text}</a>`
           ).join('')}
         </div>`
      : '';

    const toggleBtn = hasChildren
      ? `<button class="toc-toggle" onclick="toggleTocGroup(this)" title="Expandir/recolher">
           <span class="chv">›</span>
         </button>`
      : '';

    return `
      <div class="toc-group${hasChildren ? ' open' : ''}">
        <div class="toc-h2-row">
          <a class="toc-h2-link" href="#${g.id}">${g.text}</a>
          ${toggleBtn}
        </div>
        ${childrenHtml}
      </div>`;
  }).join('');

  tocAsideEl.innerHTML = `
    <p class="toc-label">Neste guia</p>
    ${desktopHtml}`;

  // ── TOC Mobile (details/summary inline) ──
  const tocMobEl = contentArea.querySelector('.toc-mobile');
  if (!tocMobEl) return;

  const mobileHtml = groups.map(g => {
    const children = g.children.map(c =>
      `<a class="toc-mob-h3" href="#${c.id}">${c.text}</a>`
    ).join('');
    return `<a class="toc-mob-h2" href="#${g.id}">${g.text}</a>${children}`;
  }).join('');

  tocMobEl.innerHTML = `
    <summary>📑 Neste guia</summary>
    <nav class="toc-mob-nav">${mobileHtml}</nav>`;

  // Fechar details ao clicar em um link
  tocMobEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => tocMobEl.removeAttribute('open'));
  });
}

// ── TOC: scroll spy ────────────────────────────────────────────────────────
let _tocObserver = null;

function initScrollSpy() {
  if (_tocObserver) { _tocObserver.disconnect(); _tocObserver = null; }

  const headings = [...contentArea.querySelectorAll('.markdown-body h2, .markdown-body h3')];
  if (!headings.length) return;

  _tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      // Highlight nos links do TOC
      contentArea.querySelectorAll('.toc-h2-link, .toc-h3-link').forEach(a => {
        a.classList.toggle('toc-active', a.getAttribute('href') === `#${id}`);
      });

      // Auto-expandir o grupo pai se um H3 ficou ativo
      const activeH3 = contentArea.querySelector(`.toc-h3-link[href="#${id}"]`);
      if (activeH3) {
        const group = activeH3.closest('.toc-group');
        if (group) group.classList.add('open');
      }
    });
  }, {
    rootMargin: '-62px 0px -55% 0px',
    threshold: 0
  });

  headings.forEach(h => _tocObserver.observe(h));
}

// ── Welcome page ───────────────────────────────────────────────────────────
function renderWelcome() {
  if (_tocObserver) { _tocObserver.disconnect(); _tocObserver = null; }
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

  if (route === '/' || route === '') {
    renderWelcome();
    window.scrollTo(0, 0);
    return;
  }

  contentArea.innerHTML = `
    <div class="loading"><div class="spinner"></div><span>Carregando…</span></div>`;

  const base = 'pages/' + route.replace(/^\//, '');
  progressBar.style.transform = 'scaleX(0.3)';

  // Renderiza o conteúdo no layout de duas colunas com TOC
  function injectLayout(htmlContent) {
    contentArea.innerHTML = `
      <div class="page-layout">
        <div class="page-content">
          <details class="toc-mobile"></details>
          ${buildBreadcrumb(hash)}
          <div class="markdown-body">${htmlContent}</div>
        </div>
        <aside class="toc-aside"></aside>
      </div>`;

    const mdBody = contentArea.querySelector('.markdown-body');
    addHeadingIds(mdBody);
    buildToc(mdBody);
    initScrollSpy();
    window.scrollTo(0, 0);
    setTimeout(() => { progressBar.style.transform = 'scaleX(0)'; }, 300);
  }

  try {
    // Tenta Markdown
    let res = await fetch(base + '.md');
    progressBar.style.transform = 'scaleX(0.7)';

    if (res.ok) {
      const text = await res.text();
      progressBar.style.transform = 'scaleX(1)';
      injectLayout(marked.parse(text));
      return;
    }

    // Tenta HTML
    res = await fetch(base + '.html');
    progressBar.style.transform = 'scaleX(0.9)';

    if (res.ok) {
      const text = await res.text();
      progressBar.style.transform = 'scaleX(1)';
      injectLayout(text);
      return;
    }

    // 404
    progressBar.style.transform = 'scaleX(1)';
    contentArea.innerHTML = `
      <div class="page-layout">
        <div class="page-content">
          <div class="markdown-body">
            <h1>404 — Página não encontrada</h1>
            <p>O conteúdo não foi criado ainda ou o link está quebrado.</p>
            <p><a href="#/">← Voltar ao início</a></p>
          </div>
        </div>
      </div>`;
    setTimeout(() => { progressBar.style.transform = 'scaleX(0)'; }, 300);

  } catch (e) {
    console.error(e);
    progressBar.style.transform = 'scaleX(0)';
    contentArea.innerHTML = `
      <div class="page-layout">
        <div class="page-content">
          <div class="markdown-body">
            <h1>Erro de conexão</h1>
            <p>Não foi possível carregar o conteúdo. Verifique sua conexão.</p>
            <p><a href="#/">← Voltar ao início</a></p>
          </div>
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

  searchDrop.innerHTML = results.length === 0
    ? `<div class="sr-empty">Nenhum resultado para "<strong>${q}</strong>"</div>`
    : results.map(n => `
        <a class="sr-item" href="${n.href}">
          <span class="sr-icon">${n.icon}</span>
          <div>
            <div class="sr-title">${n.title}</div>
            <div class="sr-cat">${n.cat}</div>
          </div>
        </a>`).join('');

  searchDrop.classList.add('open');
}

searchInput.addEventListener('input', e => runSearch(e.target.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchDrop.classList.remove('open'); searchInput.blur(); }
});
document.addEventListener('click', e => {
  if (!e.target.closest('#search-wrap')) searchDrop.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault(); searchInput.focus(); searchInput.select();
  }
});

// ── Scroll: progress bar + back-to-top ────────────────────────────────────
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
  btt.classList.toggle('show', window.scrollY > 320);
}, { passive: true });

function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Init ───────────────────────────────────────────────────────────────────
window.addEventListener('hashchange', loadPage);
document.addEventListener('DOMContentLoaded', loadPage);
