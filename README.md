# Controle de Estoque - Refatoração Estrutural

## Sobre esta branch

Esta branch traz uma reestruturação completa do sistema, separando front-end e back-end, implementando dashboard analítico, lixeira de produtos, melhorias de CORS, e muito mais.

## Principais mudanças

- Separação clara entre front-end (React + Vite) e back-end (Node.js/Express)
- Novos endpoints RESTful para analytics e dashboard
- Implementação de lixeira de produtos (soft delete)
- Gráficos de estoque, alertas e distribuição por família
- Correção e padronização de CORS
- Código mais modular e organizado

## Como rodar o projeto

### Back-end

```sh
cd back-end
npm install
npm run dev
```

### Front-end

```sh
cd front-end
npm install
npm run dev
```

Acesse o front-end em [http://localhost:5173](http://localhost:5173).

## Observações

- Certifique-se de configurar o banco de dados conforme o arquivo `.env.example`.
- Veja a documentação da API em `/api-docs` no back-end.

---

Contribuições e sugestões são bem-vindas!
