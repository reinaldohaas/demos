# 🔬 Hub de Demonstrações & Visualizações Científicas

> Repositório organizado para armazenar, testar localmente e publicar simulações e visualizações científicas interativas geradas com **Modelos de Linguagem (LLMs)** (Gemini, Claude, GPT, DeepSeek, etc.).

---

## 🌟 Demonstrações Disponíveis

| Ícone | Demonstração | Categoria | Descrição |
| :---: | :--- | :--- | :--- |
| 🌍 | [**Pêndulo de Foucault 3D & 5 Latitudes**](demos/foucault-pendulum/index.html) | Geofísica / Rotação da Terra | Simulação 3D da Terra girando no espaço com 5 pêndulos simultâneos (+90°, +30°, 0°, -30°, -90°), rosetas no solo e curva do período inercial $T = \frac{12\text{h}}{\|\sin\phi\|}$. |
| 🌊 | [**Raio de Deformação de Rossby 2D**](demos/rossby-radius/index.html) | Oceanografia / Águas Rasas | Simulação 2D hidrodinâmica Shallow Water com foco no Polo Sul (-90°) e latitudes globais, controle de tamanho da perturbação $L$, ajuste geostrófico ($L > R_d$) e ondas gravitacionais ($L < R_d$). |

---

## 🚀 Como Executar o Servidor Localmente

### Opção 1: Com 1 Clique (Windows)
* Dê um **duplo clique no arquivo `start_server.bat`**.
* O servidor iniciará e abrirá automaticamente o catálogo no seu navegador em `http://127.0.0.1:8080`.

### Opção 2: Pelo Terminal / PowerShell
```powershell
cd C:\Users\haas\github\demos
python server.py
# ou com uv:
uv run python server.py
```

---

## ➕ Como Adicionar Novas Visualizações (Outras LLMs)

1. Crie uma nova pasta dentro de `demos/` com o nome da sua demonstração:
   ```
   demos/nome-da-sua-demo/index.html
   ```
2. Adicione ou copie seu código HTML/CSS/JavaScript (você pode usar o modelo base em `demos/_template/index.html`).
3. Abra o arquivo `demos.json` na raiz e adicione o registro da sua nova demo:
   ```json
   {
     "id": "nome-da-sua-demo",
     "title": "Título da Nova Simulação",
     "category": "Área Científica",
     "llm": "Claude 3.7 / GPT-4o / DeepSeek / etc.",
     "icon": "⚡",
     "tags": ["Tag1", "Tag2"],
     "description": "Explicação resumida da simulação.",
     "path": "demos/nome-da-sua-demo/index.html",
     "date": "2026-08-20"
   }
   ```
4. O catálogo principal (`index.html`) atualizará o card automaticamente com busca, filtros e botões de lançamento!

---

## 🌐 Publicar Gratuitamente no GitHub Pages

1. Faça o commit e push para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "Adiciona novas demonstrações"
   git push origin main
   ```
2. No seu repositório no GitHub, vá em **Settings** > **Pages**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`.
4. Clique em **Save**. Em segundos, seu catálogo e todas as demonstrações estarão online publicamente no endereço:
   `https://reinaldohaas.github.io/demos/`

---

## 📁 Estrutura do Repositório

```
demos/
├── index.html                 # Portal / Catálogo principal
├── demos.json                 # Registro de metadados de todas as demonstrações
├── server.py                  # Servidor local Python integrado
├── start_server.bat           # Inicializador de 1 clique para Windows
├── start_server.ps1           # Script PowerShell
├── README.md                  # Documentação do repositório
│
├── demos/
│   ├── foucault-pendulum/     # Pêndulo de Foucault 3D & Período Inercial
│   │   └── index.html
│   ├── rossby-radius/         # Raio de Rossby 2D & Shallow Water
│   │   └── index.html
│   └── _template/             # Template base para novas demos
│       └── index.html
└── assets/                    # Recursos compartilhados
```

