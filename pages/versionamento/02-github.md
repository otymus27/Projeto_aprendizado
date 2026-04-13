# 🐱 GitHub — Plataforma de Colaboração e Código

O **GitHub** é a maior plataforma de hospedagem de código do mundo, construída em cima do Git. Vai muito além de armazenar código — é onde equipes colaboram, revisam código, gerenciam projetos e automatizam pipelines.

---

## 1. 🔑 Configurando Acesso SSH

Autenticação via SSH é mais segura e prática que usuário/senha:

```bash
# 1. Gerar chave SSH
ssh-keygen -t ed25519 -C "fabio@email.com"
# Salvar em ~/.ssh/id_ed25519 (pressione Enter)

# 2. Iniciar o agente SSH e adicionar a chave
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copiar a chave pública
cat ~/.ssh/id_ed25519.pub
# Cole no GitHub: Settings → SSH and GPG keys → New SSH key

# 4. Testar conexão
ssh -T git@github.com
# Deve mostrar: Hi usuario! You've successfully authenticated.
```

---

## 2. 📁 Repositórios

### Criar e configurar

```bash
# Conectar projeto local ao GitHub (após criar repo no site)
git remote add origin git@github.com:usuario/meu-repo.git
git branch -M main
git push -u origin main

# Clonar com SSH
git clone git@github.com:usuario/repo.git

# Fork — clonar repo de outra pessoa para sua conta
# Feito pela interface do GitHub, depois:
git clone git@github.com:SEU-USUARIO/repo-forkado.git

# Manter fork sincronizado com o original (upstream)
git remote add upstream git@github.com:usuario-original/repo.git
git fetch upstream
git merge upstream/main
```

### Configurações importantes do repositório

| Configuração | Onde fica | Para que serve |
|-------------|-----------|---------------|
| Branch protection | Settings → Branches | Impede push direto em main |
| Secrets | Settings → Secrets | Variáveis seguras para Actions |
| Environments | Settings → Environments | Controle de deploy por ambiente |
| Collaborators | Settings → Access | Adicionar membros ao repo |
| GitHub Pages | Settings → Pages | Publicar site estático |

---

## 3. 🐛 Issues

Issues são usadas para rastrear bugs, features e tarefas.

### Labels recomendadas

| Label | Cor | Uso |
|-------|-----|-----|
| `bug` | Vermelho | Problema confirmado |
| `feature` | Azul | Nova funcionalidade |
| `enhancement` | Verde | Melhoria no existente |
| `documentation` | Amarelo | Melhorias na docs |
| `good first issue` | Verde claro | Para contribuidores novatos |
| `blocked` | Laranja | Aguardando outra coisa |
| `priority: high` | Vermelho escuro | Alta prioridade |

### Templates de Issue

Crie `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Reporte um comportamento inesperado
labels: bug
---

## Descrição
Descrição clara e concisa do bug.

## Como Reproduzir
1. Vá em '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer.

## Screenshots
Se aplicável.

## Ambiente
- OS: [ex: Ubuntu 22.04]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.2.0]
```

---

## 4. 🔀 Pull Requests

O coração da colaboração no GitHub.

### Fluxo completo de PR

```bash
# 1. Criar branch para a feature
git switch -c feature/tela-de-login

# 2. Desenvolver e commitar
git add .
git commit -m "feat: implementa tela de login com validação"

# 3. Enviar branch para o GitHub
git push -u origin feature/tela-de-login

# 4. Abrir PR pelo GitHub ou via CLI
gh pr create --title "feat: tela de login" --body "Implementa..."
```

### Template de Pull Request

Crie `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## O que esse PR faz?
Descrição do que foi implementado/corrigido.

## Tipo de mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como testar
1. Checkout nessa branch
2. Rode `npm install && npm run dev`
3. Acesse `/login` e teste com credenciais válidas e inválidas

## Checklist
- [ ] Código segue as convenções do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Sem `console.log` esquecido
- [ ] Variáveis de ambiente documentadas
```

