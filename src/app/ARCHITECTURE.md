# Estrutura da aplicação

- `pages/`: telas e elementos específicos de cada tela.
- `services/`: serviços compartilhados da aplicação e integrações com API.
- `models/`: tipos e interfaces de domínio compartilhados.
- `core/`: infraestrutura transversal, como guards e interceptors.
- `shared/`: componentes, pipes e utilitários reutilizáveis.

Não crie pastas `services` ou `models` dentro de páginas ou componentes. Serviços
e modelos reutilizáveis devem ficar, respectivamente, em `app/services` e
`app/models`.
