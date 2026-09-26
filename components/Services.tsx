const services = [
  {
    index: "01",
    title: "Compra",
    text: "Buscamos o imóvel certo para o seu momento, organizamos visitas e conduzimos a negociação até a escritura.",
  },
  {
    index: "02",
    title: "Venda",
    text: "Avaliamos o endereço, preparamos a divulgação e acompanhamos cada proposta até o fechamento.",
  },
  {
    index: "03",
    title: "Locação",
    text: "Selecionamos inquilinos, alinhamos expectativas e cuidamos do contrato com clareza para os dois lados.",
  },
  {
    index: "04",
    title: "Financiamento",
    text: "Simulamos cenários e encaminhamos a documentação junto aos bancos parceiros, sem pressa e sem letra miúda escondida.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="border-y border-white/10 bg-navy-900/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
          Como podemos ajudar
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-4xl text-ivory md:text-5xl">
          Quatro caminhos. Um acompanhamento só.
        </h2>
        <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="bg-navy-950 p-6">
              <p className="font-serif text-3xl text-gold-500">{service.index}</p>
              <h3 className="mt-6 font-serif text-3xl text-ivory">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
