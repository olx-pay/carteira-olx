# OLX - Sistema de Login e Carteira

Este é um projeto que simula o sistema de login e carteira da OLX.

## Fluxo de Navegação

### 1. Página Inicial (Login)
- **Arquivo**: `index.html`
- **URL**: Acesse diretamente o arquivo `index.html` ou a raiz do projeto
- **Função**: Página de login onde o usuário insere seu e-mail

### 2. Página da Carteira
- **Arquivo**: `carteira.html`
- **Acesso**: Apenas através do login (redirecionamento automático)
- **Proteção**: Se tentar acessar diretamente, será redirecionado para o login

## Como Usar

1. **Inicie sempre pela página de login** (`index.html`)
2. Digite qualquer e-mail no campo de login
3. Clique em "Continuar"
4. Você será redirecionado automaticamente para a carteira
5. A carteira só pode ser acessada após o login

## Estrutura de Arquivos

```
olx/
├── index.html          # Página de login (página inicial)
├── carteira.html       # Página da carteira (protegida)
├── src/
│   └── assets/
│       └── images/     # Imagens do projeto
└── README.md          # Este arquivo
```

## Segurança

- A página da carteira possui verificação de autenticação
- Tentativas de acesso direto à carteira são redirecionadas para o login
- O fluxo garante que o usuário sempre passe pelo login primeiro

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Fontes do Google Fonts
- Ícones SVG inline

## 🛒 OLX - Sistema de Venda Concluída

Um sistema completo simulado da OLX para demonstrar o processo de finalização de venda, incluindo carteira digital, termos e condições, formulário de entrega e verificação facial.

## 📁 Estrutura do Projeto

```
olx/
├── index.html                 # Página principal do sistema
├── README.md                  # Este arquivo
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css      # Estilos do sistema OLX
│   │   ├── js/
│   │   │   └── main.js        # JavaScript com todas as funcionalidades
│   │   └── images/            # Pasta para imagens
│   ├── pages/                 # Pasta para páginas adicionais
│   └── components/            # Pasta para componentes
└── public/                    # Pasta para arquivos públicos
```

## ✨ Funcionalidades Implementadas

### 🎉 **Sistema de Venda Concluída**
- **Alerta de Sucesso**: Notificação automática quando a venda é finalizada
- **Carteira Digital**: Exibição do saldo disponível (R$ 1.250,00)
- **Botões de Ação**: Sacar e Transferir dinheiro
- **Design Responsivo**: Adapta-se a qualquer dispositivo

### 📋 **Processo de Finalização**
1. **Termos e Condições**: Modal com termos completos para aceitação
2. **Formulário de Entrega**: Coleta de dados pessoais e de entrega
3. **Upload de Foto**: Sistema para enviar foto do produto
4. **Dados Bancários**: Formulário para informações de pagamento
5. **Verificação Facial**: Simulação de reconhecimento facial

### 💬 **Suporte 24/7**
- **Chat Flutuante**: Botão de suporte sempre visível
- **Assistente Virtual**: Respostas automáticas inteligentes
- **Interface Intuitiva**: Chat moderno e responsivo
- **Respostas Contextuais**: Baseadas no conteúdo da mensagem

### 🎨 **Interface Moderna**
- **Design OLX**: Cores e estilo inspirados na OLX real
- **Animações Suaves**: Transições e efeitos visuais
- **Modais Interativos**: Janelas pop-up elegantes
- **Notificações**: Sistema de alertas em tempo real

## 🚀 Como Testar

### 1. **Abrir o Sistema**
```bash
# Simplesmente abra o arquivo index.html no navegador
start index.html
```

### 2. **Fluxo de Teste**
1. **Alerta Inicial**: Aparece automaticamente mostrando a venda concluída
2. **Ver Carteira**: Clique em "Ver Carteira" para ver o saldo
3. **Continuar Processo**: Clique em "Continuar Processo" para iniciar
4. **Aceitar Termos**: Marque o checkbox e clique em "Continuar"
5. **Preencher Formulário**: Complete todos os campos obrigatórios
6. **Upload de Foto**: Faça upload de uma imagem do produto
7. **Verificação Facial**: Simulação do processo de reconhecimento
8. **Chat de Suporte**: Clique no ícone de chat para testar o suporte

### 3. **Funcionalidades Específicas**

