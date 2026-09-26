export function friendlyError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos.";
  }

  if (lower.includes("email not confirmed")) {
    return "Confirme o e-mail deste usuário no Supabase antes de entrar.";
  }

  if (lower.includes("row-level security")) {
    return "Sem permissão para alterar imóveis. Entre novamente e confira se o arquivo supabase/schema.sql foi executado.";
  }

  if (lower.includes("bucket") || lower.includes("fotos-imoveis")) {
    return "Não foi possível usar o bucket fotos-imoveis. Crie o bucket público no Supabase Storage e aplique as políticas do schema.sql.";
  }

  return message;
}
