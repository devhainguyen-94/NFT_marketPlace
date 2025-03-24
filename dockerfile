FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8545
EXPOSE 4000
CMD ["npx", "hardhat", "node"]
