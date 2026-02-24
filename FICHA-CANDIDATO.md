# Pokédex - Product Showcase

## Seção 1: Instruções para rodar
Variáveis de ambiente

- Não utilizei nenhuma variável de ambiente.
- A API consumida é pública (PokeAPI) e o projeto faz requisições diretamente pela URL.

Rodar o projeto

Execute o comando dentro da pasta do projeto (onde está o package.json).

Exemplo:
- C:\Users\...\product-showcase\ProductShowcase

```
npm run dev
```

Depois é só abrir a URL que o Vite mostrar no terminal
(normalmente http://localhost:5173)

## Seção 2: Decisões de design
Por que escolhi essa estrutura de pastas?

Eu tentei deixar tudo bem separado pra facilitar manutenção e crescimento do projeto:

pages/ -> Telas principais (Home e Detalhes)

components/ -> Componentes reaproveitáveis (Card, Loader, barra do time)

api/ -> Serviço de chamadas HTTP com axios (separado da UI)

types/ -> Tipagens do que uso da PokeAPI

utils/ -> Funções auxiliares (extrair ID, montar imagem oficial e cache)

context/ -> Context API para gerenciar o “Time Pokémon” (favoritos)

Essa separação ajuda a evitar misturar lógica de negócio com interface e deixa o projeto escalável.


Maior dificuldade e como resolvi

A parte mais chatinha foi a lista inicial:
O endpoint que lista os pokémons não retorna imagem — apenas nome e URL do detalhe.

Exemplo:

https://pokeapi.co/api/v2/pokemon/1/

Pra resolver isso:

Extraí o ID do Pokémon pela URL

Usei esse ID para montar a URL do official artwork

Isso permitiu exibir imagens sem precisar fazer requisição extra para cada item.

Outra dificuldade foi o layout dos cards.

O grid padrão acabava “espremendo” os cards dependendo da tela, então ajustei para:

Colunas automáticas

Largura fixa por card

Assim o layout fica consistente.

Funcionalidades implementadas
Filtro (Client-side)

Na Home existe um campo de busca que filtra a lista de Pokémon por nome.

O filtro:

é feito no cliente

usa useMemo

evita processamento desnecessário a cada render

Time Pokémon (Favoritos com Context API)

Implementei um sistema de favoritos usando Context API.

Funcionalidades:

Permite favoritar até 6 Pokémons

Time é persistido com localStorage

Exibido em uma barra fixa no site

Possível remover individualmente

Possível limpar todo o time

Cache da API

Implementei cache simples usando:

localStorage

TTL (tempo de expiração)

O cache é aplicado em:

Lista de Pokémons

Detalhes de cada Pokémon

Isso evita chamadas repetidas à API ao navegar ou recarregar a página.

Atualização (Refresh)

Existe um botão Atualizar na Home que:

Limpa o cache da lista

Limpa o cache dos detalhes

Refaz o fetch da lista

Revalida os favoritos (Time Pokémon)

Isso garante que os dados fiquem atualizados mesmo com cache ativo.

# Melhorias que eu faria com mais tempo

Skeleton loading nos cards

UI de erro mais padronizada

Melhor acessibilidade (focus trap no modal + ESC para fechar)

Ícone de favorito direto no card

Scroll infinito ou paginação

Testes básicos (utils e service)

Lint + Prettier para padronização