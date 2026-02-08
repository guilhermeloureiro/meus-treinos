# Meus Treinos v2 - Guia de Setup

## 📋 Passo a Passo para Deploy

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login (ou crie uma conta gratuita)
2. Clique em "New Project"
3. Preencha:
   - **Name**: Meus Treinos
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: South America (São Paulo) - mais próximo do Brasil
4. Clique em "Create new project" e aguarde ~2 minutos

### 2. Configurar o Banco de Dados

1. No painel do Supabase, vá em **SQL Editor** (ícone de código no menu lateral)
2. Clique em "New Query"
3. Copie TODO o conteúdo do arquivo `supabase/schema.sql` e cole no editor
4. Clique em "Run" (ou pressione Ctrl+Enter)
5. Aguarde a mensagem de sucesso ✅

6. Agora vamos adicionar os treinos:
   - Clique em "New Query" novamente
   - Copie TODO o conteúdo do arquivo `supabase/seed.sql` e cole
   - Clique em "Run"
   - Aguarde a mensagem de sucesso ✅

### 3. Pegar as Credenciais

1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API** no menu lateral
3. Você verá duas informações importantes:
   - **Project URL**: algo como `https://xxxxx.supabase.co`
   - **anon public**: uma chave longa começando com `eyJ...`

4. Copie essas informações e cole no arquivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

### 4. Testar Localmente

```bash
cd meus-treinos-v2
npm run dev
```

Abra http://localhost:3000 e veja se os 5 treinos aparecem!

### 5. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New Project"
3. Importe o repositório `meus-treinos-v2`
4. Configure as **Environment Variables**:
   - Adicione `NEXT_PUBLIC_SUPABASE_URL` com o valor do Supabase
   - Adicione `NEXT_PUBLIC_SUPABASE_ANON_KEY` com o valor do Supabase
5. Clique em "Deploy"
6. Aguarde ~2 minutos e pronto! 🎉

### 6. Instalar no Celular (PWA)

**No iPhone:**
1. Abra o Safari e acesse a URL do Vercel (ex: `meustreinos.vercel.app`)
2. Toque no ícone de compartilhar (quadrado com seta)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Toque em "Adicionar"

**No Android:**
1. Abra o Chrome e acesse a URL do Vercel
2. Toque nos 3 pontinhos (menu)
3. Toque em "Adicionar à tela inicial"
4. Toque em "Adicionar"

Pronto! Agora você tem o app instalado no celular! 📱

---

## 🔧 Comandos Úteis

```bash
# Rodar localmente
npm run dev

# Build de produção
npm run build

# Rodar build de produção
npm start
```

## 📝 Notas Importantes

- Os dados ficam salvos no Supabase (banco de dados real)
- Você pode acessar de qualquer dispositivo
- O app funciona offline (últimos dados carregados)
- Backup/Export ainda salva localmente (JSON)

## 🆘 Problemas Comuns

**Erro "Failed to fetch workouts":**
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o schema.sql foi executado no Supabase

**App não carrega:**
- Limpe o cache do navegador
- Verifique se o deploy na Vercel foi bem-sucedido

**Treinos não aparecem:**
- Verifique se o seed.sql foi executado
- Vá no Supabase > Table Editor > workouts e veja se tem dados
