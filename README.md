### CURSO - curso.dev

##### Data Inicio: 20/06/2023

##### Developer: Josuel A. Lopes

##### About

Desenvolvimento de uma aplicação clone do <a href="https://www.tabnews.com.br"> tabnews.com.br</a> para agregar conhecimento e habilidades técnicas reproduzindo a representação de um projeto real e profissional.
Projeto clone tabnews do educator:<a href="https://github.com/filipedeschamps"> Filipe Deschamps</a> para estudo acadêmico no <a href="https://curso.dev/">curso.dev</a>, com as tecnologias e padronizações desenvolvimento de softwares.

- ReactJS,
- NextJS,
- NodeJS,
- Prettier,
- ESLint
- Docker
- Jest,
- CI

<br/>

#### Projeto: Clone tabnews

</br>

#### 📋 Sumário

---

- [📋 Sumário](#-sumário)
- [📂 Arquitetura e diretórios](#-arquitetura-e-diretórios)
- [📦 Pacotes](#-pacotes)
- [🧰 Dependências](#-dependências)
- [♻️ Variáveis de Ambiente](#-variáveis-de-ambiente)
- [🔥 Como executar](#-como-executar)
- [📑 Padronização](#-padronização)
- [🧪 Testes](#-testes)
- [⚙️ CI/CD](#-CI/CD)
- [🚀 Build](#-build)
- [🔖 Version](#-version)
- [📜 Licença](#-licença)

<br/>

#### 📂 Arquitetura e diretórios

---

- MVC (Model View Controller)

```txt
  📦 root
  ┣ 📂 pages
  ┃ ┗ 📜 index.js
  ┣ 📂 models
  ┃ ┣ 📜 user.js
  ┃ ┣ 📜 content.js
  ┃ ┗ 📜 password.js
  ┣ 📂 infra
  ┃ ┗ 📜 database.js
  ┃ ┣ 📂 migrations
  ┃ ┣ 📂 provisioning
  ┃ ┃ ┣ 📂 staging
  ┃ ┃ ┣ 📂 production
  ┣ 📂 tests

```

<br/>

#### 📦 Pacotes

---

- Versão do node

- - `lts/hydrogen`

- Padronização do código

- - Configurações
- - - `.github/workflows/linting.yaml`
- - - `.github/workflows/tests.yaml`
- - - `.husky/commit-msg`
- - - `infra/compose.yaml`
- - - `commitlint.config.js`
- - - `.prettierignore`
- - - `.eslintrc.json`
- - - `jest.config.js`
- - - `.editorconfig`
- - - `jsconfig.js`
- - - `.gitignore`
- - - `.nvmrc`
-
- [npm](https://docs.npmjs.com/cli/v10/commands/npm): v10.8.2 - npm is the package manager for the Node JavaScript platform. It puts modules in place so that node can find them, and manages dependency conflicts intelligently.

- [Node.js](https://nodejs.org/en): v18.20.4 - Node.js® is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.

- [Next.js](https://nextjs.org/) - Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.

- [React](https://react.dev/) - The library for web and native user interfaces

- [ESLint](https://eslint.org/) - Static code analysis to help find problems within a codebase

- [Prettier](https://prettier.io/) - An opinionated code formatter

- [Commitlint](https://github.com/conventional-changelog/commitlint#readme) - Lint commit messages

- [Commitizen](https://github.com/commitizen/cz-cli#readme) - The commitizen command line utility

- [Husky](https://github.com/typicode/husky#readme) - Git hooks made easy 🐶 woof!

- [Docker](https://hub.docker.com/_/postgres) - Docker Hub is the world's easiest way to create, manage, and deliver your team's container applications.

- [Jest](https://jestjs.io/) - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

- [CI/CD](https://github.com/features/actions) - GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD. Build, test, and deploy your code right from GitHub. Make code reviews, branch management, and issue triaging work the way you want.

-
- Atualização de pacotes

```bash
npm audit
npm outdated
npx npm-check-updates -i
```

<br/>

#### 🧰 Dependências

---

- Docker
- - Docker Compose
- - - Criar e inicializar

```bash
docker compose --file infra/compose.yaml -d up
docker ps
```

ou

```bash
npm run services:up
```

- - - Para ou excluir

```bash
docker compose --file infra/compose.yaml down
docker ps -a
```

ou

```bash
npm run services:down
```

- Banco Dados

- - Postgres (DBMS - Banco Dados relacional)

- - - node-pg-migrate (Migrations)

- - - pg (Query/Consultas)

```bash
npm run migrations:create
npm run migrations:up
```

<br/>

#### ♻️ Variáveis de Ambiente

---

- Certifique-se de ter configurado o arquivo `.env` ou `.env.development` na raiz do projeto baseado no arquivo `.env.example`, com as variáveis de ambiente necessárias para execução do projeto.

- Caso você não tenha acesso aos valores, solicite ao responsável pelo projeto.

<br/>

#### 🔥 Como executar

---

- Realize o clone ou baixe o projeto localmente.

- - Instalar ou atualizar os pacotes e dependências

```bash
npm install
```

- - Para executar o projeto em modo de desenvolvimento.

```bash
npm run dev
```

- - Para executar o projeto em modo de produção e homologação.

```bash
npm run start
```

<br/>

#### 📑 Padronização

---

- Estilização do código com `Prettier`

- - Analisar e verificar

```bash
npm run lint:prettier:check
```

- - Corrigir e ajustar

```bash
npm run lint:prettier:fix
```

- Qualidade do código `ESLint`

```bash
npm run lint:eslint:check
```

- Qualidade do commit `Commitlint`

```bash
npx  commitlint
```

- Qualidade do commit com Hooks `Husky` e `Commitizen`

```bash
git add -A
npm run commit
```

<br/>

#### 🧪 Testes

---

- Teste Automatizados / Teste Integração

- - TDD (Test Driven Development)

- - - Teste Runner (Jest)

- - Para executar o projeto em modo de test.

```bash
npm run test
```

ou

```bash
npm run test:watch
```

<br/>

#### ⚙️ CI/CD

---

- Github Actions (workflow) fluxo de continuous integrations e continuous deploy
- - O fluxo é realizado a cada pull request realizado para branch definida no projeto.

```txt
|-Workflow (Testes Automatizados)
| |-Event: "Pull Request"
| | |-Job: "Jest"
| | | |-Runner: "Ubuntu"
| | | | |-Step: "Instalar dependências"
| | | | |-Step: "Rodar bateria de testes"

```

- Actions
- - Jest Ubuntu
- - Commitlint
- - Prettier
- - ESLint

<br/>

#### 🚀 Build

---

Para gerar o build do projeto deve-se abrir no `Visual Code` gerando os arquivos e build da aplicação

```bash
npm build
```

<br/>

#### 🔖 Version

---

- Padronização da estrutura de versionamento
- - Semantic Versioning:

- - `path`: Ajustes, melhorias e correções que não alteram as funcionalidades e comportamento.

- - `minor`: Alterações nas funcionalidades, mas que são compatíveis entre versões e mantendo a total compatibilidade de funcionalidades e comportamento.

- - `major`: Novas funcionalidades ou alterações que modifica o comportamento, e que podem não ser mais compatíveis com versões anteriores.

- - Exemplo:

```txt
[  ]. [  ].[  ]

major.minor.patch

2.1.0
```

<br/>

#### 📜 Licença

---

Este repositório e projeto possui licença `MIT license`, para maiores informações:

- [License Project ](https://github.com/josuellions/clone-tabnews?tab=MIT-1-ov-file#readme)

- [GitHub Licenses](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository#:~:text=You%27re%20under%20no%20obligation%20to%20choose%20a%20license.%20However%2C%20without%20a%20license%2C%20the%20default%20copyright%20laws%20apply%2C%20meaning%20that%20you%20retain%20all%20rights%20to%20your%20source%20code%20and%20no%20one%20may%20reproduce%2C%20distribute%2C%20or%20create%20derivative%20works%20from%20your%20work.).
