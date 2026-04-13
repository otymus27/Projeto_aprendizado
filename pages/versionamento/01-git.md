# 🐙 Git — Controle de Versão do Zero ao Avançado

O **Git** é o sistema de controle de versão distribuído mais usado no mundo. Ele rastreia cada alteração no seu código, permite trabalhar em equipe sem conflitos e possibilita voltar para qualquer ponto da história do projeto.

---

## 1. 🧠 Conceitos Fundamentais

| Conceito | O que é |
|---------|---------|
| **Repositório** | Pasta monitorada pelo Git, contém todo o histórico |
| **Commit** | Snapshot do código em determinado momento |
| **Branch** | Linha independente de desenvolvimento |
| **Merge** | Une duas branches |
| **Rebase** | Reescreve o histórico movendo commits |
| **Stash** | Guarda alterações temporariamente sem commitar |
| **Tag** | Marca um commit importante (ex: v1.0.0) |
| **Remote** | Repositório remoto (GitHub, GitLab) |
| **HEAD** | Ponteiro para o commit atual |
| **Index / Stage** | Área de preparação antes do commit |

---

## 2. ⚙️ Instalação e Configuração

```bash
# Ubuntu/Debian
sudo apt install git

# macOS
brew install git

# Windows — baixar em git-scm.com

# Verificar versão
git --version
```

**Configuração inicial obrigatória:**

```bash
git config --global user.name  "Fábio Rocha"
git config --global user.email "fabio@email.com"
git config --global core.editor "code --wait"    # VS Code como editor padrão
git config --global init.defaultBranch main       # branch padrão = main
git config --global pull.rebase false             # merge ao fazer pull

# Ver todas as configurações
git config --list
```

---

## 3. 🚀 Fluxo Básico

```bash
# Iniciar repositório na pasta atual
git init

# Clonar repositório existente
git clone git@github.com:usuario/repo.git
git clone git@github.com:usuario/repo.git pasta-destino

# Ver estado atual
git status
git status -s   # formato curto

# Ver diferenças
git diff                    # alterações não staged
git diff --staged           # alterações staged (prontas para commit)
git diff main..feature/x    # diferença entre branches
```

---

## 4. 📸 Staging e Commits

```bash
# Adicionar ao stage
git add arquivo.js           # arquivo específico
git add src/                 # toda uma pasta
git add .                    # tudo (cuidado!)
git add -p                   # interativo — escolhe partes do arquivo

# Remover do stage (sem perder alterações)
git restore --staged arquivo.js

# Criar commit
git commit -m "feat: adiciona tela de login"
git commit -am "fix: corrige validação"   # add + commit (só arquivos já trackeados)

# Alterar último commit (antes de push)
git commit --amend -m "nova mensagem"
git commit --amend --no-edit   # adiciona stage ao último commit sem mudar mensagem
```

### Conventional Commits

Padrão amplamente adotado que torna o histórico legível:

```
tipo(escopo): descrição curta

feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação (sem mudança de lógica)
refactor: refatoração
test:     adição/correção de testes
chore:    tarefas de build, CI, configuração
perf:     melhoria de performance
ci:       mudanças em pipeline
```

---

## 5. 🌿 Branches

```bash
# Listar branches
git branch          # locais
git branch -r       # remotas
git branch -a       # todas

# Criar e trocar de branch
git switch -c feature/login       # cria e muda (moderno)
git checkout -b feature/login     # equivalente clássico

# Trocar de branch
git switch main
git checkout main

# Renomear branch
git branch -m nome-antigo nome-novo

# Deletar branch
git branch -d feature/login       # só se já foi mergeada
git branch -D feature/login       # força deleção
git push origin --delete feature/login   # deleta remota
```

---

## 6. 🔀 Merge e Rebase

```bash
# Merge — cria um commit de merge, preserva histórico
git switch main
git merge feature/login
git merge --no-ff feature/login    # força commit de merge mesmo sendo fast-forward
git merge --squash feature/login   # comprime todos os commits em um

# Abortar merge com conflito
git merge --abort

# Rebase — reescreve histórico, histórico linear
git switch feature/login
git rebase main          # move os commits da branch em cima do main

# Rebase interativo — editar, squash, reordenar commits
git rebase -i HEAD~3     # edita os últimos 3 commits
git rebase -i main       # edita todos commits desde que divergiu do main
```

**Resolvendo conflitos:**

```bash
# 1. Ver arquivos conflitantes
git status

# 2. Editar os arquivos — escolher o que manter
# (o editor mostrará <<<<<<, ======, >>>>>> )

# 3. Marcar como resolvido
git add arquivo-resolvido.js

# 4. Continuar merge/rebase
git merge --continue
git rebase --continue
```

---

## 7. 🌐 Remote — Trabalhando com Repositório Remoto

