# ⚙️ GitHub Actions — Automação e CI/CD

O **GitHub Actions** é a plataforma de automação nativa do GitHub. Com ela você cria workflows que rodam em resposta a eventos do repositório — push, PR, agendamento, e muito mais. É onde vive o CI/CD do seu projeto.

---

## 1. 🧠 Conceitos Fundamentais

```
Evento (push, PR, schedule...)
  └── Workflow (.github/workflows/nome.yml)
        └── Job (roda em uma máquina virtual)
              └── Step (um comando ou uma Action)
```

| Conceito | Descrição |
|---------|-----------|
| **Workflow** | Arquivo YAML que define toda a automação |
| **Event** | O que dispara o workflow (push, PR, cron...) |
| **Job** | Conjunto de steps que rodam na mesma VM |
| **Step** | Um comando shell ou uma Action reutilizável |
| **Action** | Pacote reutilizável do Marketplace |
| **Runner** | Máquina virtual que executa o job |
| **Context** | Variáveis disponíveis (`${{ github.sha }}`, `${{ secrets.X }}`) |
| **Artifact** | Arquivo gerado pelo workflow (ex: build) |

---

## 2. 📁 Estrutura de um Workflow

```yaml
# .github/workflows/ci.yml

name: CI Pipeline                        # nome exibido no GitHub

on:                                      # eventos que disparam
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:                                     # variáveis globais do workflow
  NODE_VERSION: '20'

jobs:
  build:                                 # nome do job
    name: Build e Testes
    runs-on: ubuntu-latest               # runner

    steps:
      - name: Checkout do código
        uses: actions/checkout@v4        # action do marketplace

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci                      # comando shell

      - name: Rodar testes
        run: npm test

      - name: Build
        run: npm run build
```

---

## 3. ⚡ Eventos (Triggers)

```yaml
on:
  # Push em branches específicas
  push:
    branches: [main, develop]
    paths:                         # só dispara se esses arquivos mudarem
      - 'src/**'
      - 'package.json'

  # Pull Request
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

  # Agendamento (cron)
  schedule:
    - cron: '0 6 * * 1-5'        # 6h de seg a sex (UTC)

  # Disparo manual pela interface
  workflow_dispatch:
    inputs:
      ambiente:
        description: 'Ambiente de deploy'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]

  # Disparado por outro workflow
  workflow_call:
    inputs:
      versao:
        type: string
        required: true
```

---

## 4. 🏃 Runners

```yaml
jobs:
  exemplo:
    runs-on: ubuntu-latest     # Linux (mais comum e gratuito)
    # runs-on: windows-latest  # Windows
    # runs-on: macos-latest    # macOS

    # Matrix — rodar o mesmo job em múltiplas configs
  testes:
    strategy:
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

---

## 5. 🔗 Dependência entre Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  test:
    needs: build            # só roda após build passar
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy para staging"

  deploy-prod:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'    # só em push na main
    environment: production                 # requer aprovação manual
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy para produção"
```

---

## 6. 💾 Cache de Dependências

Cache reduz drasticamente o tempo de execução:

```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-

# Para Maven (Java)
- name: Cache Maven
  uses: actions/cache@v4
  with:
    path: ~/.m2/repository
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
    restore-keys: |
      ${{ runner.os }}-maven-

# Forma simplificada com setup-node (já inclui cache)
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # ou 'yarn' ou 'pnpm'
```

---

## 7. 📤 Artifacts

Artifacts persistem arquivos entre jobs ou para download:

```yaml
jobs:
  build:
    steps:
      - run: npm run build

      - name: Upload artifact de build
        uses: actions/upload-artifact@v4
        with:
          name: dist-build
          path: dist/
          retention-days: 7

  deploy:
    needs: build
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: dist-build
          path: dist/

      - name: Deploy
        run: |
          ls dist/
          # ... lógica de deploy
```

---

## 8. 🔐 Secrets e Variáveis

