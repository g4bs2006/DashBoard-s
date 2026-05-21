# 🦷 Dashboard Odontológico — Multi-Clínica

> **Dashboard de performance em tempo real para clínicas odontológicas**, integrado à plataforma Helena (WTS.chat) via API. Multi-clínica, sem redeploy — basta um `accountId` na URL.

---

## ✨ Visão Geral

```
https://seu-dominio.vercel.app/?accountId=3e35f9a6-4f6b-430c-9f80-b7b4b41fbca7
```

Cada clínica acessa seu próprio dashboard com a URL acima. As credenciais ficam seguras no **Supabase** — nunca expostas no frontend ou no repositório.

---

## 🖥️ Screenshots

### KPIs + Receita
```
┌─────────────────────────────────────────────────────────────────────┐
│  Total    Comparec.  Conversão   Faltas   Cancel.   Reagend.  Ticket│
│  66       33,3%      40,0%       66,7%    4         3         R$12k │
│  ↑340%    ↑44,4%     ↑20,0%      ↓13,3%   ↑300%     —         —    │
├──────────────────────────────────────────────────────────────────────┤
│  RECEITA · baseado nos valores reais dos cards                       │
│  ┌──────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ ✓ Receita Fechada        │  │ ↗ Oportunidade Perdida           │ │
│  │ R$ 51.060                │  │ R$ 95.000                        │ │
│  │ 6 contratos fechados     │  │ 14 pacientes não fecharam        │ │
│  └──────────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Gráfico + Distribuição por Etapa
```
┌──────────────────────────────────┬───────────────────────────────┐
│  📈 Evolução temporal            │  Distribuição por etapa       │
│                                  │                               │
│     ╭─╮                          │  Agendou          ████  12   │
│    ╭╯ ╰╮     ╭─╮                 │  Compareceu NF    ███   8    │
│   ╭╯   ╰─────╯ ╰╮                │  Faltou           ██    5    │
│  ─────────────────────           │  Cancelou         █     3    │
│  Jan  Fev  Mar  Abr  Mai         │                               │
│                                  │  [ Período ] [ Geral ]        │
└──────────────────────────────────┴───────────────────────────────┘
```

### Tabela + Calendário
```
┌──────────────────────────────────────────────────────────────────┐
│  Compareceu mas não fechou          RECUPERÁVEL                  │
│  ┌──────────────┬──────────────┬──────────┬────────────────────┐ │
│  │ Paciente     │ Telefone     │ Data     │ Potencial          │ │
│  ├──────────────┼──────────────┼──────────┼────────────────────┤ │
│  │ Maria Silva  │ (11) 9xxxx   │ 20/05    │ R$ 8.500           │ │
│  │ João Souza   │ (21) 9xxxx   │ 18/05    │ sem valor ⚠        │ │
│  └──────────────┴──────────────┴──────────┴────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (React)                          │
│   ?accountId=uuid  →  fetchDashboard()  →  /api/dashboard      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│               VERCEL SERVERLESS (api/dashboard.js)              │
│                                                                 │
│   1. Busca config da clínica no Supabase (accountId)           │
│   2. Chama Helena API (paginado, paralelo)                      │
│   3. Parseia cards + datas das descrições                       │
│   4. Calcula ticket médio real                                  │
│   5. Retorna JSON compacto ao frontend                         │
└──────────┬──────────────────────────────┬───────────────────────┘
           │                              │
