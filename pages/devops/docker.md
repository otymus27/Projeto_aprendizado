# 🐳 Guia Completo e Avançado no Docker

O **Docker** revolucionou a maneira como entregamos e rodamos sistemas. Em vez de se preocupar com conflitos de versão entre o servidor e sua máquina ("na minha máquina funciona"), o Docker isola a aplicação inteira em um **contêiner**.

---

## 1. 🎯 O que é o Docker

O Docker é uma plataforma de conteinerização que permite empacotar aplicações e suas dependências em **containers**. Esses containers podem ser executados de forma consistente em diferentes ambientes, como:

- máquina local
- servidor Linux
- VPS
- cloud
- pipelines de CI/CD

Com Docker, você consegue:
- padronizar ambientes
- facilitar deploy
- isolar aplicações
- subir serviços rapidamente
- testar localmente com mais consistência
- trabalhar com microsserviços e stacks completas

---

## 2. 🧠 Conceitos fundamentais

Antes dos comandos, é importante entender alguns conceitos chaves:

### 💿 Imagem
Uma imagem é o molde usado para criar containers (como a planta de uma casa).
Exemplo: `nginx`, `mysql`, `openjdk`, `node`.

### 📦 Container
É a instância "viva" e em execução de uma imagem (a casa construída).

### 💾 Volume
É usado para persistir dados fora do container (como o seu banco de dados). Se o container for apagado, os dados do volume continuam intactos.

### 🌐 Rede
Permite comunicação entre vários containers e com a porta principal do Host.

### 📜 Dockerfile
Arquivo de "receita de bolo" usado para definir como a sua própria imagem personalizada será criada.

### 🐙 Docker Compose
Orquestrador que sobe múltiplos serviços (ex: PHP + Nginx + MySQL + Redis) com um único arquivo YAML.

---

## 3. 🔍 Verificando instalação

