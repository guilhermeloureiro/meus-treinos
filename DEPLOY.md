# 🚀 Guia de Deploy no Vercel

## Pré-requisitos
- Conta no GitHub (https://github.com)
- Conta no Vercel (https://vercel.com)
- Supabase já configurado

## 📋 Passo a Passo

### 1️⃣ Preparar o Projeto

Primeiro, vamos inicializar o Git e fazer o commit inicial:

```bash
# Entrar na pasta do projeto
cd "/Users/guilhermeloureiro/Downloads/TREINO - GUILHERME/meus-treinos-v2"

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Meus Treinos v2"
```

### 2️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `meus-treinos-v2`
3. Deixe como **Público** ou **Privado** (sua escolha)
4. **NÃO** marque "Initialize with README"
5. Clique em **"Create repository"**

### 3️⃣ Conectar ao GitHub

Copie e cole os comandos que o GitHub mostrar, algo como:

```bash
git remote add origin https://github.com/SEU-USUARIO/meus-treinos-v2.git
git branch -M main
git push -u origin main
```

### 4️⃣ Deploy no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Add New Project"**
3. Clique em **"Import Git Repository"**
4. Selecione o repositório `meus-treinos-v2`
5. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (deixe como está)
   - **Build Command:** `npm run build` (já está configurado)
   - **Output Directory:** `.next` (já está configurado)

### 5️⃣ Configurar Variáveis de Ambiente

**IMPORTANTE:** Antes de fazer o deploy, adicione as variáveis de ambiente:

1. Na tela de configuração do Vercel, vá em **"Environment Variables"**
2. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL = https://lfklcnottlrlmaggdvzk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxma2xjbm90dGxybG1hZ2dkdnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NjgxMzYsImV4cCI6MjA4NjE0NDEzNn0.7cYQV1sak5xLhqzVKFfWlZCZdwqHwEUYZkPbai4Gq5g
```

3. Clique em **"Deploy"**

### 6️⃣ Aguardar o Deploy

O Vercel vai:
- Instalar as dependências
- Fazer o build do projeto
- Fazer o deploy

Isso leva cerca de 2-3 minutos.

### 7️⃣ Testar o App

Quando terminar, você receberá uma URL tipo:
```
https://meus-treinos-v2.vercel.app
```

Acesse e teste:
- ✅ Iniciar treino
- ✅ Criar novo treino
- ✅ Configurações
- ✅ Backup/Restore

## 🎨 PWA (Instalar no Celular)

O app já está configurado como PWA! Para instalar no celular:

### iPhone/iPad:
1. Abra a URL no Safari
2. Toque no ícone de compartilhar
3. Selecione "Adicionar à Tela de Início"

### Android:
1. Abra a URL no Chrome
2. Toque nos 3 pontinhos
3. Selecione "Adicionar à tela inicial"

## 🔧 Atualizações Futuras

Quando fizer mudanças no código:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

O Vercel vai fazer o deploy automático! 🚀

## ❓ Problemas Comuns

### Erro de Build
- Verifique se as variáveis de ambiente estão corretas
- Verifique se o Supabase está acessível

### App não carrega dados
- Verifique as variáveis de ambiente no Vercel
- Verifique se o Supabase tem os dados (rode o seed.sql)

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador (F12)
2. Logs do Vercel (na dashboard)
3. Logs do Supabase
