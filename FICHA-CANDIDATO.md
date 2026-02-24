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

### Por que escolhi essa estrutura de pastas?

A organização do projeto foi pensada para facilitar a manutenção e permitir o crescimento sustentável da aplicação. A estrutura ficou assim:

- **`pages/`** - Telas principais da aplicação (Home e Detalhes)
- **`components/`** - Componentes reutilizáveis como `Card`, `Loader` e a barra do time
- **`api/`** - Camada de serviço com chamadas HTTP via `axios`, separada da interface
- **`types/`** - Tipagens TypeScript baseadas nos dados da PokeAPI
- **`utils/`** - Funções auxiliares para extrair ID, montar URLs de imagem oficial e gerenciar cache
- **`context/`** - Context API para gerenciar o estado global do "Time Pokémon" (favoritos)

Essa separação clara entre lógica de negócio e interface torna o projeto mais escalável e fácil de dar manutenção.

---

### Maior dificuldade e como resolvi

O maior desafio técnico foi lidar com a lista inicial de Pokémons.  
O endpoint da PokeAPI que retorna a lista não fornece imagens diretamente, apenas o nome e a URL para os detalhes de cada Pokémon.  

Exemplo de retorno:
```
https://pokeapi.co/api/v2/pokemon/1/
```

**Solução:**  
Extraí o ID do Pokémon a partir da URL fornecida e, com ele, montei dinamicamente a URL da imagem oficial (`official artwork`).  
Isso permitiu exibir as imagens corretamente sem precisar disparar uma requisição extra para cada item da lista.

---

### Outro obstáculo: o layout dos cards

O comportamento padrão do CSS Grid acabava "espremendo" os cards em telas menores.  
Para contornar isso, configurei o grid com:

- Colunas automáticas (`auto-fit`)
- Largura fixa por card

Com isso, o layout ficou consistente em diferentes tamanhos de tela, mantendo a organização visual esperada.

---

## Funcionalidades implementadas

### Filtro (client-side)

Na página inicial, há um campo de busca que filtra a lista de Pokémons por nome.  
O filtro é aplicado no cliente com o hook `useMemo`, garantindo que o processamento só ocorra quando necessário — evitando recálculos desnecessários a cada renderização.

---

### Time Pokémon (favoritos com Context API)

Criei um sistema de favoritos utilizando a Context API, com as seguintes funcionalidades:

- Adicionar Pokémons ao time (limite de 6)
- Remover individualmente
- Limpar todo o time
- Time salvo no `localStorage` para persistência
- Barra fixa exibindo os favoritos em todas as telas

---

### Cache da API

Para evitar chamadas desnecessárias à API, implementei um cache simples baseado em:

- `localStorage`
- TTL (tempo de expiração)

Esse cache é aplicado tanto na **lista de Pokémons** quanto nos **detalhes individuais**, garantindo melhor desempenho ao navegar ou recarregar a aplicação.

---

### Atualização (refresh)

Na página Home, há um botão **Atualizar** que:

- Limpa o cache da lista e dos detalhes
- Refaz a requisição da lista
- Revalida os favoritos (Time Pokémon)

Isso garante que os dados estejam sempre atualizados, mesmo com o cache ativo.

---

## Melhorias que faria com mais tempo

- **Skeleton loading** nos cards para melhorar a percepção de carregamento
- **UI de erro padronizada** para feedback ao usuário
- Melhorias de **acessibilidade** (como focus trap no modal e fechar com ESC)
- Ícone de favorito direto no card
- **Scroll infinito** ou paginação na listagem
- **Testes automatizados** básicos para utilitários e serviços
- Configuração de **Lint + Prettier** para padronização do código
  
Seção 3: Link para Deploy (Bônus)
```
https://projetopokedex-azure.vercel.app/
```

## Seção final: Recomendações

### Dicas que aprendi fazendo esse projeto

**1. Organiza as pastas antes de começar**
No começo eu misturava tudo, mas aprendi que separar as coisas ajuda muito. Deixa pages/, components/, utils/ cada um no seu canto.

**2. API pública tem limites**
A PokeAPI é legal mas se você ficar fazendo requisição toda hora pode ficar lento. Coloca um cache no localStorage que já ajuda.

**3. Escolhe o gerenciamento de estado certo**
Context API resolveu meu caso, mas se o projeto crescer muito talvez precise de algo mais forte.

**4. Salva as coisas no navegador**
O usuário gosta quando o time dele continua lá depois que atualiza a página. localStorage salva vidas.

---

## Seção final: Recomendações

### Dicas para quem for fazer este desafio

**1. Organize as pastas antes de começar**
Separe pages/, components/, utils/ cada um no seu canto. Isso ajuda na manutenção.

**2. Cuidado com requisições à API**
A PokeAPI é pública mas muitas chamadas deixam lento. Use cache no localStorage.

**3. Escolha o gerenciamento de estado certo**
Context API funciona bem, mas avalie outras opções se o projeto crescer.

**4. Persista dados importantes**
Salvar o time no localStorage melhora a experiência do usuário.

**5. Teste em diferentes telas**
Verifique se o layout não quebra no celular.

**6. Filtro simples resolve**
UseMemo é suficiente, não precisa de biblioteca externa.

---

### Melhorias que podem ser feitas

**Performance**
- Virtualização da lista
- Debounce no filtro
- Lazy loading das imagens

**Qualidade**
- Testes unitários
- ESLint + Prettier

**Acessibilidade**
- Navegação por teclado
- Fechar modal com ESC

**Experiência**
- Skeleton loading
- Mensagens de erro
- Feedback visual

---

### Possíveis evoluções

- Sistema de login
- Tema escuro
- Comparação entre Pokémons
- Mais detalhes (habilidades, evoluções)
- Tradução
- Compartilhar time

---