```bash
# Ver remotes configurados
git remote -v

# Adicionar remote
git remote add origin git@github.com:usuario/repo.git

# Enviar para remote
git push origin main
git push -u origin main       # -u define upstream (só precisa na 1ª vez)
git push --force-with-lease   # force seguro (verifica se alguém fez push antes)

# Buscar atualizações
git fetch origin              # baixa sem aplicar
git pull                      # fetch + merge
git pull --rebase             # fetch + rebase

# Sincronizar branch local com remota
git switch main
git pull origin main
```

---

## 8. 📦 Stash

```bash
# Guardar alterações temporariamente
git stash
git stash push -m "WIP: tela de login"   # com nome descritivo

# Listar stashes
git stash list

# Aplicar stash
git stash pop           # aplica e remove o stash
git stash apply         # aplica mas mantém o stash
git stash apply stash@{2}   # aplica stash específico

# Deletar stash
git stash drop stash@{0}
git stash clear          # remove todos
```

---

## 9. 🔍 Histórico e Inspeção

```bash
# Ver histórico
git log
git log --oneline                          # uma linha por commit
git log --oneline --graph --all            # grafo visual de branches
git log --author="Fábio"                   # filtrar por autor
git log --since="2 weeks ago"             # filtrar por data
git log -p arquivo.js                      # histórico com diff de um arquivo
git log --diff-filter=D --name-only        # arquivos deletados

# Ver um commit específico
git show abc1234
git show HEAD~2              # 2 commits atrás do atual

# Quem mudou o quê em um arquivo
git blame src/app.js
git blame -L 10,25 src/app.js   # linhas 10 a 25

# Buscar em commits
git log -S "nome da função"     # commits que adicionaram/removeram o texto
git log --grep="fix"            # buscar na mensagem do commit
```

---

## 10. ↩️ Desfazendo Erros

```bash
# Descartar alterações no arquivo (antes do stage)
git restore arquivo.js

# Descartar TUDO (cuidado — irreversível)
git restore .

# Desfazer stage
git restore --staged arquivo.js

# Desfazer commit mantendo as alterações no stage
git reset --soft HEAD~1

# Desfazer commit mantendo as alterações (mas tirando do stage)
git reset HEAD~1

# Desfazer commit e descartar as alterações (DESTRUTIVO)
git reset --hard HEAD~1

# Desfazer commit de forma segura (cria novo commit que reverte)
git revert HEAD
git revert abc1234

# Recuperar branch ou arquivo deletado
git reflog                      # histórico de todos os movimentos de HEAD
git checkout abc1234            # ir para aquele ponto
```

---

## 11. 🏷️ Tags

```bash
# Criar tag (versão)
git tag v1.0.0                                    # tag leve
git tag -a v1.0.0 -m "Release versão 1.0.0"     # tag anotada (recomendado)
git tag -a v1.0.1 abc1234 -m "Hotfix crítico"    # taguear commit específico

# Listar tags
git tag
git tag -l "v1.*"

# Enviar tags para remote
git push origin v1.0.0      # tag específica
git push origin --tags      # todas as tags

# Deletar tag
git tag -d v1.0.0
git push origin --delete v1.0.0
```

---

## 12. 🚫 .gitignore

Arquivo que define o que o Git deve **ignorar**:

```gitignore
# Dependências
node_modules/
vendor/

# Build
dist/
build/
target/
*.class
*.jar

# Variáveis de ambiente
.env
.env.local
.env.production

# IDE
.idea/
.vscode/
*.iml

# Logs
*.log
logs/

# SO
.DS_Store
Thumbs.db

# Cobertura de testes
coverage/
.nyc_output/
```

```bash
# Parar de rastrear arquivo que já foi commitado
git rm --cached arquivo.js
git rm --cached -r pasta/
```

---

## 13. 🛠️ Comandos Avançados

```bash
# Cherry-pick — trazer commit específico para branch atual
git cherry-pick abc1234
git cherry-pick abc1234..def5678   # range de commits

# Bisect — encontrar qual commit introduziu um bug
git bisect start
git bisect bad                  # commit atual tem o bug
git bisect good v1.0.0          # esta versão estava ok
# Git faz checkout em commits do meio — você testa e marca:
git bisect good   # ou
git bisect bad
# Repete até achar o commit culpado
git bisect reset

# Worktree — duas branches checadas ao mesmo tempo em pastas diferentes
git worktree add ../hotfix-branch hotfix/correcao-urgente

# Submodules — repositório dentro de repositório
git submodule add git@github.com:usuario/lib.git libs/minha-lib
git submodule update --init --recursive
```

---

## 14. 💡 Boas Práticas

> **Commits pequenos e frequentes** são melhores que um commit gigante. Cada commit deve fazer exatamente uma coisa.

- **Nunca force-push em `main`** — use `--force-with-lease` em branches pessoais se necessário
- **Escreva mensagens descritivas** — "fix bug" não diz nada; "fix: valida CPF antes de salvar" sim
- **Não commite arquivos sensíveis** — use `.gitignore` desde o início
- **Prefira `git restore`** a `git checkout` para desfazer alterações (mais explícito)
- **Use `git stash`** antes de trocar de branch com trabalho inacabado
- **Revise com `git diff --staged`** antes de commitar
