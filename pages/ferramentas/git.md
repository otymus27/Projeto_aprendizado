# 🐙 Git e GitHub: Versionamento Descomplicado

O uso de versionamento de código mudou sua vida, certo? Hoje em dia é praticamente impossível pensar na criação de sistemas sérios sem Git.

## O Que é Git vs GitHub?

* **Git**: É a ferramenta (linha de comando) instalada no seu computador. Ele cria a "máquina do tempo" na sua pasta local, gravando versões e diferenças, permitindo reverter para como seu projeto estava há semanas atrás.
* **GitHub**: É a rede social e a nuvem empresarial gratuita. Você "empurra" (*Push*) aquilo que o seu Git local guardou para a nuvem da Microsoft, permitindo que processos como o nosso *Github Actions* observem o seu código.

## Comandos do Dia-a-Dia (O Feijão com Arroz)

\`\`\`bash
# 1. Empacotar tudo que você fez de novo ou modificou na "caixa" de envio
git add .

# 2. Fechar a caixa com fita crepe e colocar uma etiqueta descritiva
git commit -m "feat: adicionar nova barra lateral do sistema"

# 3. Mandar essa caixa pra nuvem do GitHub pelo correio!
git push
\`\`\`

---

## 🦸 Comandos Avançados ("Fiz Besteira")

Esses são os comandos de resgate para quando a gente se enrola.

### Apagar todas as mudanças atuais e voltar ao último Commit (Desfazer o que não foi "commitado")
Se você mudou uns arquivos agorinha mas deu tudo errado e quer resetar:
\`\`\`bash
git restore .
\`\`\`

### Editar o último Commit
Se você enviou um commit mas esqueceu de um arquivo solto ou errou o texto da etiqueta:
\`\`\`bash
git add .
git commit --amend --no-edit
# Atenção: Se você já deu Push antes, vai precisar do force: git push -f
\`\`\`

### Mudar de "Ramificação" (Branch)
Quando um desenvolvedor começa uma feature polêmica (que pode quebrar o sistema), ele cria uma branch separada do "main" pra testar sozinho.
\`\`\`bash
git checkout -b minha-nova-feature
\`\`\`
