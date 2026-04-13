# 🌐 Guia Completo do Nginx — Do Básico ao Avançado

O **Nginx** é um servidor web de alto desempenho. Em ambientes modernos, ele é essencial para orquestrar o tráfego da internet até as suas aplicações em containers ou código nativo.

## 1. 🤔 O que é o Nginx

Muito usado para:
- servir sites estáticos
- atuar como **reverse proxy**
- fazer **balanceamento de carga**
- centralizar conexões **HTTPS / TLS** (Criptografia)
- cachear conteúdo para performance
- encaminhar requisições blindadas para aplicações como Node.js, PHP-FPM, Spring Boot ou containers Docker.

---

## 2. 🎯 Principais usos do Nginx

### Servidor web
Entrega arquivos puros HTML, CSS, JS e imagens direto do HD para o navegador de forma estupidamente rápida.

### Reverse Proxy (A Muralha)
Recebe a requisição do cliente da internet no porto 80 e encaminha para outro serviço trancado internamente na porta 8080. O cliente nunca fura direto para sua aplicação.

### Load Balancer
Distribui milhares de caixas chegando entre múltiplos clones da aplicação rodando na máquina.

### Gateway HTTPS
Tira do seu backend em JS/Java a responsabilidade de descriptografar certificados de segurança (SSL). O Nginx faz a matemática pesada na frente.

---

## 3. 📦 Instalação no Ubuntu

\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx -y

