# ☕ CI/CD para Spring Boot

Pipeline completa para projetos Spring Boot — build com Maven, testes, geração de imagem Docker e deploy para VPS com zero downtime.

---

## 1. 🗺️ Visão Geral da Pipeline

```
Push / PR
  │
  ├── 01. Checkout + Cache Maven
  ├── 02. mvn verify (compila + testa)
  ├── 03. Análise de cobertura (JaCoCo)
  ├── 04. Build do JAR
  ├── 05. Build da imagem Docker
  ├── 06. Push para Container Registry
  │
  ├── [se branch develop] → Deploy Staging
  └── [se branch main]    → Deploy Produção (com aprovação)
```

---

## 2. 📦 Preparando o Projeto

### pom.xml — configurações essenciais para CI

```xml
<project>
  <properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <!-- Spring Boot Maven Plugin — gera JAR executável -->
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <layers>
            <enabled>true</enabled>   <!-- layers melhoram o cache Docker -->
          </layers>
        </configuration>
      </plugin>

      <!-- JaCoCo — cobertura de testes -->
      <plugin>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <version>0.8.11</version>
        <executions>
          <execution>
            <goals><goal>prepare-agent</goal></goals>
          </execution>
          <execution>
            <id>report</id>
            <phase>test</phase>
            <goals><goal>report</goal></goals>
          </execution>
          <execution>
            <id>check</id>
            <goals><goal>check</goal></goals>
            <configuration>
              <rules>
                <rule>
                  <limits>
                    <!-- Falha o build se cobertura < 70% -->
                    <limit>
                      <counter>LINE</counter>
                      <value>COVEREDRATIO</value>
                      <minimum>0.70</minimum>
                    </limit>
                  </limits>
                </rule>
              </rules>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

---

## 3. 🐳 Dockerfile Otimizado

```dockerfile
# Usa layers do Spring Boot para cache eficiente
FROM eclipse-temurin:21-jre-alpine AS base
WORKDIR /app

# Layer extractor
FROM base AS builder
COPY target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Imagem final com layers separadas (melhor cache no Docker)
FROM base
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

# Usuário não-root (segurança)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

---

## 4. ⚙️ Pipeline Completa — Docker + VPS

```yaml
# .github/workflows/ci-cd-springboot.yml
name: CI/CD Spring Boot

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  JAVA_VERSION: '21'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ── JOB 1: Testes e qualidade ───────────────────────────────────
  test:
    name: Testes e Cobertura
    runs-on: ubuntu-latest

    services:
      # Banco de dados para testes de integração
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Testes + Cobertura
        run: mvn verify -B
        env:
          SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/testdb
          SPRING_DATASOURCE_USERNAME: test
          SPRING_DATASOURCE_PASSWORD: test
          SPRING_PROFILES_ACTIVE: test

      - name: Upload relatório de cobertura
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: jacoco-report
          path: target/site/jacoco/
          retention-days: 7

  # ── JOB 2: Build Docker ─────────────────────────────────────────
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    permissions:
      contents: read
      packages: write

    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.push.outputs.digest }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          java-version: ${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Build do JAR (sem testes — já rodaram)
        run: mvn package -DskipTests -B

      - name: Login no GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extrair metadata para Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix={{branch}}-
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build e Push da imagem
        id: push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ── JOB 3: Deploy Staging ───────────────────────────────────────
  deploy-staging:
    name: Deploy → Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging-api.meusite.com.br

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            export HOME=$(getent passwd $(whoami) | cut -d: -f6)

            # Login no registry
            echo ${{ secrets.GITHUB_TOKEN }} | \
              docker login ghcr.io -u ${{ github.actor }} --password-stdin

            # Pull da nova imagem
            docker pull ghcr.io/${{ github.repository }}:develop

            # Subir com zero downtime
            cd /opt/apps/staging
            docker compose pull
            docker compose up -d --remove-orphans

            # Healthcheck
            sleep 15
            curl -f http://localhost:8081/actuator/health || exit 1
            echo "✅ Staging online"

  # ── JOB 4: Deploy Produção ──────────────────────────────────────
  deploy-production:
    name: Deploy → Produção
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://api.meusite.com.br

    steps:
      - name: Deploy com zero downtime
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          password: ${{ secrets.VPS_PASSWORD }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            export HOME=$(getent passwd $(whoami) | cut -d: -f6)
            set -e   # abortar em qualquer erro

            # Login no registry
            echo ${{ secrets.GITHUB_TOKEN }} | \
              docker login ghcr.io -u ${{ github.actor }} --password-stdin

            # Pull da nova imagem
            docker pull ghcr.io/${{ github.repository }}:latest

            cd /opt/apps/producao

            # Blue-Green: salvar imagem antiga para rollback
            OLD_IMAGE=$(docker compose images -q app)
            echo "$OLD_IMAGE" > /tmp/previous-image.txt

            # Subir nova versão
            docker compose pull
            docker compose up -d --remove-orphans

            # Aguardar healthcheck
            echo "Aguardando aplicação subir..."
            for i in $(seq 1 12); do
              if curl -sf http://localhost:8080/actuator/health | grep -q '"UP"'; then
                echo "✅ Produção online após ${i}x10s"
                break
              fi
              if [ $i -eq 12 ]; then
                echo "❌ Healthcheck falhou — iniciando rollback"
                docker compose down
                PREV=$(cat /tmp/previous-image.txt)
                docker tag "$PREV" app:rollback
                docker compose up -d
                exit 1
              fi
              sleep 10
            done

            # Limpeza de imagens antigas
            docker image prune -f
            echo "Deploy finalizado: $(date)"
```

