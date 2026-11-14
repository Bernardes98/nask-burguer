# Nask Burguer — demonstração em React

Cardápio digital responsivo e painel administrativo de demonstração, construídos com React e Vite. O projeto foi pensado como peça de portfólio e como base visual para uma futura solução real da Nask.

## Rodar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Para gerar a versão estática que a Vercel publica:

```bash
npm run build
```

Na Vercel, importe o repositório Git e use `npm run build` como comando de build e `dist` como diretório de saída. O preset Vite costuma preencher esses campos automaticamente.

## O que já dá para demonstrar

- Cardápio responsivo com filtros por categoria e imagens da demonstração anterior.
- Personalização de lanche: adicionais, ingredientes removidos e observações.
- Sacola, sugestão de batata, escolha de entrega/retirada, endereço e forma de pagamento.
- Confirmação visual sem cobrança ou envio real de pedido.
- Área da loja com visão geral, pedidos fictícios, produtos editáveis no estado da tela, relatórios ilustrativos e mapa esquemático.
- Seleção de pedidos e geração de um link de rota do Google Maps com os endereços de exemplo.

## Limites atuais

Os dados são exemplos mantidos no front-end. Não há autenticação, persistência, banco de dados, integração com gateway de pagamento, geocodificação de endereços nem processamento de pedidos. O checkout não cobra e não envia pedidos. O mapa e os indicadores são ilustrativos. Antes de usar com clientes reais, é necessário construir o backend, integrar o Supabase, configurar regras de acesso e ligar um provedor de pagamento.

## Próxima etapa: Supabase

Depois de criar o projeto Supabase, copie `.env.example` para `.env.local` e preencha a URL do projeto e a chave pública (`anon`/publishable). Nunca coloque `service_role` ou outra chave secreta em variáveis `VITE_`, pois elas ficam expostas no navegador.

Uma evolução segura é começar com tabelas `products`, `categories`, `orders`, `order_items`, `customers`, `addresses` e `store_settings`; ativar Row Level Security; e criar políticas para a loja acessar somente seus dados. A criação do pedido e a confirmação do pagamento devem ser validadas por código de servidor/webhook, não apenas pelo front-end.

## Portfólio

Tecnologias: React, JavaScript, Vite e CSS responsivo. A arquitetura atual mantém catálogo, personalização, sacola, checkout demonstrativo e gestão de loja em componentes funcionais; a integração real de dados fica para uma próxima etapa.