```yaml
jobs:
  deploy:
    steps:
      # Acessar secret
      - name: Deploy via SSH
        run: ssh usuario@${{ secrets.VPS_HOST }} "cd /app && git pull"
        env:
          SSH_KEY: ${{ secrets.SSH_PRIVATE_KEY }}

      # Acessar variável (não sensível)
      - name: Info do ambiente
        run: echo "Ambiente: ${{ vars.APP_ENV }}"

      # Contexto do GitHub
      - name: Info do commit
        run: |
          echo "Branch: ${{ github.ref_name }}"
          echo "SHA: ${{ github.sha }}"
          echo "Actor: ${{ github.actor }}"
          echo "Repo: ${{ github.repository }}"
```

---

## 9. 🌍 Environments — Controle de Deploy

Configure em **Settings → Environments**:

```yaml
jobs:
  deploy-staging:
    environment: staging        # usa secrets do ambiente staging
    runs-on: ubuntu-latest

  deploy-production:
    environment:
      name: production
      url: https://meusite.com.br    # link exibido no GitHub
    runs-on: ubuntu-latest
    # Se o ambiente tiver "Required reviewers", vai pausar aqui
    # e aguardar aprovação manual antes de continuar
```

---

## 10. 🔁 Expressions e Condicionais

```yaml
steps:
  # Rodar só em push na main
  - if: github.ref == 'refs/heads/main'
    run: echo "Estou na main!"

  # Rodar só se step anterior falhou
  - if: failure()
    name: Notificar falha
    run: echo "Pipeline falhou"

  # Rodar sempre, mesmo com falha
  - if: always()
    name: Relatório final
    run: echo "Pipeline encerrada"

  # Expressão com variável
  - if: ${{ inputs.ambiente == 'production' }}
    run: echo "Deploying to production"
```

---

## 11. 🔔 Notificações

```yaml
# Notificação no Slack em caso de falha
- name: Notificar Slack
  if: failure()
  uses: slackapi/slack-github-action@v1.27
  with:
    payload: |
      {
        "text": "❌ Pipeline falhou em *${{ github.repository }}*\nBranch: ${{ github.ref_name }}\nCommit: ${{ github.sha }}\nAutor: ${{ github.actor }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 12. 🔄 Workflow Reutilizável

Evita duplicação entre repositórios:

```yaml
# .github/workflows/reusable-deploy.yml
on:
  workflow_call:
    inputs:
      ambiente:
        required: true
        type: string
    secrets:
      VPS_HOST:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.ambiente }}"
```

```yaml
# Usar em outro workflow
jobs:
  deploy:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      ambiente: production
    secrets:
      VPS_HOST: ${{ secrets.VPS_HOST }}
```

---

## 13. 📋 Actions Essenciais do Marketplace

| Action | Versão | Para que serve |
|--------|--------|---------------|
| `actions/checkout` | v4 | Clonar o repositório |
| `actions/setup-node` | v4 | Configurar Node.js |
| `actions/setup-java` | v4 | Configurar Java/Maven |
| `actions/cache` | v4 | Cache de dependências |
| `actions/upload-artifact` | v4 | Upload de arquivos |
| `actions/download-artifact` | v4 | Download de arquivos |
| `docker/build-push-action` | v6 | Build e push Docker |
| `appleboy/ssh-action` | v1 | Executar comandos SSH |
| `appleboy/scp-action` | v0.1 | Copiar arquivos via SCP |

---

## 14. 💡 Boas Práticas

> **Fixe versões das Actions** com SHA em produção: `actions/checkout@abc1234`. Versões com tag (`@v4`) podem ser alteradas — SHA garante imutabilidade.

- **Use `npm ci`** em vez de `npm install` em CI — é mais rápido e determinístico
- **Sempre faça cache** das dependências — economiza minutos por run
- **Separe jobs** — build, test e deploy em jobs distintos com `needs:`
- **Use environments** para staging/production com aprovação manual obrigatória
- **Monitore custos** — GitHub Actions tem limite de minutos gratuitos por mês
- **Use `paths:` no trigger** para não rodar CI quando só a documentação mudou