---

## 5. 🐳 Docker Compose na VPS

```yaml
# /opt/apps/producao/docker-compose.yml
services:
  app:
    image: ghcr.io/usuario/meu-projeto:latest
    container_name: springboot-app
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: production
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/proddb
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    container_name: postgres-prod
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: proddb
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      retries: 5

volumes:
  postgres_data:
```

---

## 6. 🌍 Profiles do Spring Boot

```yaml
# src/main/resources/application.yml (base)
spring:
  application:
    name: meu-projeto

# src/main/resources/application-test.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;MODE=PostgreSQL
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop

# src/main/resources/application-production.yml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate       # nunca create/update em produção!
    show-sql: false

management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: never      # não expor detalhes de saúde externamente
```

---

## 7. 🔒 Nginx como Proxy Reverso

```nginx
# /etc/nginx/sites-available/api.meusite.com.br
server {
    listen 80;
    server_name api.meusite.com.br;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.meusite.com.br;

    ssl_certificate     /etc/letsencrypt/live/api.meusite.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.meusite.com.br/privkey.pem;

    # Bloquear acesso ao Actuator externamente
    location /actuator {
        deny all;
    }

    location / {
        proxy_pass         http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 10s;
        proxy_read_timeout    60s;
    }
}
```

---

## 8. 🔄 Rollback Manual

```bash
# Ver imagens disponíveis
docker images ghcr.io/usuario/meu-projeto

# Fazer rollback para versão específica
cd /opt/apps/producao
docker compose down

# Editar docker-compose.yml trocando :latest por :main-abc1234
# ou usar tag específica:
docker tag ghcr.io/usuario/meu-projeto:main-abc1234 \
           ghcr.io/usuario/meu-projeto:latest

docker compose up -d

# Verificar
curl http://localhost:8080/actuator/health
```

---

## 9. 💡 Boas Práticas

> **Nunca use `ddl-auto: create` ou `update` em produção.** Use Flyway ou Liquibase para migrações de banco controladas.

- **Testes de integração com banco real** — use o `services:` do GitHub Actions com PostgreSQL/MySQL
- **Healthcheck obrigatório no deploy** — nunca considere o deploy bem-sucedido sem validar o endpoint `/actuator/health`
- **Salve a imagem anterior antes de subir a nova** — facilita rollback em < 30 segundos
- **Use layers no Docker** — o `spring-boot-maven-plugin` com `<layers>true</layers>` reduz rebuild de imagem de ~1min para ~10s
- **Bloqueie o Actuator no Nginx** — nunca exponha `/actuator/env` ou `/actuator/beans` publicamente
- **Use `set -e` no script SSH** — qualquer erro aborta o deploy imediatamente