#### 💰 **Carteira Digital**
- Visualização do saldo
- Botões de saque e transferência
- Design moderno com animações

#### 📝 **Termos e Condições**
- Modal com termos completos
- Checkbox obrigatório para continuar
- Botão habilitado apenas após aceitação

#### 📋 **Formulário de Entrega**
- **Dados Pessoais**: Nome completo e telefone
- **Endereço**: CEP, estado, cidade, bairro, rua, número
- **Referência**: Campo para complementos
- **Foto do Produto**: Upload com preview
- **Dados Bancários**: Banco, agência, conta, CPF

#### 📷 **Verificação Facial**
- Simulação visual do processo
- Animação de scan
- Status de verificação em tempo real

#### 💬 **Chat de Suporte**
- Respostas automáticas inteligentes
- Reconhecimento de palavras-chave
- Interface moderna e responsiva

## 🎯 Palavras-chave do Chat

O assistente virtual responde automaticamente a:
- **"pagamento"** ou **"dinheiro"**: Informações sobre processamento
- **"entrega"** ou **"envio"**: Detalhes sobre entrega
- **"problema"** ou **"erro"**: Oferece ajuda
- **Outras mensagens**: Resposta genérica de suporte

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia Inter

## 📱 Responsividade

O sistema é totalmente responsivo:
- 📱 **Mobile**: 320px - 768px
- 📱 **Tablet**: 768px - 1024px
- 💻 **Desktop**: 1024px+

## 🎨 Cores e Design

### Paleta de Cores
- **Primária**: #ff6600 (Laranja OLX)
- **Secundária**: #2563eb (Azul)
- **Sucesso**: #10b981 (Verde)
- **Erro**: #ef4444 (Vermelho)
- **Info**: #3b82f6 (Azul claro)

### Elementos Visuais
- Gradientes modernos
- Sombras suaves
- Bordas arredondadas
- Animações fluidas

## 🔧 Funcionalidades Técnicas

### ✅ **Implementado**
- [x] Alerta de venda concluída
- [x] Carteira digital com saldo
- [x] Modal de termos e condições
- [x] Formulário completo de entrega
- [x] Upload de foto com preview
- [x] Verificação facial simulada
- [x] Chat de suporte 24/7
- [x] Sistema de notificações
- [x] Validação de formulários
- [x] Design responsivo
- [x] Animações e transições
- [x] Navegação por teclado (ESC para fechar modais)

### 🚀 **Recursos Avançados**
- **Modais Inteligentes**: Fecham ao clicar fora ou pressionar ESC
- **Validação em Tempo Real**: Campos obrigatórios destacados
- **Upload de Imagem**: Preview instantâneo
- **Chat Responsivo**: Adapta-se ao tamanho da tela
- **Notificações Contextuais**: Diferentes tipos (sucesso, erro, info)

## 📋 Checklist de Teste

### Fluxo Principal
- [ ] Alerta de sucesso aparece automaticamente
- [ ] Botão "Ver Carteira" funciona
- [ ] Botão "Continuar Processo" abre termos
- [ ] Checkbox habilita botão continuar
- [ ] Formulário valida campos obrigatórios
- [ ] Upload de foto funciona
- [ ] Verificação facial simula processo
- [ ] Chat de suporte responde

### Funcionalidades Específicas
- [ ] Menu mobile funciona
- [ ] Scroll suave entre seções
- [ ] Modais fecham corretamente
- [ ] Notificações aparecem e desaparecem
- [ ] Responsividade em diferentes tamanhos
- [ ] Animações funcionam suavemente

## 🔧 Desenvolvimento

### Para Desenvolvedores
1. Clone ou baixe o projeto
2. Abra `index.html` em um servidor local
3. Use as ferramentas de desenvolvedor para testar
4. Modifique os arquivos conforme necessário

### Estrutura de Arquivos
- `index.html`: Estrutura principal
- `src/assets/css/style.css`: Todos os estilos
- `src/assets/js/main.js`: Todas as funcionalidades JavaScript

## 📞 Suporte

Este é um sistema de demonstração criado para fins educacionais. Todas as funcionalidades são simuladas para demonstrar o processo completo de finalização de venda da OLX.

## 📄 Licença

Este projeto está sob domínio público. Use livremente para seus projetos pessoais e comerciais.

---

**Criado com ❤️ para demonstrar desenvolvimento web moderno e UX/UI avançado** 