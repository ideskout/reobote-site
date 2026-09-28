export const ESTAGIOS = ["novo", "contato", "visita", "proposta", "fechado", "perdido"] as const;
export type Estagio = (typeof ESTAGIOS)[number];

export const ESTAGIO_LABEL: Record<Estagio, string> = {
  novo: "Novo",
  contato: "Contato",
  visita: "Visita",
  proposta: "Proposta",
  fechado: "Fechado",
  perdido: "Perdido",
};

export type Cliente = {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  origem: string;
  notas: string;
  created_at: string;
};

export type LeadEvento = {
  id: string;
  descricao: string;
  created_at: string;
};

export type Lead = {
  id: string;
  estagio: Estagio;
  origem: string;
  created_at: string;
  cliente: { nome: string; telefone: string | null; email: string | null } | null;
  imovel: { id: string; titulo: string; cidade: string } | null;
  eventos: LeadEvento[];
};
