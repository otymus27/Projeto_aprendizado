# 🐳 Introdução ao Docker para DevOps

O **Docker** revolucionou a maneira como entregamos e rodamos sistemas. Em vez de se preocupar com conflitos de versão entre o servidor e sua máquina ("na minha máquina funciona"), o Docker isola a aplicação inteira em um **contêiner**.

## Principais Vantagens

1. **Isolamento Total**: Sua aplicação Node, PHP ou Python roda com as dependências exatas que ela precisa, sem sujar o sistema operacional host.
2. **Portabilidade**: O mesmo contêiner que você roda no seu Windows/Mac vai rodar de forma idêntica no Linux da Hostinger.
3. **Escalabilidade**: Reiniciar, pausar ou multiplicar um contêiner leva apenas milissegundos.

## Comandos que salvam vidas

Aqui estão os 3 comandos mais usados no dia a dia:

\`\`\`bash
# Lista os contêineres que estão rodando agora
docker ps

# Derruba (remove) um contêiner na marra
docker rm -f nome-do-conteiner

# Acompanhar os logs ao vivo de uma aplicação vazando erro
docker logs -f nome-do-conteiner
\`\`\`

> **Nota importante:** Nunca guarde banco de dados de produção diretamente dentro do container sem configurar um **Docker Volume** externo (tag `-v`). Se você remover o container, os dados serão deletados junto se não houver um volume mapeado!
