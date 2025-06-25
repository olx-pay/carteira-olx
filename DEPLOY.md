# 🚀 Como Fazer Deploy no GitHub Pages

## Passo a Passo para Publicar seu Site

### 1. Criar Conta no GitHub
- Acesse [github.com](https://github.com)
- Crie uma conta gratuita se ainda não tiver

### 2. Criar Novo Repositório
1. Clique no botão "+" no canto superior direito
2. Selecione "New repository"
3. Nome do repositório: `olx-site` (ou qualquer nome)
4. Deixe público (Public)
5. **NÃO** inicialize com README (já temos um)
6. Clique "Create repository"

### 3. Fazer Upload dos Arquivos
**Opção A - Via Interface Web:**
1. No repositório criado, clique em "uploading an existing file"
2. Arraste todos os arquivos da pasta `olx` para o GitHub
3. Adicione mensagem de commit: "Primeira versão do site OLX"
4. Clique "Commit changes"

**Opção B - Via Git (Recomendado):**
```bash
# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu nome de usuário)
git remote add origin https://github.com/SEU_USUARIO/olx-site.git

# Envie para o GitHub
git branch -M main
git push -u origin main
```

### 4. Ativar GitHub Pages
1. Vá para "Settings" do repositório
2. Role até "Pages" no menu lateral
3. Em "Source", selecione "Deploy from a branch"
4. Em "Branch", selecione "main" e "/ (root)"
5. Clique "Save"

### 5. Acessar seu Site
- Aguarde alguns minutos
- Seu site estará disponível em: `https://SEU_USUARIO.github.io/olx-site`

## 📁 Arquivos Importantes
- `index.html` - Página de login (página inicial)
- `carteira.html` - Página da carteira (protegida)
- `src/assets/images/` - Todas as imagens do projeto

## 🔒 Segurança
- A carteira só pode ser acessada após o login
- Tentativas de acesso direto são redirecionadas para o login

## 🌐 URL Final
Após o deploy, seu site estará em:
`https://SEU_USUARIO.github.io/olx-site`

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!** 