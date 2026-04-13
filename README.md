# DevDocs — Base de Conhecimento para Iniciantes

Base de conhecimento interativa sobre desenvolvimento de software. Guias práticos sobre IA, DevOps, ferramentas e desenvolvimento full stack, renderizados no browser a partir de arquivos Markdown.

## Guias Disponíveis

| Categoria | Guia |
|-----------|------|
| IA | Manual Claude Code |
| DevOps | Docker Básico |
| DevOps | Guia Ubuntu/Linux |
| DevOps | Manual do Nginx |
| DevOps | Deploy & SSL na VPS |
| Ferramentas | Git & GitHub |
| Full Stack | Roadmap 2026 |
| Full Stack | Java Spring Boot |

## Tecnologias

- **Frontend:** HTML + CSS + JavaScript vanilla
- **Servidor:** Node.js (servidor HTTP estático)
- **Markdown:** `marked.js` via CDN
- **Deploy:** GitHub Actions → VPS via SCP/SSH
- **Processo:** PM2

## Rodando Localmente

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm run dev
```

Acesse `http://localhost:3000`.

## Adicionando um Guia

1. Crie `pages/<categoria>/<nome>.md`
2. Adicione o link na sidebar em `index.html` e no array `NAV_ITEMS` em `app.js`
3. Faça push para `main` — o deploy acontece automaticamente

## Deploy

O pipeline `.github/workflows/deploy.yml` dispara automaticamente em todo push para `main`:

```
push → node extract.js → SCP para VPS → SSH → pm2 restart
```

---

Criado por **Fábio Rocha**
