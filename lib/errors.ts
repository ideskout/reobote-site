export function friendlyError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos.";
  }

  if (lower.includes("email not confirmed")) {
    return "Confirme o e-mail deste usuário no Supabase antes de entrar.";
  }

  if (lower.includes("row-level security") || lower.includes("agendar_visita") || lower.includes("schema cache")) {
    return "Sem permissão ou tabela ausente. Execute novamente o arquivo supabase/schema.sql no SQL Editor do Supabase.";
  }

  if (lower.includes("bucket") || lower.includes("fotos-imoveis")) {
    return "Não foi possível usar o bucket fotos-imoveis. Crie o bucket público no Supabase Storage e aplique as políticas do schema.sql.";
  }

  return message;
}