# Mágica de serviços
sudo systemctl status nginx         # Verifica Saúde
sudo systemctl start nginx          # Liga
sudo systemctl enable nginx         # Configura pra ligar no Boot da Máquina!
sudo systemctl restart nginx        # Dá Reset
sudo systemctl reload nginx         # Recarrega a Configuração SEM derrubar clientes logados!
\`\`\`

---

## 4. 🛠️ Comandos mais usados no dia a dia

\`\`\`bash
nginx -v                     # Versão
nginx -V                     # Versão hiper detalhada com compiladores
sudo nginx -t                # TESTA SUA SINTAXE. *Sempre rode antes de dar reload pra não derrubar sua empresa!*
sudo nginx -s reload         # Recarrega arquivos alterados suavemente
sudo nginx -s stop           # Desliga abruptamente
sudo nginx -s quit           # Espera os clientes terminarem e desliga
\`\`\`

---

## 5. 🗂️ Estrutura padrão no Ubuntu

\`\`\`text
/etc/nginx/
├── nginx.conf                 # O Coração do monstro. Lê todos os outros aqui dentro.
├── sites-available/           # Gaveta de sites instalados na sua VPS
├── sites-enabled/             # Gaveta de sites LIGADOS na internet agora
├── conf.d/                    # Configurações globais modulares
\`\`\`

Arquivos VITAIS do sistema:
- Logs Nginx: `/var/log/nginx/access.log` e `/error.log`
- Conteúdo raiz web no Linux: `/var/www/html`

---

## 6. 🦴 Estrutura básica do arquivo nginx.conf

\`\`\`nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
\`\`\`

---

## 7. 📄 Primeiro site estático

\`\`\`nginx
server {
    listen 80;
    server_name meusite.com www.meusite.com;

    root /var/www/meusite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
\`\`\`

\`\`\`bash
# Como injetar o HTML?
sudo mkdir -p /var/www/meusite
echo "<h1>Site Nginx Ativo!</h1>" | sudo tee /var/www/meusite/index.html
\`\`\`

---

## 8. 🔌 Ativando site no Ubuntu com Symlinks

\`\`\`bash
# 1. Crie o arquivo no available
sudo nano /etc/nginx/sites-available/meusite

# 2. Crie a Corda Magnética (Link Simbólico) pro enabled
sudo ln -s /etc/nginx/sites-available/meusite /etc/nginx/sites-enabled/

# 3. Teste para ver se tem erro sintático
sudo nginx -t

# 4. Acione no Nginx
sudo systemctl reload nginx
\`\`\`

*(Para remover da web: `sudo rm /etc/nginx/sites-enabled/meusite`)*

---

## 9. 🛡️ Site padrão e Server_Name BlackHole

### Server_name normal
\`\`\`nginx
server {
    listen 80;
    server_name exemplo.com;
    root /var/www/exemplo;
}
\`\`\`

### Buraco Negro (Bloquear IPs que acessam seu Servidor direto em vez do Domínio)
\`\`\`nginx
server {
    listen 80 default_server;
    server_name _;
    return 444;   # Nginx fecha a conexão sem enviar nenhum cabeçalho de resposta.
}
\`\`\`

---

## 10. `root` x `alias` (A PEGADINHA CLÁSSICA)

### `root` (Concatena)
\`\`\`nginx
location /imagens/ {
    root /var/www/site;
}
\`\`\`
O Nginx procura em `/var/www/site/imagens/logo.png`.

### `alias` (Substitui)
\`\`\`nginx
location /imagens/ {
    alias /var/www/arquivos/;
}
\`\`\`
O Nginx aponta para `/var/www/arquivos/logo.png`. Não concatena o '/imagens'.

---

## 11. 🔄 SPA: Index, try_files e React/Angular

Em sistemas puramente Client-Side (React, Vue), o Nginx precisa jogar rotas quebradas pro HTML tratar, do contrário ele dará `Erro 404`.

\`\`\`nginx
server {
    listen 80;
    server_name app.exemplo.com;

    root /var/www/frontend;
    index index.html;

    location / {
        # O Ponto de Magia. Tenta o arquivo, se não existe tenta a pasta, se não, repassa o bastão fatalmente pro Javascript do index.
        try_files $uri $uri/ /index.html;
    }
}
\`\`\`
*Isso conserta a rota `/login`, `/dashboard` etc...*

---

## 12. 🧱 Reverse Proxy - O Guardião

Você não expõe o Backend do Java ou Node para a rua. Esconde ele atrás da Muralha (Nginx).

\`\`\`text
[Cliente] -> [Nginx (SSL)] -> [Aplicação Node.js na porta oculta 8080]
\`\`\`

\`\`\`nginx
server {
    listen 80;
    server_name api.exemplo.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        
        # Enviar identidade real do usúario pra dentro do Node.js, senão ele vai achar que toos os acessos vem de '127.0.0.1' na view dele.
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

---

## 13. 🔪 Cuidado com Proxy_Pass e Barra Final

Uma única barra quebra toda a sua API:

\`\`\`nginx
# Reescreve o caminho para a raiz do Node interno (Corte Mortal)
location /api/ {
    proxy_pass http://127.0.0.1:8080/; 
}

# Repassa exato. Mantém o caminho original /api
location /api/ {
    proxy_pass http://127.0.0.1:8080; 
}
\`\`\`

---

## 14. 🔌 O terror dos WebSockets

Sem passar o upgrade de Header explicitamento, os chats realtime e paineis Socket.io desconectam sozinhos ou caem pelo Nginx tentando "limpar" a porta.

\`\`\`nginx
location /ws/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
\`\`\`

---

## 15. 🐘 PHP com FPM (Apache Killer)

Diferente do Apache antigo sujo que processava PHP nativo, o Nginx é foda porque é purista e terceiriza para o módulo veloz FPM:

\`\`\`nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
}
\`\`\`

---

## 16. 🩺 Níveis de Erros de LOG

\`\`\`nginx
access_log /var/log/nginx/meusite_access.log;
error_log  /var/log/nginx/meusite_error.log warn;
\`\`\`

Hierarquia do menos ao mais caótico:
`debug` > `info` > `notice` > `warn` > `error` > `crit`

---

## 17. 🔒 HTTPS / SSL e Certbot Perfeito

Em 2026 HTTP puro já assusta clientes e SEO.
\`\`\`nginx
# Redirecionando TUDO de HTTP pra buraco quente HTTPS
server {
    listen 80;
    server_name exemplo.com;
    return 301 https://$host$request_uri;
}
\`\`\`

**O Let's Encrypt:** O robô que te dá SSL grátis configurado.
\`\`\`bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d exemplo.com -d www.exemplo.com
sudo certbot renew --dry-run
\`\`\`

---

## 18. 🛡️ Cabeçalhos e Segurança Básica

Esconda que você usa o Nginx de hackers fareadores:
\`\`\`nginx
server_tokens off;
\`\`\`

Bloqueie enxeridos em pastas secretas raiz `.env` e `.git`:
\`\`\`nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
\`\`\`

Headers que o Google PageSpeed e os analistas de Pentest amam:
\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
\`\`\`

---

## 19. 🚀 Aceleradores (GZIP Compression)

Seu servidor vai zippar os HTMLs antes de jogar no cabo de internet, economizando fortunas na AWS.

\`\`\`nginx
gzip on;
gzip_comp_level 5;
gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
\`\`\`

---

## 20. ⚖️ Load Balancer (Balanceamento Bruto)

Se você escalou uma aplicação via Node PM2 ou Docker Compose em 3 instâncias diferentes localmente:

\`\`\`nginx
upstream backend_app {
    least_conn;               # Manda para a porta menos ocupada processualmente (O padrão era Round-Robin)
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
    server 127.0.0.1:8083;
}

server {
    listen 80;
    server_name api.exemplo.com;
    location / { proxy_pass http://backend_app; }
}
\`\`\`

*(Dica: se usar `ip_hash;` em vez de `least_conn;` o Nginx força que se o Joãozinho acessou na máquina 8082 ontem, ele sempre vai voltar nela - muito bom para Session Cookie arcaico)*.

---

## 21. 🛑 Segurando Abusos (Uploads limit e Rate Limit)

### "413 Request Entity Too Large"
Adicione caso clientes enviem CSVs ou Vídeos grandes no seu ERP:
\`\`\`nginx
client_max_body_size 100M;
\`\`\`

### Dano contra Robos de DDoS - Rate Limmit
\`\`\`nginx
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://127.0.0.1:8080;
        }
    }
}
\`\`\`

---

## 22. 🚨 Código de Erros Rápidos (O que Aconteceu?)

- **403 Forbidden**: Nginx achou a pasta, mas no linux tá bloqueada pelo CHMOD sem permissão do App lê-la.
- **404 Not Found**: Escreveu o caminho de rota (`root`) ou (`try_files`) fisicamente errado.
- **502 Bad Gateway**: O Nginx funciona 100%, mas ao bater na porta 8080 local do backend, ninguem atendeu porta porque o backend seu Node Crashou, está com Erro ou desligado!
- **504 Gateway Timeout**: O backend atendeu, mas tá travado / infinitamente gerando relatório e passou de `60s`.

---

## 23. 💡 Exemplo MESTRE Completo com Tudo e Docker

\`\`\`nginx
server {
    listen 80;
    server_name sistema.exemplo.com;

    # Se seu Nginx tiver lidando com um Docker Bridge via rede isolada
    location /api/ {
        proxy_pass http://meu-container-de-backend:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        client_max_body_size 50M;
    }

    # Entregando as rotas pro React tratar puro
    location / {
        root /var/www/sistema;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Expulsando intrusos espertinhos
    location ~ /\. {
        deny all;
    }
}
\`\`\`

---

> Dominar Nginx é saber dominar a única peça do servidor que NUNCA desliga, e protege todos os softwares das trincheiras da internet direta. Use ele também para proteger bancos de dados e interfaces de admin (`Basic Auth`) num único ponto inviolável.
