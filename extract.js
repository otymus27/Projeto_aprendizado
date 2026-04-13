const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const startTag = '<!-- HEADER -->';
const endTag = '    <!-- FOOTER -->';

// 1. Extração da página principal (opcional, se as tags existirem)
const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const extracted = html.substring(startIndex, endIndex);
    fs.writeFileSync('pages/claude-code.html', extracted);
    console.log('Extracted to pages/claude-code.html');
}

// 2. Atualização da Sidebar e Design System
const newSidebarLinks = `    <div class="sidebar-category">INTELIGÊNCIA ARTIFICIAL</div>
    <nav class="sidebar-nav">
      <a href="#/claude-code" class="active" onclick="highlightLink(this)"><span class="icon">🤖</span>Manual Claude Code</a>
    </nav>
    
    <div class="sidebar-category">DEVOPS</div>
    <nav class="sidebar-nav">
      <a href="#/devops/docker" onclick="highlightLink(this)"><span class="icon">🐳</span>Docker Básico</a>
      <a href="#/devops/ubuntu" onclick="highlightLink(this)"><span class="icon">🐧</span>Guia Ubuntu/Linux</a>
      <a href="#/devops/nginx" onclick="highlightLink(this)"><span class="icon">🌐</span>Manual do Nginx</a>
      <a href="#/devops/vps-deploy" onclick="highlightLink(this)"><span class="icon">🚀</span>Deploy & SSL na VPS</a>
    </nav>
    
    <div class="sidebar-category">FERRAMENTAS</div>
    <nav class="sidebar-nav">
      <a href="#/ferramentas/git" onclick="highlightLink(this)"><span class="icon">🐙</span>Git & GitHub</a>
    </nav>
    
    <div class="sidebar-category">FULL STACK</div>
    <nav class="sidebar-nav">
      <a href="#/fullstack/roadmap" onclick="highlightLink(this)"><span class="icon">🗺️</span>Roadmap 2026</a>
      <a href="#/fullstack/springboot" onclick="highlightLink(this)"><span class="icon">☕</span>Java Spring Boot</a>
    </nav>`;

let newHtml = html.replace(/(<div class="sidebar-logo">[\s\S]*?<\/div>)[\s\S]*?(<\/aside>)/, `$1\n${newSidebarLinks}\n    $2`);

// Adiciona o CSS para sidebar-category no style se não estiver lá
if (!newHtml.includes('.sidebar-category')) {
    newHtml = newHtml.replace('</style>', `
    .sidebar-category {
      padding: 0 20px;
      margin-top: 16px;
      font-size: 11px;
      font-weight: 800;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }
    .sidebar-nav { padding-top: 6px; padding-bottom: 6px; }
    .sidebar-nav a.active {
      background: rgba(124,106,247,0.15);
      color: var(--accent);
      border-left: 3px solid var(--accent);
      padding-left: 13px;
    }
    .markdown-body {
      font-family: inherit;
      color: var(--text);
      line-height: 1.7;
      padding: 48px 24px 80px;
      max-width: 960px;
      margin: 0 auto;
    }
    .markdown-body h1 {
      font-size: 36px; font-weight: 800; margin-bottom: 24px;
      background: linear-gradient(90deg, #a78bfa, #7c6af7, #56cfb2);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .markdown-body h2 { font-size: 24px; margin-top: 40px; margin-bottom: 16px; color: #fff; border-bottom: 1px solid var(--border); padding-bottom: 8px;}
    .markdown-body h3 { font-size: 18px; margin-top: 24px; margin-bottom: 12px; color: #e2e8f0; }
    .markdown-body p { margin-bottom: 16px; color: var(--muted); }
    .markdown-body strong { color: #fff; }
    .markdown-body ul, .markdown-body ol { margin-bottom: 16px; padding-left: 24px; color: var(--muted); }
    .markdown-body li { margin-bottom: 8px; }
    .markdown-body a { color: var(--accent); text-decoration: none; }
    .markdown-body a:hover { text-decoration: underline; }
    .markdown-body blockquote { border-left: 4px solid var(--accent); padding-left: 16px; margin: 20px 0; color: #a0aec0; background: rgba(124,106,247,0.05); padding: 16px; border-radius: 0 8px 8px 0; }
    .markdown-body pre { background: var(--code-bg); border: 1px solid var(--border); padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 20px; }
    .markdown-body code { font-family: 'Consolas', monospace; color: #a78bfa; background: rgba(167,139,250,0.1); padding: 2px 6px; border-radius: 4px; font-size: 14px; }
    .markdown-body pre code { background: transparent; padding: 0; color: #e2e8f0; }
    </style>`);
}

// 3. Limpeza do corpo para o modo Shell
const mainPos = newHtml.indexOf('<main class="main-content"');
const footerMark = '    <!-- FOOTER -->';
if (mainPos !== -1 && newHtml.includes(footerMark)) {
    newHtml = newHtml.substring(0, mainPos) + '<main class="main-content" id="content-area">\n' + 
              newHtml.substring(newHtml.indexOf(footerMark));
}

// 4. Scripts SPA
if (!newHtml.includes('app.js')) {
    const scripts = `
<!-- Markdown Parser -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<!-- SPA Router -->
<script src="app.js"></script>
</body>`;
    newHtml = newHtml.replace('</body>', scripts);
}

fs.writeFileSync('index.html', newHtml);
console.log('index.html updated successfully.');
