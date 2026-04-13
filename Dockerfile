# Estágio de Build / Execução
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências (incluindo as de desenvolvimento se necessário)
RUN npm install --production

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Define a variável de ambiente padrão
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
