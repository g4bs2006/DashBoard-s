/**
 * Configuração de clínicas.
 *
 * Para adicionar uma nova clínica, basta adicionar uma entrada neste objeto.
 * A chave (slug) é usada na URL: dashboard.app?clinic=<slug>
 *
 * Tipos de step disponíveis:
 *   scheduled  → agendamento futuro pendente (Agendou, Reagendou)
 *   cancelled  → cancelado (Cancelou)
 *   attended   → compareceu mas não fechou (Compareceu e NÃO Fechou)
 *   converted  → compareceu e fechou (Compareceu e Fechou)
 *   missed     → faltou (Faltou)
 */
export const CLINICS = {
  'ob-clinic': {
    name: 'OBClinic',
    token: 'Bearer pn_gGIh0bpd6Al6jubejrT98ToHW7aavEn4RoY8Gg',
    panelId: '01198df6-cde4-454d-8717-703b98811b7a',
    ticket: 10000, // ticket médio padrão — editável no dashboard
    steps: {
      agendou: {
        id: '28f64455-4ba9-4da8-bc88-5d012480351f',
        label: 'Agendou',
        color: '#6366F1',
        type: 'scheduled',
      },
      reagendou: {
        id: 'fd74c42f-b568-4060-9685-9c6823d111cf',
        label: 'Reagendou',
        color: '#8B5CF6',
        type: 'scheduled',
      },
      cancelou: {
        id: 'a5a084cd-fd25-4e48-bb57-316622ab2c3e',
        label: 'Cancelou',
        color: '#EF4444',
        type: 'cancelled',
      },
      compareceuNaoFechou: {
        id: 'dfbc35bb-0ede-4e82-bde2-ea3fc8a4a567',
        label: 'Compareceu e NÃO Fechou',
        color: '#F59E0B',
        type: 'attended',
      },
      compareceuFechou: {
        id: '049505d3-c893-4e04-9bbe-0e245b120d48',
        label: 'Compareceu e Fechou',
        color: '#10B981',
        type: 'converted',
      },
      faltou: {
        id: '2c4f508a-dcc0-43e2-b16b-e82b2337fd82',
        label: 'Faltou',
        color: '#F97316',
        type: 'missed',
      },
    },
  },

  // ── Exemplo de como adicionar uma nova clínica ──────────────────────────────
  // 'nome-da-clinica': {
  //   name: 'Nome Exibido no Dashboard',
  //   token: 'Bearer pn_TOKEN_AQUI',
  //   panelId: 'UUID_DO_PAINEL',
  //   steps: {
  //     agendou:            { id: 'UUID', label: 'Agendou',                    color: '#6366F1', type: 'scheduled'  },
  //     reagendou:          { id: 'UUID', label: 'Reagendou',                  color: '#8B5CF6', type: 'scheduled'  },
  //     cancelou:           { id: 'UUID', label: 'Cancelou',                   color: '#EF4444', type: 'cancelled'  },
  //     compareceuNaoFechou:{ id: 'UUID', label: 'Compareceu e NÃO Fechou',    color: '#F59E0B', type: 'attended'   },
  //     compareceuFechou:   { id: 'UUID', label: 'Compareceu e Fechou',        color: '#10B981', type: 'converted'  },
  //     faltou:             { id: 'UUID', label: 'Faltou',                     color: '#F97316', type: 'missed'     },
  //   },
  // },
}
