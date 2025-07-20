# SvS Scheduler

Sistema de agendamento para ministros no jogo WOS (World of State). Permite que os presidentes criem links para que os jogadores se inscrevam para cargos específicos em datas definidas.

## Funcionalidades

### 🎯 Principal
- **Criação de Links**: Presidentes podem criar links de agendamento
- **Seleção de Datas**: Definir datas específicas para cada cargo ministerial
- **Cargos Disponíveis**:
  - Minister Education (Training Capacity: +200, Training Speed: +50%)
  - Vice President (Construction Speed: +10%, Search Speed: +10%, Training Speed: +10%)

### 📅 Seleção de Datas
- **Minister Education**: Selecione dia, mês e ano para quando o cargo estará ativo
- **Vice President**: Selecione dia, mês e ano para quando o cargo estará ativo
- **Visualização**: As datas aparecem claramente em cada seção de ministro

### 🔐 Segurança
- **Chave de Acesso**: Cada link possui uma chave única para remoção de jogadores
- **Validação de IDs**: Integração com API do WOS para validar IDs de jogadores
- **Informações do Jogador**: Exibe avatar, nível e nome do jogador automaticamente

### 📋 Agendamento
- **Slots de Tempo**: 48 slots de 30 minutos cada (00:00-23:30 UTC)
- **Prevenção de Duplicatas**: Um jogador só pode ocupar um slot por cargo
- **Informações Detalhadas**: Avatar, nível do fogão e nome do jogador

## Como Usar

1. **Criar um Link**:
   - Digite um nome para o link
   - Selecione a data para Minister Education (dia/mês/ano)
   - Selecione a data para Vice President (dia/mês/ano)
   - Clique em "Create link"
   - Guarde a chave de acesso para gerenciar o link

2. **Compartilhar o Link**:
   - Compartilhe o link gerado com os jogadores
   - Os jogadores verão as datas de cada cargo
   - Eles podem se inscrever nos horários disponíveis

3. **Gerenciar Inscrições**:
   - Use a chave de acesso para remover jogadores
   - Monitore as inscrições em tempo real

## Tecnologias

- **Frontend**: Vue 3 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **API**: WOS Game API para validação de jogadores

## Configuração do Banco de Dados

Se você ainda não adicionou os campos de data, execute o SQL em `database-migration.sql` no Supabase SQL Editor.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Estrutura do Projeto

```
src/
├── App.vue              # Componente principal com toda a lógica
├── main.js              # Entrada da aplicação
├── assets/              # Estilos CSS
└── components/          # Componentes auxiliares (não utilizados atualmente)
```

## Variáveis de Ambiente

Crie um arquivo `.env` com:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_WOS_API_SECRET_KEY=sua_chave_secreta_da_api_wos
```
