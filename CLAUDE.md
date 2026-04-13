# CLAUDE.md — Instruções do Projeto

## Visão Geral

**DevDocs** é uma base de conhecimento interativa para iniciantes em desenvolvimento. É uma Single Page Application (SPA) estática com roteamento via hash (`#/rota`), servida por um servidor Node.js simples. Os guias são escritos em Markdown e renderizados no browser pelo `marked.js`.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML + CSS + JavaScript vanilla (sem framework) |
| Servidor | Node.js (`server.js`) — servidor HTTP estático simples |
| Parser | `marked.js` via CDN — converte `.md` para HTML no browser |
| Process manager | PM2 (produção) |
| Deploy | GitHub Actions → SCP → SSH → PM2 restart |
| Infra | VPS Hostinger com Nginx como proxy reverso |

## Estrutura do Projeto

```
projeto-aprendizado/
├── index.html          # Shell da SPA — contém todo o CSS e o layout
├── app.js              # Roteamento hash, busca, sidebar, back-to-top
├── server.js           # Servidor HTTP estático (porta 3000)
├── extract.js          # Script legado de extração (executado no CI)
├── package.json        # Scripts: start, dev, extract
├── Dockerfile          # Imagem node:18-alpine
├── docker-compose.yml  # Stack local para desenvolvimento
├── .github/
│   └── workflows/
│       └── deploy.yml  # Pipeline CI/CD → VPS
└── pages/
    ├── claude-code.md
    ├── devops/
    │   ├── docker.md
    │   ├── nginx.md
    │   ├── ubuntu.md
    │   └── vps-deploy.md
    ├── ferramentas/
    │   └── git.md
    └── fullstack/
        ├── roadmap.md
        ├── springboot.md
        └── angular.md
```

## Roteamento

O roteamento é feito inteiramente via `window.location.hash` no `app.js`.

- `#/` → Página de boas-vindas com cards (renderizada em JS, sem arquivo)
- `#/claude-code` → `pages/claude-code.md`
- `#/devops/docker` → `pages/devops/docker.md`

O app tenta carregar `.md` primeiro, depois `.html`. **Todos os guias devem ser `.md`** — não criar arquivos `.html` em `pages/`.

## Como Adicionar um Novo Guia

1. Criar o arquivo em `pages/<categoria>/<nome>.md`
2. Adicionar o link na sidebar em `index.html` (bloco `<aside id="sidebar">`)
3. Adicionar o item no array `NAV_ITEMS` em `app.js` (usado na busca e nos cards da home)

## Convenções de Código

- **CSS:** variáveis CSS em `:root`, sem frameworks. Prefixo de componente nos seletores (`.sb-`, `.nav-`, `.sr-`)
- **JavaScript:** vanilla ES6+, sem bundler, sem TypeScript
- **Markdown:** H1 no topo com emoji, H2 para seções principais, tabelas para referências rápidas, blocos de código com linguagem especificada

## Comandos Locais

```bash
# Iniciar servidor de desenvolvimento
npm run dev      # node server.js na porta 3000

# Executar script de extração (legado, rodado no CI)
npm run extract  # node extract.js
```

## CI/CD — deploy.yml

O pipeline dispara no push para `main` e executa:
1. `node extract.js` (pré-processamento)
2. SCP de todos os arquivos para `$VPS_TARGET_DIR`
3. SSH na VPS → carrega NVM via `getent passwd` → `pm2 restart` ou `pm2 start`

**Secrets necessários no GitHub:** `VPS_HOST`, `VPS_USERNAME`, `VPS_PASSWORD`, `VPS_PORT`, `VPS_TARGET_DIR`

## O que Não Fazer

- Não criar arquivos `.html` dentro de `pages/` — usar `.md`
- Não adicionar dependências npm desnecessárias (o projeto tem zero dependências de runtime)
- Não usar frameworks JS — o projeto é intencionalmente vanilla
- Não commitar `.env` ou arquivos com credenciais
- Não alterar `extract.js` sem entender o impacto no CI (ele roda no pipeline)
