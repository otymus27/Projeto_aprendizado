# 🐧 Ubuntu & Linux: O Guia Definitivo para DevOps

Seja administrando uma VPS na Hostinger, na AWS ou no próprio computador, o domínio do terminal Linux é o que separa desenvolvedores iniciantes de engenheiros experientes. Este guia cobre desde o absoluto básico até os meandros da manipulação de processos, redes e segurança em sistemas baseados em Debian/Ubuntu.

---

## 1. 🗂️ Navegação e Sistema de Arquivos

No Linux, **tudo é um arquivo**. Entender como navegar nas entranhas do sistema é o passo número um.

\`\`\`bash
# Saber onde você está (Print Working Directory)
pwd

# Listar arquivos e pastas
ls          # Lista simples
ls -la      # Lista detalhada (permissões, dono, tamanho) incluindo arquivos ocultos (.)
ls -lh      # Lista detalhada com tamanho de arquivo legível (KB, MB, GB)

# Mudar de diretório (Change Directory)
cd /var/www/html/   # Navega para o caminho absoluto
cd ..               # Volta uma pasta acima
cd ~                # Volta imediatamente para a home do usuário (ex: /root ou /home/usuario)
cd -                # Volta para a última pasta em que você estava

# Visualizar a árvore do diretório atual inteira
tree -L 2           # (Pode exigir a instalação do pacote 'tree', -L 2 limita a profundidade)
\`\`\`

---

## 2. 📝 Gestão de Arquivos e Leitura

\`\`\`bash
# Criar arquivos e pastas
mkdir nova-pasta            # Cria diretório
mkdir -p pai/filho/neto     # Cria o caminho de diretórios inteiro se não existir
touch arquivo.txt           # Cria um arquivo vazio (ou atualiza a hora do arquivo)

# Copiar (Copy) e Mover (Move)
cp arquivo.txt copia.txt          # Copia um arquivo
cp -r pasta-antiga/ pasta-nova/   # Copia pastas inteiras recursivamente (-r)
mv aquivo.txt /outra/pasta/       # Move o arquivo para outra pasta
mv antigo.txt novo.txt            # O 'mv' também serve para RENOMEAR um arquivo/pasta

# Remover/Deletar (Remove)
rm lixo.txt                 # Remove um arquivo simples
rm -rf pasta-suja/          # Remove uma pasta e todo o seu conteúdo à força (USE COM CUIDADO!)

# Leitura e Edição
cat log.txt                 # Cospe todo o conteúdo do arquivo de uma vez no terminal
head -n 20 log.txt          # Lê apenas as 20 primeiras linhas
tail -f access.log          # Lê o final do arquivo continuadamente em TEMPO REAL (ótimo para ver erros vivos)
nano config.env             # Abre um editor de texto básico e hiper intuitivo pelo terminal
nano -l config.env          # Editor de texto mostrando os números das linhas (ótimo pra programar)
\`\`\`

---

## 3. 🔍 Buscas e Filtros de Sistema

\`\`\`bash
# Procurar por arquivos pelo nome inteiro pelo servidor
find / -name "index.html"        # Busca no sistema inteiro (/) pelo arquivo textualmente
find /var/www/ -mtime -2         # Encontra todos arquivos na pasta que foram modificados nas últimas 48h

# Procurar palavras DENTRO de um arquivo ou resultado (Globally Search a Regular Expression and Print)
grep "Erro 500" debug.log        # Busca a frase dentro do arquivo
cat syslog | grep "nginx"        # Pega a saída de um arquivo e filtra só o que tem 'nginx'
grep -r "senha_db" /etc/         # Varre recursivamente todas as pastas dentro de /etc/ procurando por esse texto
\`\`\`

---

## 4. 🪪 Permissões, Donos e Sudo

No Linux, todas as pastas e arquivos pertencem a um **Usuário** e a um **Grupo**, e delimitam permissões de `Leitura (r/4)`, `Escrita (w/2)` e `Execução (x/1)`.

\`\`\`bash
# Trocar o Dono (Change Owner)
# Muito usado em hospedagem web para passar os arquivos para o domínio do Nginx/Apache
chown www-data:www-data arquivo.php
chown -R www-data:www-data /var/www/html/    # Formato recursivo (aplica pra tudo lá dentro)

# Mudar Permissões (Change Mode)
# As permissões são expressas em 3 blocos de números: (Dono)(Grupo)(Outros)
chmod 777 script.sh         # Perigosíssimo! Todos podem ler, escrever e rodar
chmod 755 public_html/      # Padrão para pastas web. O dono pode tudo, o resto só lê e entra.
chmod 644 index.html        # Padrão para arquivos web. O dono lê e escreve, o resto só lê.
chmod +x backend.py         # Concede a permissão de EXECUTÁVEL para que ele vire um programa
\`\`\`

> **Dica Executiva Sudo**: Se ocorrer um erro "*Permission Denied*", anteceda seu comando com a palavra `sudo`. O Sudo (SuperUser DO) garante elevação pontual à força máxima de Administrador/Root no comando em questão.

---

## 5. ⚙️ Gerenciamento de Processos e Serviços

Como saber o que está engasgando o seu servidor? Como criar sistemas que iniciam sozinhos no boot?

\`\`\`bash
# Monitoramento e Verificação
top                       # Exibe ao vivo consumo de RAM e CPU. Aperte 'q' para sair.
htop                      # Versão mais bonita e colorida do top (altamente recomendada)
free -m                   # Exibe a memória RAM livre e usada no momento em Megabytes
df -h                     # Mostra a porcentagem usada dos discos e SSDs do servidor

# Lidando com o Software em si
ps aux                    # Tira um "raio-x" fotográfico de todos os programas rodando na máquina agora
ps aux | grep node        # Procura para saber se a sua aplicação Node.js está ligada
kill 1308                 # Mata o processo educadamente pelo PID (número indentificador)
kill -9 1308              # Assassina à força o processo sem perguntar

# Controlar Serviços vitais (systemd)
systemctl status nginx    # Vê se o servidor web Nginx está no ar ou com defeito
systemctl restart docker  # Reinicia o serviço mestre do Docker inteiro
systemctl enable apache2  # Coloca o Apache no boot-automático para se o servidor reiniciar de madrugada
\`\`\`

---

## 6. 🌐 Rede, Portas e Segurança Básico (Firewall)

Servidores vivem de portas e acessos. Diagnosticar a rede é fundamental.

\`\`\`bash
# Download puro estilo hacker
wget https://dl.google.com/exemplo/arquivo.zip   # Baixa o link direto pra pasta
curl -I https://seusite.com                      # Lê o Header de um site para saber qual tecnologia respondeu 

# Como descobrir qual app "Alocou" a Porta 8080 ("Port is Already Allocated")
netstat -tulpn | grep 8080      # Modo clássico
ss -lntu | grep 8080            # Modo moderno (mais rápido)

# UFW (Uncomplicated Firewall) - A muralha da máquina
ufw status                      # Vê se a muralha de portas tá ligada ou desligada
ufw enable                      # Ativa o firewall permanentemente (CUIDADO PARA NÃO SE TRANCAR FORA!)
ufw allow 22/tcp                # Importante: Libera a porta de SSH antes de ativar o UFW!!
ufw allow 80                    # Libera o acesso padrão para site HTTP
ufw allow 443                   # Libera o acesso blindado de site HTTPS
ufw delete allow 8080           # Corta o acesso da porta 8080 para a internet externa
\`\`\`

---

## 7. 📦 Gerenciamento de Pacotes (APT)

Por o Ubuntu utilizar o ecossistema Debian, a instalação de softwares é comandada pelo APT (*Advanced Package Tool*).

\`\`\`bash
apt update                # Atualiza a "lista" de correios para saber o que há de mais novo no mercado mundial
apt upgrade               # Pega a lista recente e atualiza debaixo dos panos tudo da sua máquina
apt install git unzip -y  # Instala programas novos (o -y aceita os termos sem perguntar se você tem certeza)
apt remove apache2        # Desinstala o software mas mantém as pastas de cache para o caso de você se arrepender
apt purge apache2         # Pulveriza o programa, arrancando todas as suas raízes, caches e restos 
apt autoremove            # É a "faxineira" que checa e deleta dependências de coisas antigas que ficaram órfãs no HD
\`\`\`

---

## 💡 Dica de Ouro de Sobrevivência 
Se você não sabe fazer alguma coisa em algum comando, absolutamente *todo o sistema operativo* tem seu próprio manual embutido dentro dele. Basta usar o `man`.

Vá até o terminal e digite:
\`\`\`bash
man chmod
\`\`\`
*(Ele abrirá um livro explicativo maravilhoso sobre o que esse comando faz e as minúcias que ele suporta! Use 'q' para sair do manual)*
