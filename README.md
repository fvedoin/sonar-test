# Backend Nest

Este repositório contém o novo backend que substituirá o [Backend Spinon](https://github.com/fox-iot/spinon-backend).

O Backend Nest e Spinon são usados para se comunicar com o [Frontend Spinon](https://github.com/fox-iot/lerna-cra).
## 🛠️ Instalação

Requisitos mínimos:

- Node.js 16.x
- Docker

```bash
cp .env.example .env && cp .env.example .env.test
```

⚠️ A variável MONGO_URI deve ser diferente em .env e .env.test

### Instalar e rodar dependências externas.

É aconselhável rodar esse serviço na [Developer Stack](https://github.com/fox-iot/local-stack).

As outras formas são:
```bash
# Executando com Docker.
docker-compose up

# Executando sem docker em desenvolvimento
npm run start:dev

# Executando sem docker em debugging
npm run start:debug

# Executando sem docker em prod
npm run start:prod
```
## ✅ Testes

```bash
# unit tests
npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Acesso

Caso tenha sido executado com o docker ou com a local-stack

[https://api.spinon.test](https://api.spinon.test)

Sem o docker

[https://localhost:3333](https://localhost:3333)