# Meus Treinos v2

App de treinos para academia com banco de dados persistente.

## 🚀 Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **PWA**: Instalável no celular

## 📦 Setup

Veja o arquivo [SETUP.md](./SETUP.md) para instruções completas de configuração.

## 🏋️ Funcionalidades

- ✅ 5 treinos pré-cadastrados (Segunda a Sexta)
- ✅ Criar, editar e excluir treinos personalizados
- ✅ Marcar exercícios como completos durante o treino
- ✅ Histórico dos últimos 10 treinos
- ✅ Contador de ciclos completos
- ✅ Rotação automática de treinos
- ✅ Backup/Export de dados
- ✅ PWA - Funciona offline e pode ser instalado no celular

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

## 📱 Instalar no Celular

Após o deploy, acesse a URL no celular e:
- **iPhone**: Safari > Compartilhar > Adicionar à Tela de Início
- **Android**: Chrome > Menu > Adicionar à tela inicial

---

Desenvolvido com 💪 para treinos na academia
