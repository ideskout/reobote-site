// Textos de exemplo. Substitua por depoimentos reais quando tiver.
const depoimentos = [
  {
    texto:
      "A corretora acompanhou cada visita sem pressa e explicou o contrato antes da proposta. Encontramos a casa no tempo certo.",
    nome: "Marina Costa",
    local: "Cambuí, Campinas",
  },
  {
    texto:
      "Saímos de um aluguel apertado para um apartamento que cabe na rotina. O atendimento foi direto e a documentação, clara.",
    nome: "Paulo Henrique",
    local: "Pinheiros, São Paulo",
  },
  {
    texto:
      "Precisávamos vender com calma e comprar em seguida. A Reobote organizou as duas pontas sem a gente se perder no processo.",
    nome: "Lúcia Ferreira",
    local: "Savassi, Belo Horizonte",
  },
  {
    texto:
      "O financiamento deixou de ser um labirinto. Simulamos juntos e seguimos para o banco já sabendo o que perguntar.",
    nome: "André Lima",
    local: "Batel, Curitiba",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-white/10 bg-navy-900/50" aria-labelledby="depoimentos-titulo">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
          Depoimentos
        </p>
        <h2
          id="depoimentos-titulo"
          className="mt-3 max-w-xl font-serif text-4xl text-ivory md:text-5xl"
        >
          O que dizem nossos clientes
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {depoimentos.map((depoimento) => (
            <blockquote
              key={depoimento.nome}
              className="flex h-full flex-col border border-white/10 bg-navy-950 p-6"
            >
              <p className="font-serif text-6xl leading-none text-gold-500" aria-hidden="true">
                “
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mist">
                {depoimento.texto}
              </p>
              <footer className="mt-6 border-t border-white/10 pt-4">
                <p className="font-serif text-2xl text-ivory">{depoimento.nome}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-gold-300">
                  {depoimento.local}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
