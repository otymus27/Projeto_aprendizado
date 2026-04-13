const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const startTag = '<!-- HEADER -->';
const endTag = '    <!-- FOOTER -->';

// 1. Extrai o conteúdo para pages/claude-code.html
const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const extracted = html.substring(startIndex, endIndex);
    fs.writeFileSync('pages/claude-code.html', extracted);
    console.log('Extracted to pages/claude-code.html');
}

// 2. Atualiza os links da Sidebar
const newSidebarContent = `      <div class="sidebar-category">IA</div>
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

// Substitui o conteúdo da div sidebar-items
let newHtml = html.replace(/(<div id="sidebar-items">)[\s\S]*?(<\/div>)/, `$1\n${newSidebarContent}\n    $2`);

fs.writeFileSync('index.html', newHtml);
console.log('index.html updated successfully.');