### Code Review — boas práticas

> **Revisor:** foque no que importa — lógica, segurança, performance, manutenibilidade. Não guerre por estilo (para isso existe o linter).

```
# Comentários construtivos:
✅ "Esse loop pode ser um Array.map(), ficaria mais legível"
✅ "Essa query pode causar N+1, sugiro adicionar o join aqui"
❌ "Isso está errado"
❌ "Eu teria feito diferente"
```

---

## 5. 🔒 Branch Protection Rules

Configure em **Settings → Branches → Add branch protection rule**:

```
Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Status checks: ci/build, ci/test

✅ Require conversation resolution before merging
✅ Do not allow bypassing the above settings
```

---

## 6. 🔐 Secrets e Variáveis

```bash
# Via GitHub CLI
gh secret set VPS_HOST --body "192.168.1.1"
gh secret set VPS_PASSWORD < senha.txt    # ler de arquivo

# Listar secrets (apenas nomes)
gh secret list

# Em Actions, acessar com:
${{ secrets.VPS_HOST }}

# Variáveis de ambiente (não sensíveis) — Settings → Variables
${{ vars.APP_ENV }}
```

### Tipos de secret

| Tipo | Escopo | Quando usar |
|------|--------|------------|
| Repository secret | Um repositório | Maioria dos casos |
| Environment secret | Ambiente específico (prod/staging) | Controle fino por ambiente |
| Organization secret | Todos repos da org | Tokens compartilhados na empresa |

---

## 7. 🌐 GitHub Pages

Hospedagem gratuita para sites estáticos:

```bash
# Opção 1: Deploy direto da branch gh-pages
git switch --orphan gh-pages
git commit --allow-empty -m "chore: init gh-pages"
git push origin gh-pages

# Opção 2: Deploy via GitHub Actions (recomendado)
# Settings → Pages → Source: GitHub Actions
```

**Workflow para Angular no GitHub Pages:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build -- --base-href="/nome-do-repo/"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/nome-do-repo/browser
      - uses: actions/deploy-pages@v4
```

---

## 8. 📦 Releases

Releases marcam versões oficiais do projeto:

```bash
# Via CLI
gh release create v1.0.0 \
  --title "v1.0.0 — Versão Inicial" \
  --notes "## O que há de novo\n- Tela de login\n- Dashboard" \
  --target main

# Criar release com assets (arquivos)
gh release create v1.0.0 dist/app.zip --title "v1.0.0"

# Listar releases
gh release list

# Download da release mais recente
gh release download --pattern "*.zip"
```

---

## 9. 🛠️ GitHub CLI — Comandos Essenciais

```bash
# Instalar
# Ubuntu: sudo apt install gh
# macOS: brew install gh

# Autenticar
gh auth login

# Repositórios
gh repo create meu-repo --public --clone
gh repo clone usuario/repo
gh repo view --web           # abrir no browser

# Pull Requests
gh pr create --title "feat: ..." --body "..."
gh pr list
gh pr checkout 42            # fazer checkout do PR #42
gh pr merge 42 --squash
gh pr review 42 --approve
gh pr review 42 --request-changes --body "Precisa de testes"

# Issues
gh issue create --title "Bug: ..." --label "bug"
gh issue list --label "bug"
gh issue close 15

# Actions
gh run list
gh run view 123456
gh run watch                 # acompanhar run em tempo real
gh workflow run deploy.yml
```

---

## 10. 💡 Boas Práticas no GitHub

- **Nunca commite segredos** — use secrets do GitHub Actions ou `.env` no `.gitignore`
- **Sempre abra PRs** para features, mesmo trabalhando solo — facilita code review e rollback
- **Use Issues vinculadas ao PR** — `Closes #42` no corpo do PR fecha a issue automaticamente
- **Proteja a `main`** — exija pelo menos 1 aprovação e CI passando antes do merge
- **Use Releases** para marcar versões — facilita rollback e comunicação com o time
