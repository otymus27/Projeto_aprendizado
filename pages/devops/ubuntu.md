# 🐧 Guia Definitivo de Comandos no Ubuntu & Linux

O Linux e, especialmente, o **Ubuntu / Debian**, são o padrão ouro de Sistemas Operacionais para Hospedagem VPS e para desenvolvimento Full Stack. Este é o seu manual completo de sobrevivência e domínio no terminal.

---

## 1. 🖥️ O que é o terminal no Ubuntu

O terminal é a interface de linha de comando do Ubuntu. Com ele, você pode navegar, criar arquivos, instalar programas, monitorar rede e automatizar a sua VPS. No Ubuntu, o terminal normalmente usa o **Bash** por padrão.

Para abrir no Desktop:
- `Ctrl + Alt + T`

---

## 2. 🧩 Estrutura básica de um comando

A maioria dos comandos segue este padrão:
\`\`\`bash
comando [opções] [argumentos]
\`\`\`

Exemplo:
\`\`\`bash
ls -l /home
\`\`\`
- `ls` = comando
- `-l` = opção
- `/home` = argumento

---

## 3. 🗂️ Comandos básicos de navegação

### `pwd`
Mostra o caminho da pasta atual (Print Working Directory).
\`\`\`bash
pwd
\`\`\`

### `ls`
Lista arquivos e pastas.
\`\`\`bash
ls
ls -l   # mostra detalhes (permissões, dono)
ls -a   # mostra arquivos ocultos
ls -lh  # mostra tamanhos legíveis (KB, MB)
ls -la  # junta tudo
\`\`\`

### `cd`
Entra em uma pasta (Change Directory).
\`\`\`bash
cd Documentos
cd ..       # Voltar uma pasta
cd ~        # Ir para a pasta pessoal (home)
cd /        # Ir para a raiz absoluta do sistema
cd -        # Voltar para a pasta anterior
\`\`\`

---

## 4. 📝 Manipulação de arquivos e diretórios

### `mkdir`
Cria pastas.
\`\`\`bash
mkdir projetos
mkdir pasta1 pasta2 pasta3
mkdir -p projeto/src/components  # Cria o caminho completo se não existir
\`\`\`

### `touch`
Cria arquivo vazio ou atualiza o horário.
\`\`\`bash
touch arquivo.txt
touch a.txt b.txt c.txt
\`\`\`

### `cp`
Copia arquivos e diretórios.
\`\`\`bash
cp arquivo.txt copia.txt
cp -r minha_pasta backup_pasta   # Recursivo para pastas
\`\`\`

### `mv`
Move ou renomeia.
\`\`\`bash
mv velho.txt novo.txt
mv arquivo.txt /home/fabio/Documentos/
\`\`\`

### `rm`
Remove arquivos ou pastas.
\`\`\`bash
rm arquivo.txt
rm -i arquivo.txt       # Pergunta antes de apagar
rm -r minha_pasta       # Apaga pasta inteira
rm -rf minha_pasta      # Apaga à força (MUITO PERIGOSO)
\`\`\`

---

## 5. 👁️ Visualização de conteúdo

### `cat`
Exibe conteúdo de arquivo no terminal.
\`\`\`bash
cat arquivo.txt
cat parte1.txt parte2.txt > completo.txt
\`\`\`

### `less` & `more`
Permitem ler arquivos grandes rolando a tela.
\`\`\`bash
less arquivo.log     # 'q' para sair
more arquivo.txt
\`\`\`

### `head` & `tail`
Mostra topos ou fundos de arquivos.
\`\`\`bash
head -n 20 log.txt   # 20 primeiras linhas
tail arquivo.txt
tail -f /var/log/syslog  # Lê os logs novos AO VIVO em tempo real
\`\`\`

---

## 6. 🔍 Busca de arquivos e conteúdo

### `find`
Procura arquivos pelo HD inteiro.
\`\`\`bash
find /home/fabio -name "arquivo.txt"
find . -type d -name "src"    # Busca só diretórios (d) com nome src
find . -type f -name "*.log"  # Busca arquivos terminados em .log
\`\`\`

### `grep`
Filtra ou acha textos DENTRO dos arquivos.
\`\`\`bash
grep "erro" arquivo.log
grep -i "erro" arquivo.log    # Ignora maiúsculas/minúsculas
grep -r "senha" .             # Varre todas as pastas e arquivos recursivamente
\`\`\`

---

## 7. 🪪 Permissões e propriedades

### `chmod`
Altera permissões de acesso.
\`\`\`bash
chmod 755 script.sh      # Dono faz tudo; resto lê e executa
chmod +x script.sh       # Transforma o arquivo num executável
\`\`\`
*(Dica: `7` = ler/escrever/executar | `5` = ler/executar | `4` = só ler)*

### `chown`
Altera o "Dono" do arquivo. Muito usado para dar poder ao servidor web (ex: `www-data`).
\`\`\`bash
sudo chown usuario:grupo arquivo.txt
sudo chown -R fabio:fabio minha_pasta/
\`\`\`

---

## 8. 👤 Usuários e privilégios

### `whoami` & `id`
Saber e diagnosticar quem você é.
\`\`\`bash
whoami
id
\`\`\`

### `sudo` & `su`
Comandos de poder máximo (Root).
\`\`\`bash
sudo apt update          # Roda um comando temporariamente como Rei do sistema
su nomeusuario           # Troca de usuário
sudo su                  # Transforma o seu terminal em root perene
\`\`\`

### Gerir Contas
\`\`\`bash
sudo adduser joao               # Cria
sudo passwd joao                # Altera senha
sudo usermod -aG sudo joao      # Dá permissão Admin pro João
\`\`\`

---

## 9. 📦 Gerenciamento de pacotes (APT)

O instalador oficial da família Debian/Ubuntu.
\`\`\`bash
sudo apt update           # Baixa lista nova de programas da internet
sudo apt upgrade          # Atualiza todos os softwares pra última versão
sudo apt install nginx    # Instala
sudo apt purge nginx      # Arranca com todas as raízes e configurações
sudo apt autoremove       # Faxina bibliotecas velhas e órfãs
apt search docker         # Busca no armazém por algo
\`\`\`

---

## 10. ⚙️ Monitoramento do sistema (RAM e CPU)

\`\`\`bash
top                       # Exibe tudo ao vivo
htop                      # Versão mais colorida e bonita (sudo apt install htop)
free -h                   # Vê quanto de memória RAM está sobrando
df -h                     # Vê quanto espaço no HD ainda tem
du -sh minha_pasta/       # Descobre o peso total de uma pasta específica
\`\`\`

### Processos e Abates (`ps` e `kill`)
\`\`\`bash
ps aux                    # Fotografia de tudo rodando
ps aux | grep java        # Procura se o Java está rodando
kill 1234                 # Encerra educadamente
kill -9 1234              # Assassina à força o processo
pkill firefox             # Mata direto pelo nome ao invés de usar PID
\`\`\`

---

## 11. 🌐 Rede e Internet

\`\`\`bash
ip a                      # Mostra seu IP e interfaces (substituiu o velho ifconfig)
ping google.com           # Testa se a internet chegou lá
curl -O https://site.com/arquivo.zip   # Baixa e exibe HTTP
wget https://site.com/arquivo.zip      # Faz download cru
ss -tulnp                 # (MUITO IMPORTANTE) Mostra quais programas estão usando quais portas!!
nslookup google.com       # Diagnóstico de DNS
\`\`\`

---

## 12. 🗜️ Compactação (Zip e Tar)

\`\`\`bash
tar -czvf backup.tar.gz minha_pasta/    # Cria Pacote Tar
tar -xzvf backup.tar.gz                 # Extrai o Tar
zip -r arquivo.zip minha_pasta/         # Cria Zip
unzip arquivo.zip                       # Extrai Zip
\`\`\`

---

## 13. 🔀 Redirecionamento e Pipes

O canivete suíço dos deuses DevOps.
\`\`\`bash
ls > lista.txt                 # Sobrescreve o arquivo com a lista
echo "log extra" >> log.txt    # Adiciona texto no fim do arquivo sem apagar nada
ls -l | grep ".txt"            # Usa o Pipe (|) para combinar saídas. Joga o ls pro grep.
\`\`\`

---

## 14. 🧭 Variáveis de ambiente

\`\`\`bash
echo $HOME                     # Mostra a casa do seu usuário
NOME="Fabio"                   # Cria variável
echo $NOME                     # Usa
env                            # Lista TODAS as variáveis de um sistema (ótimo pra debugar credenciais vazadas)
\`\`\`

---

## 15. 🕒 Histórico de comandos

\`\`\`bash
history          # Exibe o rol inteiro de comandos que você já digitou
!25              # Executa obrigatoriamente a linha de comando #25
# (Dica: Ctrl + R faz uma busca ao vivo no passado)
\`\`\`

---

## 16. ⌨️ Atalhos cruciais do terminal

- `Ctrl + C` interrompe travamentos infinitos
- `Ctrl + Z` suspende pra background
- `Ctrl + D` logout (sai da maquina)
- `Tab` auto-completa caminhos mágicos (Use sem moderação!)
- `Ctrl + A` vai para início da linha
- `Ctrl + E` vai para final da linha
- `clear` limpa a tela de poluição

---

## 17. ✏️ Edição de texto via CLI

### `nano` (O simples e intuitivo)
\`\`\`bash
nano arquivo.txt
# Ctrl + O (Salva) -> Enter
# Ctrl + X (Sai)
\`\`\`

### `vim` (O Avançado)
\`\`\`bash
vim arquivo.txt
# Aperte 'i' para começar a inserir
# 'Esc' para voltar a comandar
# ':wq!' para forçar salvar e sair
\`\`\`

---

## 18. 🏭 Serviços e systemd

Para gerenciar Servidores web, Banco de Dados, e coisas que iniciam com o PC.
\`\`\`bash
systemctl status nginx       # Vê se o Nginx está online ou com erro vermelho
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx  # Coloca pra ligar junto caso o servidor VPS reinicie!
\`\`\`

Leia os logs dos serviços caso não queiram subir:
\`\`\`bash
journalctl -u nginx -f       # Log dedicado focado no Nginx
\`\`\`

---

## 19. 🧠 Comandos avançados (Nível Hack)

\`\`\`bash
# xargs: Transfere a busca para outro comando
find . -name "*.log" | xargs rm     # Deleta bilhões de arquivos com facilidade

# tee: Salva no arquivo enquanto imprime na visualização
echo "teste" | tee arquivo.txt

# sed & awk: Transformadores de texto
sed -i 's/velho/novo/g' arquivo.txt # Find&Replace no documento inteiro por linha de comando sem editor visual!
awk '{print $1}' arquivo.txt        # Recorta a 1ª coluna de uma tabela de banco

# Contadores e Sort
sort nomes.txt | uniq               # Organiza alfabeticamente cortando nomes repetidos
wc -l arquivo.txt                   # Conta com exatidão milhares de linhas em milésimos de segundo
\`\`\`

---

## 20. 💾 Discos e Partições

\`\`\`bash
lsblk                      # Exibe fatias de disco da máquina e pen-drives conectados
sudo fdisk -l              # Relatório detalhado dos discos
sudo mount /dev/sdb1 /mnt  # Gruda (Montagem) um disco extra no Linux 
sudo umount /mnt           # Remove o cabo com segurança
\`\`\`

---

## 21. ⏰ Agendamento (Cron)

Robôs e backups rodando sozinhos!
\`\`\`bash
crontab -e      # Edita a agenda do usuário atual
\`\`\`
*(Regra: `minuto | hora | dia | mês | semana | comando`)*
\`\`\`cron
0 2 * * * /home/fabio/backup.sh   # Vai rodar o script toda santa noite às 2h00
\`\`\`

---

## 22. 📜 Scripts Bash Básico

Arquivos terminados em `.sh`. O poder de escrever lógica automatizada.
\`\`\`bash
#!/bin/bash
nome="Fabio"
echo "Bem-vindo, $nome"

# Lógica
if [ -f arquivo.txt ]; then
  echo "Arquivo existe!"
fi

# Repetições
for i in 1 2 3 4 5
do
  echo "Número: $i"
done
\`\`\`
*(Não esqueça do `chmod +x` no arquivo para permitir!)*

---

## 23. 🧯 Administração Geral Rápida

\`\`\`bash
sudo reboot             # Reiniciar a máquina VPS inteira
sudo shutdown now       # Desligar para não ligar mais
uptime                  # Descobrir se caiu recentemente e quantos dias está ligado direto
w / who                 # Ver se há algum intruso logado agora mesmo no servidor
\`\`\`

---

## 24. 👩‍💻 Comandos úteis para Full Stack

\`\`\`bash
# Git
git clone URL
git commit -m "mensagem"

# Docker
docker ps -a
docker logs -f nome_container
docker compose up -d

# Ferramentas
node -v
java -version
\`\`\`

---

## 25. ✅ Checklist de Boas Práticas Ubuntu

1. Sempre revise o diretório (pwd) antes de usar um `rm -rf`.
2. Use `sudo` com parcimônia, pois você se torna deus e demônio.
3. Se travar numa opção esquecida, não vá pro Google: use o manual oficial digitando `man nome-do-comando`.
4. Mantenha os softwares e patches de segurança em dia operando o `apt update && apt upgrade` semanalmente.

---

> O ideal é começar pelos blocos de arquivos `(cd, ls)` e evoluir com a dor até a seção `systemctl`. Quanto menos medo da tela preta sentires, mais inquebrável se tornará sua infraestrutura.
