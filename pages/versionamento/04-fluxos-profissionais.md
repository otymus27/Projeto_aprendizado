# 🔄 Fluxos Profissionais de Versionamento

Como o time trabalha com Git e GitHub é tão importante quanto o código em si. Fluxos mal definidos geram conflitos, deploys quebrados e retrabalho. Este guia apresenta os principais modelos e as convenções que times profissionais adotam.

---

## 1. 🌊 Git Flow

O **Git Flow** é o modelo mais completo — ideal para projetos com releases programadas e múltiplas versões em paralelo (ex: software desktop, bibliotecas).

### Branches permanentes

| Branch | Propósito |
|--------|-----------|
| `main` | Produção — só código testado e aprovado |
| `develop` | Integração — onde features se juntam antes da release |

### Branches temporárias

| Prefixo | Origem | Destino | Propósito |
|---------|--------|---------|-----------|
| `feature/` | `develop` | `develop` | Nova funcionalidade |
| `release/` | `develop` | `main` + `develop` | Preparar versão |
| `hotfix/` | `main` | `main` + `develop` | Corrigir bug em produção |
| `bugfix/` | `develop` | `develop` | Corrigir bug antes da release |

```bash
# Feature
git switch develop
git switch -c feature/autenticacao-oauth
# ... desenvolve ...
git switch develop
git merge --no-ff feature/autenticacao-oauth
git branch -d feature/autenticacao-oauth

# Release
git switch develop
git switch -c release/1.2.0
# ... ajustes finais, bump de versão ...
git switch main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release 1.2.0"
git switch develop
git merge --no-ff release/1.2.0

# Hotfix
git switch main
git switch -c hotfix/1.2.1-correcao-login
# ... corrige ...
git switch main
git merge --no-ff hotfix/1.2.1-correcao-login
git tag -a v1.2.1 -m "Hotfix login"
git switch develop
git merge --no-ff hotfix/1.2.1-correcao-login
```

> **Quando usar:** projetos com ciclos de release definidos, múltiplas versões mantidas simultaneamente, equipes médias/grandes.

---

## 2. 🚀 GitHub Flow

O **GitHub Flow** é minimalista — uma branch por feature, merge direto na `main`, deploy contínuo. Adotado pelo próprio GitHub e pela maioria das startups.

```
main ─────────────────────────────────────────→ produção
       ↑                    ↑
  feature/login       feature/dashboard
  (abre PR)           (abre PR)
```

### Fluxo completo

```bash
# 1. Criar branch a partir da main
git switch main
git pull
git switch -c feature/cadastro-usuario

# 2. Desenvolver com commits pequenos e frequentes
git add .
git commit -m "feat: adiciona formulário de cadastro"
git commit -m "feat: integra validação de CPF"
git commit -m "test: adiciona testes do formulário"

# 3. Abrir PR cedo (pode ser draft)
git push -u origin feature/cadastro-usuario
gh pr create --draft --title "feat: cadastro de usuário"

# 4. Quando pronto, marcar como ready e solicitar review
gh pr ready
gh pr review --request-changes --body "Adiciona validação de e-mail"

# 5. Após aprovação e CI verde, mergear
gh pr merge --squash   # ou --merge ou --rebase
```

> **Quando usar:** times ágeis, deploy contínuo (múltiplos deploys por dia), projetos web com uma versão em produção.

---

## 3. 🏎️ Trunk-Based Development

Todos os devs commitam direto na `main` (ou em branches de vida muito curta, < 1 dia). Exige feature flags e CI muito robusto.

```bash
# Branches duram horas, não dias
git switch -c fix/validacao-email   # branch de poucas horas
# ... corrige ...
git push
gh pr create
# CI roda em < 5 min, PR é mergeado
```

> **Quando usar:** times de alta performance com CI/CD maduro, monorepos, empresas como Google e Meta.

---

## 4. 📝 Conventional Commits

Padrão de mensagem de commit que gera changelogs automaticamente e segue Semantic Versioning.

### Formato

```
<tipo>(<escopo opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos

| Tipo | SemVer | Descrição |
|------|--------|-----------|
| `feat` | MINOR | Nova funcionalidade |
| `fix` | PATCH | Correção de bug |
| `feat!` ou `BREAKING CHANGE` | MAJOR | Quebra compatibilidade |
| `docs` | — | Documentação |
| `style` | — | Formatação (sem lógica) |
| `refactor` | — | Refatoração |
| `test` | — | Testes |
| `chore` | — | Manutenção, build, CI |
| `perf` | PATCH | Melhoria de performance |
| `ci` | — | Mudanças na pipeline |
| `revert` | — | Reverte commit anterior |

### Exemplos

```bash
git commit -m "feat(auth): implementa login com Google OAuth"