┌──────────▼──────────┐       ┌──────────▼──────────────────────┐
│     SUPABASE        │       │        HELENA API               │
│  tabela: clinics    │       │   api.wts.chat/crm/v1/panel     │
│  - account_id       │       │   - cards paginados             │
│  - token            │       │   - monetaryAmount              │
│  - panel_id         │       │   - stepId                      │
│  - steps (JSON)     │       │   - description (data/hora)     │
└─────────────────────┘       └─────────────────────────────────┘
```

---

## 📊 KPIs Calculados

| Indicador | Fórmula | Descrição |
|-----------|---------|-----------|
| **Comparecimento** | `(compareceu + fechou) ÷ (compareceu + fechou + faltou)` | Taxa de presença nas consultas |
| **Conversão** | `fechou ÷ (compareceu + fechou)` | Taxa de fechamento entre os que vieram |
| **Faltas** | `faltou ÷ (compareceu + fechou + faltou)` | Taxa de ausência |
| **Ticket Médio** | `Σ monetaryAmount(fechados) ÷ n` | Calculado dos valores reais da API |
| **Receita Fechada** | `Σ monetaryAmount(converted)` | Apenas valores reais — sem estimativa |
| **Oport. Perdida** | `Σ monetaryAmount(attended)` | Pacientes que vieram mas não fecharam |

> ⚠️ Cards sem `monetaryAmount` **não entram** nos cálculos de receita — aparecem em alerta separado com nome e telefone para acompanhamento.

---

## 🗂️ Estrutura do Projeto

```
DashBoard-s/
│
├── api/
│   └── dashboard.js          # Serverless function (Vercel)
│
├── src/
│   ├── App.jsx               # Componente raiz, estado global, layout
│   ├── api.js                # fetchDashboard() — chamada ao backend
│   │
│   ├── components/
│   │   ├── KpiStrip.jsx      # Faixa de KPIs com sparklines e deltas
│   │   ├── RevenueRow.jsx    # Cards de receita fechada e oportunidade
│   │   ├── TrendChart.jsx    # Gráfico de evolução temporal (Recharts)
│   │   ├── StepDistribution.jsx  # Barras por etapa (Período / Geral)
│   │   ├── LostTable.jsx     # Pacientes que compareceram e não fecharam
│   │   ├── UpcomingTable.jsx # Próximos agendamentos
│   │   └── DateRangePicker.jsx   # Calendário customizado de seleção
│   │
│   └── utils/
│       ├── parseCards.js     # KPIs, receita, delta, getLost, getUpcoming
│       └── groupByTime.js    # Agrupamento por dia/semana/mês
│
├── .env                      # 🔒 NÃO commitado — variáveis de ambiente
├── vercel.json               # Roteamento das serverless functions
└── vite.config.js            # Plugin local para emular /api em dev
```

---

## ⚙️ Tipos de Step (Helena)

Cada step do painel Helena é mapeado para um `type` semântico:

| type | Significado | Exemplos de step |
|------|-------------|-----------------|
| `scheduled` | Agendamento futuro | Agendou, Reagendou |
| `attended` | Compareceu, não fechou | Compareceu e NÃO Fechou |
| `converted` | Fechou contrato | Compareceu e Fechou |
| `missed` | Faltou | Faltou |
| `cancelled` | Cancelou | Cancelou |

---

## 🚀 Como Adicionar uma Nova Clínica

### Via Supabase (recomendado)

```sql
INSERT INTO clinics (account_id, name, token, panel_id, ticket, steps)
VALUES (
  'uuid-da-clinica',
  'Nome da Clínica',
  'Bearer pn_TOKEN_AQUI',
  'UUID_DO_PAINEL',
  12000,
  '{
    "agendou":             {"id": "UUID", "label": "Agendou",                 "color": "#6366F1", "type": "scheduled"},
    "reagendou":           {"id": "UUID", "label": "Reagendou",               "color": "#8B5CF6", "type": "scheduled"},
    "cancelou":            {"id": "UUID", "label": "Cancelou",                "color": "#EF4444", "type": "cancelled"},
    "compareceuNaoFechou": {"id": "UUID", "label": "Compareceu e NÃO Fechou", "color": "#F59E0B", "type": "attended"},
    "compareceuFechou":    {"id": "UUID", "label": "Compareceu e Fechou",     "color": "#10B981", "type": "converted"},
    "faltou":              {"id": "UUID", "label": "Faltou",                  "color": "#F97316", "type": "missed"}
  }'::jsonb
);
```

**URL gerada automaticamente:**
```
https://dashboard.vercel.app/?accountId=uuid-da-clinica
```

Nenhum redeploy necessário. ✅

---

## 🛠️ Rodando Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de variáveis de ambiente
cp .env.example .env
# Preencher SUPABASE_URL e SUPABASE_SERVICE_KEY

# 3. Rodar em desenvolvimento
npm run dev

# Acessar:
# http://localhost:5174/?accountId=SEU_ACCOUNT_ID
```

### Variáveis de Ambiente

```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
```

> No **Vercel**: adicione em Settings → Environment Variables antes do deploy.

---

## 📦 Deploy (Vercel)

```bash
# Deploy direto
vercel --prod

# Ou conecte o repositório GitHub na Vercel UI
# e configure as Environment Variables
```

O `vercel.json` já está configurado para rotear `/api/*` para as serverless functions.

---

## 🔧 Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Estilização | Tailwind CSS v3 |
| Gráficos | Recharts |
| Calendário | Customizado (date-fns) |
| Backend | Vercel Serverless Functions |
| Banco de dados | Supabase (PostgreSQL) |
| CRM | Helena / WTS.chat API |
| Deploy | Vercel |

---

## 🔒 Segurança

- Token Helena e service key Supabase ficam **apenas no servidor** (nunca no bundle do frontend)
- RLS (Row Level Security) habilitado na tabela `clinics`
- `.env` no `.gitignore` — credenciais nunca vão para o repositório

---

*Dashboard Odontológico v2 · Escalarodonto*
