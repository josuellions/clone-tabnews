# CRUSO - curso.dev

## Data Inicio: 20/06/2023

## Instrutor: Filipe Deshamps

## clone-tabnew

Projeto clone tabnews `filipe deshamps` para estudo acadêmico do `curso.dev`

### Ambiente

-> Node v18.16.1
-- Definir nvm padrão no projeto
--- Criar um arquivo ".nvmrc" na raiz do projeto e colocar o nome da versão do node ex.: "lts/hydrogen"

```
$ nvm install lts/hydrogen
$ nvm use 18.16.1
```

-> NextJS

- Criar manifesto do projeto com `package.json`

```
$ npm init
$ npm install next@13.1.6
```

-> React

```
$ npm install react@18.2.0
$ npm install react-dom@18.2.0
```

-> Criando estrutura do projeto
-- Criar diretório `/pages/index.js`

# CURL

- Testes para visualizar o dados HTTP
  `curl http://localhost:3000/api/status -v`

# DOCKER POSTGRES

- criar arquivo `\infra\compose.yaml`
  -- criar parâmetros de configurações do docker no arquivo criado
  -- acessar o diretório do arquivo e executar os comandos

  ```
  $ docker compose -f infra/compose.yaml up
  ```

# CLIENT POSTGRES

- Instalar pacote

  ```
  $ npm install pg@8.11.3
  ```

- criar arquivo `\infra\database.js`
  -- criar função de conexão e query com banco dados
  -- acessar o diretório do arquivo e executar os comandos