git commit -m "fix(api): corrige timeout na busca de usuários"

git commit -m "feat!: remove suporte a Node.js 16

BREAKING CHANGE: Node.js 18+ é obrigatório a partir desta versão.
Atualize seu ambiente antes de fazer upgrade."

git commit -m "docs: atualiza README com instruções de setup"

git commit -m "refactor(usuarios): extrai lógica de validação para service

Antes a validação estava duplicada em 3 componentes.
Agora está centralizada em UsuarioValidacaoService."
```

---

## 5. 🔢 Semantic Versioning (SemVer)

```
v MAJOR . MINOR . PATCH
   │       │       └── Correção de bug (compatível)
   │       └────────── Nova feature (compatível)
   └────────────────── Quebra de compatibilidade
```

```bash
v1.0.0   # lançamento inicial estável
v1.0.1   # fix: corrige crash na tela de login
v1.1.0   # feat: adiciona exportação para CSV
v2.0.0   # feat!: nova estrutura de autenticação (breaking)
v2.0.0-beta.1   # pré-release
v2.0.0-rc.1     # release candidate
```

### Automatizando com semantic-release

```bash
npm install --save-dev semantic-release

# semantic-release analisa os commits e:
# - determina a próxima versão automaticamente
# - gera CHANGELOG.md
# - cria tag no Git
# - publica release no GitHub
```

---

## 6. 📋 Estratégias de Merge no PR

| Estratégia | Histórico | Quando usar |
|-----------|-----------|-------------|
| **Merge commit** | Preserva todos os commits + commit de merge | Features grandes com histórico valioso |
| **Squash and merge** | Comprime em 1 commit na main | Features pequenas, histórico limpo |
| **Rebase and merge** | Commits individuais, linear (sem commit de merge) | Quando quer histórico linear sem commit extra |

```bash
# Squash — recomendado para a maioria dos casos
gh pr merge --squash

# Após squash, limpar branch local
git switch main
git pull
git branch -d feature/login
git remote prune origin      # limpar branches remotas deletadas
```

---

## 7. 🔖 Versionamento de Releases

```bash
# Script de release (salve como scripts/release.sh)
#!/bin/bash
VERSION=$1

# Bump version no package.json
npm version $VERSION --no-git-tag-version

# Commit
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"

# Tag
git tag -a "v$VERSION" -m "Release v$VERSION"

# Push
git push origin main --follow-tags

# Criar GitHub Release automaticamente
gh release create "v$VERSION" \
  --generate-notes \
  --title "v$VERSION"
```

```bash
# Usar:
bash scripts/release.sh 1.2.0
```

---

## 8. 📏 Code Review — Checklist

### Para quem abre o PR

```markdown
- [ ] A branch está atualizada com a main?
- [ ] Os testes passam localmente?
- [ ] Não há console.log ou código de debug?
- [ ] As mensagens de commit seguem Conventional Commits?
- [ ] A descrição do PR explica o "por quê", não só o "o quê"?
- [ ] Arquivos de configuração sensíveis fora do commit?
```

### Para quem revisa

```markdown
- [ ] A lógica faz o que diz?
- [ ] Há casos extremos não tratados?
- [ ] Há risco de segurança (injeção, XSS, credenciais hardcoded)?
- [ ] A performance está aceitável?
- [ ] O código é testável/testado?
- [ ] Há complexidade desnecessária?
```

---

## 9. 📁 Estrutura de Branches Recomendada

```
main              ← produção, sempre estável
develop           ← integração (só no Git Flow)
feature/xxx       ← novas funcionalidades
fix/xxx           ← correções de bugs
hotfix/xxx        ← correções urgentes em produção
chore/xxx         ← manutenção, deps, build
refactor/xxx      ← refatorações
release/x.y.z     ← preparar release (só no Git Flow)
```

---

## 10. 💡 Resumo: Qual Fluxo Escolher?

| Situação | Fluxo recomendado |
|---------|-----------------|
| Startup / time pequeno / deploy contínuo | **GitHub Flow** |
| Software com versões múltiplas / releases programadas | **Git Flow** |
| Time grande, CI/CD maduro, alta frequência de deploy | **Trunk-based** |
| Projeto pessoal | **GitHub Flow simplificado** |

> **Regra geral:** comece com GitHub Flow. Migre para Git Flow se surgir a necessidade real de gerenciar múltiplas versões em produção ao mesmo tempo.