### Ver versão do Docker
\`\`\`bash
docker --version
\`\`\`

### Ver versão do Compose
\`\`\`bash
docker compose version
\`\`\`

### Testar instalação inicial
\`\`\`bash
docker run hello-world
\`\`\`

---

## 4. 🖼️ Comandos básicos de Imagens

### Listar imagens locais ocupando espaço no HD
\`\`\`bash
docker images
# Ou: docker image ls
\`\`\`

### Baixar uma imagem da internet
\`\`\`bash
docker pull nginx
docker pull mysql:8.0   # Baixa versão específica
\`\`\`

### Remover (Excluir) imagem
\`\`\`bash
docker rmi nginx
docker rmi -f nginx     # Remove forçado
\`\`\`

---

## 5. 🚀 Comandos básicos de Containers

### Criar e executar container
\`\`\`bash
docker run nginx
\`\`\`

### Executar em segundo plano silencioso (Detached)
\`\`\`bash
docker run -d nginx
\`\`\`

### Dar nome ao container (muito útil)
\`\`\`bash
docker run -d --name meu-nginx nginx
\`\`\`

### Mapear porta (Expor na internet)
\`\`\`bash
docker run -d --name meu-nginx -p 8080:80 nginx   # O Host no 8080 aponta pro 80 de dentro do container
\`\`\`

### Passar variável de ambiente (-e)
\`\`\`bash
docker run -d --name meu-mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
\`\`\`

### Montar volume de dados (-v)
\`\`\`bash
docker run -d -v meus_dados:/var/lib/mysql mysql:8.0
\`\`\`

### Executar terminal interativo (Entrar dentro do Linux daquela imagem)
\`\`\`bash
docker run -it ubuntu bash
\`\`\`

---

## 6. 📋 Listando containers em execução

### Ver apenas quem está "ligado" e trabalhando
\`\`\`bash
docker ps
\`\`\`

### Ver ABSOLUTAMENTE TODOS (incluindo os falhos e desligados)
\`\`\`bash
docker ps -a
\`\`\`

---

## 7. ⏱️ Iniciar, parar e reiniciar

\`\`\`bash
docker stop meu-nginx       # Parar
docker start meu-nginx      # Ligar o que tava parado
docker restart meu-nginx    # Reiniciar "no soco"
docker pause meu-nginx      # Congelar o tempo do container
docker unpause meu-nginx    # Descongelar
\`\`\`

---

## 8. 🗑️ Removendo containers

\`\`\`bash
docker rm meu-nginx                      # Remove apenas se já estiver desligado
docker rm -f meu-nginx                   # Obliterar. Desliga e remove na hora.
docker rm container1 container2 abc3     # Remove de lote
\`\`\`

---

## 9. 🩺 Logs e Inspeção de "Saúde"

### Ver as saídas (Logs)
\`\`\`bash
docker logs meu-nginx
docker logs -f meu-nginx                 # Acompanha ao vivo (Follow)
docker logs --tail 100 meu-nginx         # Pega só as recentes para arquivos gigantes
\`\`\`

### Detalhes profundos (IP interno, volumes atachados, status)
\`\`\`bash
docker inspect meu-nginx
\`\`\`

### Ver uso de RAM, CPU e Rede ao vivo
\`\`\`bash
docker stats
docker stats meu-nginx
\`\`\`

---

## 10. 🚪 Entrando em um container vivo

\`\`\`bash
# Abrir o bash linux dentro de um container rodando
docker exec -it meu-nginx bash

# Se ele for alpine e não tiver bash, use o sh genérico
docker exec -it meu-nginx sh

# Executar um comando único sem precisar abrir a tela
docker exec meu-nginx ls /usr/share/nginx/html
\`\`\`

---

## 11. 🔄 Transferência (Copiando arquivos)

Como mandar um arquivo sem precisar FTP do seu PC pro container e vice versa?

\`\`\`bash
# Copiar do PC pro Container
docker cp index.html meu-nginx:/usr/share/nginx/html/index.html

# Copiar de dentro do Container vazado pro PC Host:
docker cp meu-nginx:/etc/nginx/nginx.conf .
\`\`\`

---

## 12. 💾 Trabalhando com Volumes

\`\`\`bash
docker volume ls                     # Lista de cofres de dados
docker volume create meus_dados      # Criar cofre
docker volume inspect meus_dados     # Ver detalhes
docker volume rm meus_dados          # Deletar cofre apagando todos os dados
docker volume prune                  # Deleta todos os cofres soltos e não usados!
\`\`\`

---

## 13. 🕸️ Redes (Networks)

Bancos de dados só aceitam conexões de sua própria rede local interna pra prevenir ataques.

\`\`\`bash
docker network ls
docker network create minha_rede
docker network inspect minha_rede
docker network rm minha_rede

# Subir um container já atrelado a sua rede de backend
docker run -d --name app --network minha_rede nginx

# Acoplar ou desacoplar container com o bonde andando
docker network connect minha_rede app
docker network disconnect minha_rede app
\`\`\`

---

## 14. 🧹 Faxina Absoluta (Atenção com isso!)

\`\`\`bash
docker container prune               # Limpa conteineres mortos
docker image prune                   # Limpa imagens sem nome
docker system prune                  # A clássica vassoura global (limpa muito cache util)

# CUIDADO: Destrói tudo do seu Docker que não está vivo nesse milissegundo (Volumes inclusos)
docker system prune -a --volumes     
\`\`\`

---

## 15. 📜 Trabalhando com Dockerfile

### Estrutura básica
\`\`\`dockerfile
FROM nginx:latest
COPY . /usr/share/nginx/html
EXPOSE 80
\`\`\`

### Realizar o Build (Construir sua Imagem)
\`\`\`bash
docker build -t meu-site .
docker build -t meu-site:1.0 .   # Utilizando uma "Tag" de versão
docker images                    # Para ver a imagem nova que você acabou de gerar
\`\`\`

### Rodar imagem criada
\`\`\`bash
docker run -d -p 8080:80 meu-site:1.0
\`\`\`

---

## 16. 🏗️ Build Avançado

\`\`\`bash
# Forçar que ele baixe tudo de novo sem usar o famoso cache que buga entregas
docker build --no-cache -t minha-app .

# Se o arquivo não se chamar "Dockerfile"
docker build -f Dockerfile.prod -t minha-app-prod .

# Build passando argumento de tempo de construção
# No Dockerfile: ARG APP_ENV=dev
docker build --build-arg APP_ENV=prod -t minha-app .
\`\`\`

---

## 17. 📦 Exportação de Imagens Física (Sem Nuvem)

\`\`\`bash
# Enviar o projeto num pen-drive como arquivo TAR 
docker save -o nginx.tar nginx

# Receber arquivo TAR do seu amigo e colocar direto no coração do seu Docker
docker load -i nginx.tar
\`\`\`

---

## 18. ☁️ Docker Hub & Repositórios

\`\`\`bash
docker login                                     # Autentica. (Senha não digita no terminal)
docker tag minha-app usuario/minha-app:1.0       # Tagueia a placa pra informar o remetente oficial
docker push usuario/minha-app:1.0                # Empurra pro GitHub das Imagens 
docker pull usuario/minha-app:1.0                # Outros baixam remotamente
\`\`\`

---

## 19. 🐙 Docker Compose

A arma maestra. Subir múltiplos containers usando um `compose.yaml` conectando todos eles.

### Exemplo Básico (`compose.yaml`)
\`\`\`yaml
services:
  app:
    image: nginx
    container_name: meu-nginx
    ports:
      - "8080:80"
\`\`\`

### Comandos Compose
\`\`\`bash
docker compose up               # Sobe o palco inteiro travando o terminal
docker compose up -d            # Sobe em segundo plano (Detached) - O mais usado!
docker compose down             # Derruba os containers e as redes internas
docker compose down -v          # PERIGOSO. Derruba apagando também os Cofres de Volume!
docker compose ps               # Lista
docker compose logs -f          # Consola todos os logs juntos, ao vivo.
docker compose up --build       # Se você mexeu no código, use para regerar a imagem de build local!
docker compose stop / start     # Congela ou acorda as coisas sem destruir as redes internas
\`\`\`

---

## 20. 👨‍💻 Exemplo Real: Aplicação com Banco de Dados

\`\`\`yaml
services:
  api:
    build: ./backend
    container_name: minha-api
    ports:
      - "8080:8080"
    env_file:
      - .env
    depends_on:
      - mysql
    networks:
      - app_net

  mysql:
    image: mysql:8.0
    container_name: meu-mysql
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: sistema
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app_net

volumes:
  mysql_data:

networks:
  app_net:
\`\`\`

---

## 21. 🔐 Variáveis de Ambiente

### Passando diretamente no RUN
\`\`\`bash
docker run -e APP_ENV=prod minha-app
\`\`\`

### Usando o poder do arquivo `.env`
O Compose suga as configs de `.env` que ficam fora do seu git e mantém seus segredos.
\`\`\`env
# arquivo .env
APP_ENV=prod
DB_PASSWORD=senha_ultra_secreta_aqui
\`\`\`

\`\`\`yaml
env_file:
  - .env
\`\`\`

---

## 22. ♻️ Auto-Restart (Reinício Automático)

Isso salva a vida de DevOps se as VPS resetarem as 3h da manhã.
\`\`\`bash
# unless-stopped -> "Suba sempre no Boot com exceção de se eu tiver te matado (stop) manualmente"
docker run -d --restart unless-stopped nginx
\`\`\`

**Outras opções:**
- `no`
- `always`
- `on-failure`

No Compose:
\`\`\`yaml
restart: unless-stopped
\`\`\`

---

## 23. 🧯 Troubleshooting Profundo

\`\`\`bash
docker port nome_container              # Exibe todas as rotas de porta vazadas pra internet
docker events                           # Sistema de audit trail de eventos submersos do mestre
docker history nginx                    # Exibe toda a pilha de camada que construiu a Imagem Nginx
\`\`\`

---

## 24. 🦾 Execução Destrutiva Loteada (Batch)

> **Aviso:** Comandos fortíssimos. Misturam um "Get List" dentro do comando.

\`\`\`bash
docker stop $(docker ps -q)             # Para todos os containers vivos simultaneamente
docker rm $(docker ps -aq)              # Remove TODOS os containers criados
docker rmi $(docker images -q)          # Apaga do HD todas as imagens baixadas
\`\`\`

---

## 25. 🤔 Imagem vs Container vs Volume - A Prova de Fogo!

- **Imagem**: É o disco físico Matrix que define o universo.
- **Container**: É a realidade Matrix em andamento rodando sobre a sua RAM.
- **Volume**: É a gaveta da dimensão real que você pluga no container para guardar as tabelas que ele gera (pra não expurgar com a destruição da Matrix).

---

## 26. ✅ Melhores Práticas Gerais (DevOps Ouro)

1. **Use imagens Oficiais:** Sinalzinho azul no DockerHub. Não baixe banco de dados do usuário *`super.hacker007/mysql`*.
2. **Defina Versões:** Evite a tag `latest` na hora do deploy em PROD. `mysql:latest` hoje quebra o de amanhã. Use cravado ex: `mysql:8.0.32`.
3. **Senhas no Compose:** Só coloque senhas raw no Compose em Dev. Em Prod, injete o segredo de uma forma criptografada ou pelo `.env`.
4. **.dockerignore:** Sempre use assim como gitignore. Evita copiar 200MB de Pasta Ninja `node_modules` para dentro de um build falho.

---

## 27. 📄 Exemplo `.dockerignore` Elegante

\`\`\`text
node_modules
dist
target
.git
.gitignore
Dockerfile
docker-compose.yml
*.log
\`\`\`

---

## 28. 👩‍💻 Comandos úteis no Desenvolvimento Bruto

### Rodar um container, fuçar dentro, e ele explodir sozinho quando você sair do bash:
\`\`\`bash
docker run --rm -it ubuntu bash
\`\`\`

### Montar pasta do Programador pra Refletir a Alteração no Momento dentro do Container
Isso permite você programar em seu VSCode Web/Windows e o container absorver instantaneamente sem "re-buildar"!
\`\`\`bash
docker run -it -v $(pwd):/app node:20 bash
\`\`\`

### Definir o "working dir" base de comando base logo na chamada inicial
\`\`\`bash
docker run -it -v $(pwd):/app -w /app node:20 bash
\`\`\`

---

## 29. 🗄️ Subindo Bancos de Dados Local Rapidamente

### Subir PostgreSQL
\`\`\`bash
docker run -d \
  --name pg-db \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=appdb \
  -p 5432:5432 \
  -v pg_data:/var/lib/postgresql/data \
  postgres:16
\`\`\`

---

## 30. ⚖️ Medindo Tamanho e Uso

\`\`\`bash
docker system df                        # O mais seguro e vital: Quanto GB o Docker mestre tá comendo 
docker system df -v                     # Detalhadíssimo
\`\`\`

---

## 31. 💥 Erros Comuns e Socorros Inadiáveis

### "address already in use" ou "Porta 8080 já alocada"
**Problema:** Você tentou ligar um container nginx mapeando o `-p 8080:80`, mas você JÁ tem um host excalidraw logado com o `8080` (Aconteceu com você hoje!)
**Cura:** Encontre o culpado `netstat -tulpn` e/ou mude seu docker compose atual para `-p 8081:80`.

### "Container inicia, pisca e Some / Morre instantaneamente"
**Cura:** Se um container de App for ligado sem variável obrigatória (ou se o banco falhar conexão e ele der loop error), ele fará Exit Code (1). Verifique o funeral pra ver quem apunhalhou pelas costas:
\`\`\`bash
docker logs nome_container
\`\`\`

### "Cadê minha base que eu instalei nas últimas 3 semanas?"
**Problema:** Você atualizou a versão do DB, deu down, e sumiu com a Tabela Usuários.
**Cura:** 99% das vezes o problema é apenas do Volume Desaparecido ou não *Attachado*. Em `docker inspect` confirme se a pasta correta (`mysql_data:/var/lib/mysql/`) estava configurada sem Erros Ortográficos na Yaml!

---

> Lembre-se, orquestrar é uma arte. Quando você começar a achar que o Compose tá engessado e que precisa de mais máquinas gerindo juntas o sistema do `docker ps`, isso significa que o seu cérebro e seu negócio estão prontos para ascender ao **KUBERNETES**. Mas até lá: O Docker Swarm e Compose são o Panteão do Linux Moderno.
