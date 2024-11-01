### CURSO - curso.dev

#### Data Inicio: 20/06/2023

##### Educator: Filipe Deschamps

##### Developer: Josuel A. Lopes

#### About

Desenvolvimento de uma aplicação clone do `https://www.tabnews.com.br/` para agregar conhecimento e habilidades técnicas reproduzindo representação de um projeto real e profissional.

#### clone-tabnew

Projeto clone tabnews `filipe deschamps` para estudo acadêmico no `curso.dev`

##### Ambiente

> Node v18.16.1

- Definir nvm padrão no projeto

- Criar um arquivo ".nvmrc" na raiz do projeto e colocar o nome da versão do node ex.: "lts/hydrogen"

```
$ nvm install lts/hydrogen
$ nvm use 18.16.1
```

> NextJS

- Criar manifesto do projeto com `package.json`

```
$ npm init
$ npm install next@13.1.6
```

> React

```
$ npm install react@18.2.0
$ npm install react-dom@18.2.0
```

> Criando estrutura do projeto

- Criar diretório `/pages/index.js`

##### CURL

- Testes para visualizar o dados HTTP

  ```
  curl http://localhost:3000/api/status -v
  ```

##### DOCKER POSTGRES

- criar arquivo `/infra/compose.yaml`

  -- criar parâmetros de configurações do docker no arquivo criado

  -- acessar o diretório do arquivo e executar os comandos

  ```
  $ docker compose -f infra/compose.yaml up
  ```

##### CLIENT POSTGRES

- Instalar pacote

  ```
  $ npm install pg@8.11.3
  ```

- criar arquivo `/infra/database.js`

  -- criar função de conexão e query com banco dados

##### VARIÁVEIS DE AMBIENTE

- criar arquivo `.env` na raiz do projeto
  -- criar as variáveis de ambiente no arquivo
  -- ajustar nos arquivos `/infra/database.js` e `/infra/compose.yaml`
  -- alterar credencias de conexão com as variáveis ambiente

##### EXECUTAR SERVIÇOS SIMULTÂNEOS

- Add no arquivo `packge.json` em `scripts`

  `"dev": "npm run services:up && next dev",`

##### CAPTURANDO DADOS STATUS BANCO DADOS

- Criando conexões e objetos retorno do status no arquivo `/page/api/v1/status/index.js`
- Criando testes unitários para funcionalidades de retorno dados status
- Criando proteção nas query do banco para evitar SQL Injection

##### MIGRATIONS

- Gerenciando versionamento de ajuste e alterações no banco dados com migrations

```
npm i node-pg-migrate@6.2.2
```

##### VARIÁVEIS DE AMBIENTE COM dotenv

- Criando variáveis de ambiente com dotenv para ambiente de desenvolvimento, homologação e produção

```
npm i dotenv@16.4.4
npm i dotenv-expand@11.0.6
```

##### CI - Continuous Integration

- Estabilizando ambiente e testes locais para implementação do CI

-- Criando script para inicializar os serviços ambiente local em `./infra/scripts/wait-for-postgres.js`
--- Criar comando para rodar script no arquivo `./package.json`

> Executando scripts

- node:child_process

> Concorrente e Orquestrador JEST e NEXTJS

- Subir os serviços de forma concorrentes (lado a lado)

-- Adiciona no arquivo `package.json` em scripts:

```
"test": "npm run services:up && npm run wait-for-postgres && concurrently --names next,jest --hide next --kill-others --success command-jest 'next dev' 'jest --runInBand' ",
```

- usar sleep para simular delay para efeito de testes

```
"test": "npm run services:up && npm run wait-for-postgres && concurrently --names next,jest --hide next --kill-others --success command-jest 'sleep 1; next dev' 'jest --runInBand' ",
```

- Instalar:

```
npm i concurrently -D
```

- Orquestrador

-- Gerenciar a inicialização dos serviços

--- Criar arquivos `./tests/orchestrator.js`

```
npm i async-retry@1.3.3
```

- Ajustar o timeout do JEST em `./jest.config.js`

> Workflow (Testes Automatizados)

```text
|-Workflow (Testes Automatizados)
| |-Event: "Pull Request"
| | |-Job: "Jest"
| | | |-Runner: "Ubuntu"
| | | |- |-Step: "Instalar dependências"
| | | |- |-Step: "Rodar bateria de testes"

```

> ESlint

- Padronização qualidade e padronização código

```
npm next lint
npm i -D eslint@8.57.0
npm i -D eslint-config-next@14.2.4
npm i -D eslint-plugin-jest@28.6.0
npm i -D eslint-config-prettier@9.1.0
```

> Lint

- Texto padronizado para commits

> Commits Padronização

- Conventional commits

- `https://commitlint.js.org/`
- `https://www.conventionalcommits.org/en/v1.0.0/`
- `https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines`

- Instalar

```
npm i -D @commitlint/cli@19.3.0
npm i -D @commitlint/config-conventional@19.2.2
```

- Criar arquivos na raiz do projeto: `commitlint.config.js`

- Criar commits usando o `commitlint`

- exemplos:

```
npx commitlint
echo "teste" | npx commitlint
echo "teste: mensagem principal" | npx commitlint
echo "feat: mensagem principal" | npx commitlint
echo "feat: (escopo): mensagem principal" | npx commitlint
```

- HUSKY: Hooks de commits

```
npm i -D husky@9.1.4
npx husky init
```

- criar arquivo `.husky/commit-msg`

##### END
