# 🐧 Ubuntu: Sobrevivendo no Terminal

O Linux e, especialmente, o **Ubuntu / Debian**, são o padrão ouro e absoluto de Sistemas Operacionais para Hospedagem VPS. Mesmo com painéis como aaPanel ou CyberPanel disponíveis, **se você souber terminal, o poder será todo seu**.

## 👶 Comandos Básicos de Sobrevivência
Ações mais simples no seu servidor VPS para não ficar perdido no escuro:

\`\`\`bash
# Qual é o "Endereço Direcional" (Caminho) da pasta onde estou parado?
pwd

# Mostrar tudo o que tem dentro da pasta atual (inclusive arquivos ocultos)
ls -la

# Entrar numa pasta
cd /var/www/html/

# Criar uma pasta
mkdir nome-da-pasta

# Criar um arquivo vazio ou atualizar a hora do arquivo
touch style.css
\`\`\`

> **Dica Quente:** Evite usar *letras maiúsculas* e *espaços* em nomes de pastas e arquivos no Linux. Isso evitará muita dor de cabeça por "case sensitivity".

---

## 🚀 Comandos Avançados e DevOps

Pra quem já opera máquina por SSH de verdade:

### Manipulação Bruta
\`\`\`bash
# Remove uma pasta LOTADA de arquivos sem perguntar nem uma vez (PERIGOSO)
rm -rf /var/www/html/projeto-velho/

# Ver quanto de processamento e RAM o servidor tá consumindo ao vivo!
htop  # (se não tiver instalado, rode: apt install htop)

# Ver quem está sugando espaço em disco no servidor
df -h
\`\`\`

### Monitoramento de Rede e Portas
Essencial para debugar quando seu container ou Nginx não estão subindo porque a porta "tá ocupada".

\`\`\`bash
# Lista de portais em uso. Descubra qual software está rodando na porta 8080!
netstat -tulpn | grep 8080

# Baixar algo direto da URL da internet pra dentro da VPS
wget https://exemplo.com/download.zip
\`\`\`

### Permissões e Segurança
Às vezes o Apache não deixa um site abrir pelo erro "403 Forbidden" por falta de permissão nos arquivos:

\`\`\`bash
# Dar propriedade integral dos arquivos de site ao servidor web padrão do Ubuntu (www-data)
chown -R www-data:www-data /var/www/html/

# Dar permissão 755 (todo mundo vê, só o dono edita)
chmod -R 755 /var/www/html/
\`\`\`
