# 🤖 Manual Claude Code

O **Claude Code** é a CLI oficial da Anthropic que integra o modelo Claude diretamente no seu terminal e editor de código. Com ele você conversa em linguagem natural para editar arquivos, executar comandos, entender bases de código e automatizar tarefas.

---

## 1. Instalação

**Pré-requisito:** Node.js 18 ou superior.

```bash
# Instalar globalmente via npm
npm install -g @anthropic-ai/claude-code

# Verificar instalação
claude --version
```

Na primeira execução, você será redirecionado para autenticar com sua conta Anthropic.

---

## 2. Iniciando uma sessão

```bash
# Navegar até o projeto e abrir o Claude Code
cd meu-projeto
claude
```

Dentro da sessão interativa, você digita instruções em linguagem natural:

```
> explique o que esse projeto faz
> crie um endpoint GET /usuarios em server.js
> encontre todos os console.log e remova-os
> escreva testes para a função autenticarUsuario
```

---

## 3. Modos de uso

| Modo | Comando | Quando usar |
|------|---------|-------------|
| Interativo | `claude` | Sessão contínua com contexto acumulado |
| Direto | `claude "sua pergunta"` | Resposta rápida sem entrar na sessão |
| Pipeline | `claude -p "prompt"` | Scripts, CI/CD, automações |
| Continuação | `claude --continue` | Retomar a última conversa |

```bash
# Modo direto
claude "quais arquivos foram alterados hoje?"

# Modo pipeline — usa stdin
cat erro.log | claude -p "explique esse erro e sugira a correção"

# Retomar última sessão
claude --continue
```

---

## 4. Slash Commands

Comandos especiais usados dentro da sessão interativa:

| Comando | Descrição |
|---------|-----------|
| `/help` | Lista todos os comandos disponíveis |
| `/clear` | Limpa o contexto da conversa atual |
| `/compact` | Comprime o histórico para economizar tokens |
| `/status` | Mostra uso de tokens e estado da sessão |
| `/cost` | Exibe o custo estimado da sessão |
| `/commit` | Gera e executa um commit com mensagem por IA |
| `/review` | Revisa as alterações staged do Git |
| `/fix` | Tenta corrigir o último erro encontrado |
| `/explain` | Explica o código selecionado ou um arquivo |
| `/init` | Cria um `CLAUDE.md` no projeto atual |

---

## 5. Arquivo CLAUDE.md

O `CLAUDE.md` é lido automaticamente em cada sessão e serve como **memória persistente** do projeto. Coloque na raiz do repositório.

```markdown
# Instruções do Projeto

## Stack
- Backend: Node.js + Express
- Banco: PostgreSQL
- Deploy: VPS com PM2 + Nginx

## Convenções
- Variáveis e funções em camelCase
- Arquivos em kebab-case
- Commits no formato: tipo: descrição curta

## O que não fazer
- Nunca usar var, apenas const/let
- Não commitar arquivos .env
- Não adicionar comentários óbvios
```

> **Dica:** Use `/init` para gerar um `CLAUDE.md` base que o Claude preenche automaticamente analisando seu projeto.

---

## 6. Permissões e segurança

O Claude Code pede confirmação antes de executar ações destrutivas. Você pode controlar isso com flags:

```bash
# Aprovar automaticamente ações seguras (leitura/escrita de arquivos)
claude --allowedTools "Read,Write,Edit"

# Modo totalmente automático — use com cuidado
claude --dangerously-skip-permissions
```

Modos de permissão disponíveis na sessão interativa:

- **Default** — pede confirmação para cada ferramenta
- **Auto-approve** — aprova automaticamente ferramentas de baixo risco
- **Full auto** — executa tudo sem confirmar (para pipelines confiáveis)

---

## 7. Ferramentas disponíveis

O Claude Code usa ferramentas internas para interagir com o ambiente:

| Ferramenta | O que faz |
|-----------|-----------|
| `Read` | Lê arquivos do disco |
| `Write` | Cria novos arquivos |
| `Edit` | Edita arquivos existentes (diff preciso) |
| `Bash` | Executa comandos no terminal |
| `Glob` | Busca arquivos por padrão |
| `Grep` | Pesquisa conteúdo em arquivos |
| `WebFetch` | Acessa URLs e lê conteúdo web |
| `WebSearch` | Realiza buscas na internet |
| `TodoWrite` | Cria e gerencia lista de tarefas |

---

## 8. Atalhos de teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + C` | Interrompe a resposta atual |
| `Ctrl + D` | Encerra a sessão |
| `↑ / ↓` | Navega pelo histórico de mensagens |
| `Tab` | Autocompleta comandos e nomes de arquivo |
| `Shift + Tab` | Alterna modo de auto-aprovação |

---

## 9. Boas práticas

> **Seja específico:** Em vez de *"corrija esse bug"*, descreva o comportamento esperado e o atual. Quanto mais contexto, melhor a resposta.

- **Use `CLAUDE.md`** para evitar repetir instruções a cada sessão
- **Prefira `/compact`** em sessões longas para manter a performance
- **Revise antes de confirmar** — o Claude mostra o diff antes de aplicar edições
- **Combine com Git** — use `/commit` e `/review` para integrar ao fluxo de trabalho
- **Itere em partes** — divida tarefas grandes em passos menores e confirme cada um
- **Pipe no terminal** — integre o Claude em scripts para automatizar análises

---

## 10. Exemplos práticos

```bash
# Analisar um erro de build
npm run build 2>&1 | claude -p "explique o erro e corrija"

# Gerar documentação
claude "gere um README.md para esse projeto"

# Refatorar um arquivo
claude "refatore auth.js para usar async/await em vez de callbacks"

# Criar testes
claude "crie testes unitários para todas as funções de utils.js"

# Code review
git diff main | claude -p "faça um code review detalhado dessas mudanças"
```

---

## 11. Recursos adicionais

- [Documentação Oficial — Anthropic](https://docs.anthropic.com/claude-code)
- [Repositório no GitHub](https://github.com/anthropics/claude-code)
- [Reportar Issues](https://github.com/anthropics/claude-code/issues)
- [Claude API Reference](https://docs.anthropic.com/en/api/getting-started)
