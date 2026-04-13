# 🅰️ CI/CD para Angular

Pipeline completa para projetos Angular — do push ao deploy, passando por lint, testes, build e entrega nos ambientes de staging e produção.

---

## 1. 🗺️ Visão Geral da Pipeline

```
Push / PR
  │
  ├── 01. Checkout + Cache
  ├── 02. npm ci
  ├── 03. ng lint
  ├── 04. ng test (headless)
  ├── 05. ng build (production)
  ├── 06. Upload artifact
  │
  ├── [se branch develop] → Deploy Staging
  └── [se branch main]    → Deploy Produção (com aprovação)
```

---

## 2. 📦 Preparando o Projeto

### package.json — scripts necessários

```json
{
  "scripts": {
    "start":    "ng serve",
    "build":    "ng build",
    "build:prod": "ng build --configuration production",
    "test":     "ng test",
    "test:ci":  "ng test --no-watch --no-progress --browsers=ChromeHeadless",
    "lint":     "ng lint",
    "e2e":      "ng e2e"
  }
}
```

### angular.json — configuração de produção

```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kb",
          "maximumError": "1mb"
        }
      ],
      "outputHashing": "all",
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true
    }
  }
}
```

### karma.conf.js — testes no CI

```javascript
module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: true
  });
};
```

---

## 3. ⚙️ Pipeline Completa — VPS com Nginx

```yaml
# .github/workflows/ci-cd-angular.yml
name: CI/CD Angular

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  # ── JOB 1: Qualidade de código ──────────────────────────────────
  quality:
    name: Lint e Testes
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Testes unitários
        run: npm run test:ci

      - name: Upload cobertura de testes
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7

  # ── JOB 2: Build ────────────────────────────────────────────────
  build:
    name: Build de Produção
    runs-on: ubuntu-latest
    needs: quality

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Build
        run: npm run build:prod
        env:
          NODE_OPTIONS: '--max_old_space_size=4096'   # evita OOM em builds grandes

      - name: Upload artifact de build
        uses: actions/upload-artifact@v4
        with:
          name: angular-dist
          path: dist/
          retention-days: 1

  # ── JOB 3: Deploy Staging ───────────────────────────────────────
  deploy-staging:
    name: Deploy → Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.meusite.com.br

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: angular-dist
          path: dist/

      - name: Copiar build para VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          source: "dist/"
          target: "/var/www/staging"
          strip_components: 1

      - name: Recarregar Nginx
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            sudo nginx -t && sudo systemctl reload nginx
            echo "✅ Deploy staging concluído"

  # ── JOB 4: Deploy Produção ──────────────────────────────────────
  deploy-production:
    name: Deploy → Produção
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://meusite.com.br

    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: angular-dist
          path: dist/

      - name: Backup do build atual
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            BACKUP_DIR="/var/www/backup/$(date +%Y%m%d_%H%M%S)"
            mkdir -p "$BACKUP_DIR"
            cp -r /var/www/producao/. "$BACKUP_DIR/"
            echo "Backup criado em $BACKUP_DIR"

      - name: Copiar build para VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          source: "dist/"
          target: "/var/www/producao"
          strip_components: 1

      - name: Recarregar Nginx
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            sudo nginx -t && sudo systemctl reload nginx
            echo "✅ Deploy produção concluído — $(date)"
```

---

## 4. 🌐 Configuração do Nginx

```nginx
# /etc/nginx/sites-available/meusite.com.br
server {
    listen 80;
    server_name meusite.com.br www.meusite.com.br;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name meusite.com.br www.meusite.com.br;

    root /var/www/producao;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/meusite.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meusite.com.br/privkey.pem;

    # Compressão gzip
    gzip on;
    gzip_types text/plain application/javascript text/css application/json;
    gzip_min_length 1000;

    # Cache agressivo para assets com hash no nome (Angular outputHashing)
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # index.html nunca cacheado (SPA precisa sempre do mais recente)
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # SPA routing — todas as rotas voltam para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 5. 🔀 Variáveis de Ambiente por Ambiente

```typescript
// src/environments/environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  featureFlags: {
    novaTelaLogin: true
  }
};

// src/environments/environment.staging.ts
export const environment = {
  production: false,
  apiUrl: 'https://api-staging.meusite.com.br',
  featureFlags: {
    novaTelaLogin: true
  }
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.meusite.com.br',
  featureFlags: {
    novaTelaLogin: false
  }
};
```

```json
// angular.json — file replacements por ambiente
"configurations": {
  "staging": {
    "fileReplacements": [{
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.staging.ts"
    }]
  },
  "production": {
    "fileReplacements": [{
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }]
  }
}
```

```yaml
# No workflow, passar a configuração certa
- name: Build Staging
  run: ng build --configuration staging

- name: Build Produção
  run: ng build --configuration production
```

---

## 6. 📊 Análise de Bundle

```yaml
# Adicionar ao job de build para alertar sobre tamanho
- name: Analisar tamanho do bundle
  run: |
    DIST_SIZE=$(du -sh dist/ | cut -f1)
    echo "## 📦 Bundle Size: $DIST_SIZE" >> $GITHUB_STEP_SUMMARY

    # Verificar se main.js passou de 500kb
    MAIN_SIZE=$(find dist -name "main*.js" -exec du -k {} \; | cut -f1)
    if [ "$MAIN_SIZE" -gt 512 ]; then
      echo "⚠️ main.js está grande: ${MAIN_SIZE}kb" >> $GITHUB_STEP_SUMMARY
    fi
```

---

## 7. 💡 Boas Práticas

> **Nunca faça deploy de staging e produção com o mesmo job.** Ambientes são independentes — o que funciona em staging deve ser exatamente o que vai para produção (mesmo artifact).

- **Use `npm ci`** — garante que `package-lock.json` é respeitado
- **Ative o cache do npm** no `setup-node` — economiza 1-2 min por run
- **Sempre faça backup** antes de sobreescrever produção
- **Configure budgets** no `angular.json` — o build falha se o bundle crescer demais
- **Use `--max_old_space_size`** em projetos grandes para evitar out-of-memory no CI
- **Ambiente de produção com `Required reviewers`** — ninguém faz deploy acidental
