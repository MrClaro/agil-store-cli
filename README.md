# AgilStore CLI - Sistema de Gerenciamento de Inventário

O **AgilStore CLI** é uma aplicação de linha de comando robusta desenvolvida para otimizar o controle de estoque de uma loja de eletrônicos. O sistema permite realizar o ciclo completo de gerenciamento de produtos (CRUD) com uma interface interativa, validação de dados rigorosa e persistência em arquivo.

## Tecnologias Utilizadas

Para garantir uma experiência de usuário (UX) moderna e código de alta qualidade, foram utilizadas as seguintes ferramentas:

| Tecnologia | Descrição |
| --- | --- |
| **Node.js** | Ambiente de execução JavaScript (LTS). |
| **@clack/prompts** | Interface de linha de comando (CLI) moderna e interativa. |
| **Zod** | Validação de esquemas e integridade de dados. |
| **fs-extra** | Manipulação simplificada e assíncrona do sistema de arquivos (JSON). |
| **cli-table3** | Renderização de tabelas formatadas no terminal. |
| **Picocolors** | Estilização de cores no terminal para melhor feedback visual. |

---

## Arquitetura e Diferenciais Técnicos

Diferente de scripts simples, este projeto aplica princípios de **Engenharia de Software** para garantir escalabilidade e manutenção:

1. **Service/Repository Pattern**: A lógica de persistência (`storage.js`) é separada da lógica de negócio (`productService.js`), que por sua vez é independente da interface de usuário (`commands/`).
2. **Tratamento de Precisão Monetária**: Seguindo boas práticas de sistemas financeiros, os preços são processados e armazenados como **inteiros (centavos)**. Isso evita erros de arredondamento inerentes ao ponto flutuante do JavaScript (IEEE 754).
3. **Padronização de Categorias**: Uso de um arquivo `categories.json` para garantir a consistência dos dados, evitando erros de digitação e facilitando a filtragem.
4. **Internacionalização do Código**: Toda a estrutura de variáveis, funções e nomes de arquivos foi escrita em **Inglês**, mantendo apenas as mensagens da interface em Português para o usuário final.
5. **Validação com Zod**: Garantia de que nenhum produto seja cadastrado com preços negativos, campos vazios ou tipos de dados incorretos.

---

## Como Rodar a Aplicação

### Pré-requisitos

* Node.js (v18 ou superior)
* npm ou pnpm

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MrClaro/agil-store-cli.git

```


2. Acesse a pasta do projeto:
```bash
cd agil-store-cli

```


3. Instale as dependências:
```bash
npm install

```



### Execução

Para iniciar o sistema, basta rodar:

```bash
npm start

```

---

## Estrutura do Projeto

```text
agil-store/
├── data/               # Arquivos de persistência JSON
├── src/
│   ├── commands/       # Controladores da CLI (Interação com o usuário)
│   ├── database/       # Camada de acesso a dados (Repository)
│   ├── schemas/        # Esquemas de validação (Zod)
│   ├── services/       # Regras de negócio da aplicação
│   └── index.js        # Ponto de entrada (Menu principal)
├── package.json        # Dependências e scripts
└── README.md           # Documentação

```

---

## Requisitos Implementados

* [x] **Adicionar Produto**: Geração de ID único e validação de campos.
* [x] **Listar Produtos**: Exibição em tabela com opções de ordenação e filtros.
* [x] **Atualizar Produto**: Atualização seletiva de campos com validação parcial.
* [x] **Excluir Produto**: Busca por ID com confirmação de segurança antes da remoção.
* [x] **Buscar Produto**: Busca flexível por ID ou parte do nome.
* [x] **Persistência**: Salvamento automático em arquivos JSON.

---
