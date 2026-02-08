# Como Fazer o Deploy na Vercel

Siga os passos abaixo para colocar o seu projeto no ar (online) usando a Vercel.

## 1. Preparar o Código (GitHub)

1.  Crie um novo repositório no [GitHub](https://github.com/new).
2.  No seu terminal, dentro da pasta do projeto (`meus-treinos-v2`), envie o código para o GitHub:
    ```bash
    git init
    git add .
    git commit -m "Versão final para deploy"
    git branch -M main
    git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
    git push -u origin main
    ```
    *(Substitua `SEU_USUARIO` e `NOME_DO_REPO` pelos dados do seu repositório)*

## 2. Configurar na Vercel

1.  Acesse [vercel.com](https://vercel.com) e faça login.
2.  Clique em **Add New...** -> **Project**.
3.  Importe o repositório do GitHub que você acabou de criar.
4.  Na tela de configuração (**Configure Project**), procure a seção **Environment Variables** (Variáveis de Ambiente).
5.  Adicione as seguintes variáveis (pegue os valores no seu arquivo `.env.local` ou no painel do Supabase):

    *   `NEXT_PUBLIC_SUPABASE_URL`: (Sua URL do Supabase)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Sua chave Anon do Supabase)

6.  Clique em **Deploy**.

## 3. Finalizar

A Vercel vai construir o projeto e te dar um link (ex: `meu-projeto.vercel.app`).
Acesse esse link e teste o login com a senha `vivinte9`.

> **Nota:** Como o banco de dados é o Supabase (na nuvem), ele vai funcionar automaticamente no site online, contanto que as variáveis de ambiente estejam certas.
