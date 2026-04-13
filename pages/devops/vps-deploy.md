# 🚀 Guia Mestre: Deploy, Nginx e SSL na VPS

Este guia documenta como hospedar aplicações Node.js em uma VPS de forma profissional, superando bloqueios de firewall e configurando segurança total com domínios e SSL.

---

## 1. 🛑 O Problema das Portas

Ao hospedar uma aplicação, é comum encontrar dois obstáculos:
1.  **Portas Ocupadas**: Portas padrão como `8080` podem já estar sendo usadas por outros serviços na VPS.
2.  **Redes Corporativas**: Muitas empresas bloqueiam portas alternativas (ex: `8081`). Se sua app roda na `8081`, você não conseguirá acessá-la do trabalho.

### A Solução
- Mudar a aplicação para uma porta livre (ex: `3000`).
- Usar o **Nginx** para traduzir o tráfego da porta `80` (HTTP) ou `443` (HTTPS) para a porta interna da aplicação.

---

## 2. 🛠️ Preparando a Aplicação

Certifique-se de que sua aplicação Node.js aceita uma porta dinâmica através de variáveis de ambiente no `server.js`:

```javascript
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

## 3. 🌐 Configurando o Domínio (DNS)

Para usar um nome como `otymus27.com` em vez de um IP:
1.  Vá ao painel do seu registrador (Hostinger, Godaddy, etc).
2.  Crie um registro tipo **A**.
3.  Aponte o **Host** `@` para o **IP** da sua VPS.
4.  (Opcional) Faça o mesmo para subdomínios como `sgos` ou `app2`.

---

## 4. 🧱 Nginx como Proxy Reverso

O Nginx funcionará como o "porteiro" do seu servidor. Ele recebe o tráfego das portas padrão da internet e repassa para os seus apps.

### Configuração de Múltiplos Domínios
Edite o arquivo `/etc/nginx/sites-available/default` e organize os blocos `server`:

```nginx
# App Principal
server {
    listen 80;
    server_name otymus27.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Subdomínio SGOS
server {
    listen 80;
    server_name sgos.otymus27.com;

    location / {
        proxy_pass http://127.0.0.1:84;
        proxy_set_header Host $host;
    }
}
```

Aplique as mudanças:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. 🔐 Segurança Máxima com SSL (Certbot)

O HTTPS (porta 443) é essencial para furar firewalls rígidos. O **Certbot** automatiza tudo:

```bash
# Instalação
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Geração do Certificado
sudo certbot --nginx -d otymus27.com -d sgos.otymus27.com
```

> [!IMPORTANT]
> Quando perguntado, escolha a opção **Redirect** (2). Isso forçará todo o acesso para HTTPS.

---

## 6. 🔄 Automação com GitHub Actions

Para que seu código suba sozinho a cada `git push`, use um workflow em `.github/workflows/deploy.yml`:

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.VPS_HOST }}
    script: |
      cd /caminho/do/projeto
      git pull origin main
      npm install
      pm2 restart "nome-do-app" || pm2 start server.js --name "nome-do-app"
```

---

## 📈 Resumo do Fluxo de Dados
`Usuário` -> `otymus27.com (HTTPS/443)` -> `Nginx` -> `Localhost:3000 (HTTP)` -> `Sua App Node.js`

Com essa arquitetura, você tem segurança profissional, facilidade de acesso de qualquer lugar e deploy automatizado.
