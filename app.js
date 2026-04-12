const contentArea = document.getElementById('content-area');

// Helper to update active link in sidebar
function highlightLink(clickedLink) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    clickedLink.classList.add('active');
}

async function loadPage() {
    let hash = window.location.hash.substring(1);
    if (!hash) hash = '/claude-code'; // default route
    if (!hash.startsWith('/')) hash = '/' + hash;

    // Remove the leading slash for the relative path
    const path = hash.substring(1);
    const basePath = 'pages/' + path;

    contentArea.innerHTML = '<div class="wrapper"><h2 style="color:var(--muted);">Carregando conteúdo...</h2></div>';

    try {
        // First try to load as Markdown
        let res = await fetch(basePath + '.md');
        if (res.ok) {
            const text = await res.text();
            contentArea.innerHTML = '<div class="markdown-body">' + marked.parse(text) + '</div>';
            return;
        }

        // If Markdown fails, try HTML
        res = await fetch(basePath + '.html');
        if (res.ok) {
            const text = await res.text();
            contentArea.innerHTML = text;
            return;
        }

        // 404
        contentArea.innerHTML = '<div class="wrapper"><h1 style="color:#e76f51;">404 - Página não encontrada</h1><p style="color:var(--muted);">O conteúdo que você está procurando ainda não foi criado ou o link está quebrado.</p></div>';
    } catch (e) {
        console.error(e);
        contentArea.innerHTML = '<div class="wrapper"><h1 style="color:#e76f51;">Erro</h1><p style="color:var(--muted);">Erro de conexão ao carregar o conteúdo.</p></div>';
    }
}

// Initial load
window.addEventListener('hashchange', loadPage);
document.addEventListener('DOMContentLoaded', loadPage);
