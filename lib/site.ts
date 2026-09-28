export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return value.replace(/\/$/, "");
}

export const empresa = {
  nome: "Reobote Negócios Imobiliários",
  nomeCurto: "Reobote",
  slogan: "Mais que imóveis, espaços para novos começos.",
  titulo: "Encontre o imóvel certo para o seu próximo começo",
  desde: 2017,
  experiencia: "No mercado desde 2017",
  creci: "CRECI-SP 105318-F",
  whatsappExibicao: "+55 (19) 99010-1192",
  instagram: "@reoboteconsultoriaimobiliaria",
  instagramUrl: "https://www.instagram.com/reoboteconsultoriaimobiliaria",
  introducao: [
    "Na Reobote Negócios Imobiliários, acreditamos que cada imóvel representa muito mais do que uma compra, venda ou locação. Representa uma conquista, um investimento e, muitas vezes, o início de uma nova fase da vida.",
    "Desde 2017, atuamos oferecendo consultoria imobiliária especializada e atendimento personalizado, conectando pessoas às melhores oportunidades do mercado imobiliário. Trabalhamos com imóveis residenciais, comerciais, lançamentos, imóveis prontos e oportunidades para investimento.",
    "Nosso compromisso é proporcionar segurança, transparência e tranquilidade durante todo o processo imobiliário. Por isso, acompanhamos nossos clientes desde a busca pelo imóvel ideal até a conclusão da negociação, oferecendo suporte em cada etapa.",
  ],
  servicos: [
    "Comprar imóveis",
    "Vender imóveis",
    "Alugar imóveis",
    "Investir no mercado imobiliário",
    "Adquirir imóveis na planta e lançamentos",
    "Encontrar imóveis prontos para morar ou investir",
  ],
  suporte: [
    "Financiamento imobiliário",
    "Simulação de crédito",
    "Análise de financiamento",
    "Orientação documental",
    "Assessoria imobiliária completa",
  ],
  atendimento: [
    "Cada cliente possui objetivos, necessidades e momentos diferentes. Por isso, nosso atendimento é próximo, transparente e focado em encontrar a solução mais adequada para cada perfil.",
    "Mais do que apresentar imóveis, buscamos compreender suas expectativas para oferecer oportunidades alinhadas ao seu planejamento financeiro e aos seus objetivos de vida.",
  ],
  diferenciais: [
    "Atendimento humanizado",
    "Transparência em todas as etapas",
    "Experiência de mercado desde 2017",
    "Acompanhamento completo da negociação",
    "Suporte em financiamento e crédito imobiliário",
    "Foco em soluções personalizadas",
  ],
  missao:
    "Conectar pessoas aos imóveis certos, oferecendo atendimento de excelência, segurança e confiança em cada negociação.",
};

export const corretora = {
  nome: "Elisangela Dias",
  cargo: "Corretora responsável",
  frase: empresa.slogan,
  titulo: empresa.titulo,
  subtitulo: empresa.introducao[0],
  experiencia: empresa.experiencia,
  creci: empresa.creci,
  bio: empresa.introducao[1],
  historia: empresa.introducao[2],
  especialidades: [
    { title: "Compra, venda e locação", text: "Da busca pelo imóvel até a conclusão da negociação, com suporte em cada etapa." },
    { title: "Lançamentos e prontos", text: "Imóveis na planta, lançamentos e imóveis prontos para morar ou investir." },
    { title: "Financiamento", text: "Simulação de crédito, análise de financiamento e orientação documental." },
  ],
};
