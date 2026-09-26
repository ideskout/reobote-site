# Reobote

Site da consultoria imobiliária Reobote. Next.js 14 (App Router), Tailwind CSS e Supabase.

## Preparar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e execute.
   Isso cria a tabela `imoveis`, as políticas de acesso e o bucket público `fotos-imoveis`.
3. Em **Authentication > Users**, crie um usuário com e-mail e senha.
   Se a confirmação de e-mail estiver ligada, confirme o usuário no painel ou desative **Confirm email** em Authentication > Providers > Email.
4. Em **Project Settings > API**, copie a Project URL e a chave `anon` `public`.

## Rodar localmente

```bash
# macOS / Linux
cp .env.example .env.local

# Windows (PowerShell)
copy .env.example .env.local
```

Preencha `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
NEXT_PUBLIC_WHATSAPP_PHONE=5511999999999
```

Troque o telefone pelo número real, só com dígitos (DDI + DDD + número).

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A área do corretor fica em [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy na Vercel

1. Envie o projeto para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O framework detectado é Next.js.
3. Em **Environment Variables**, cadastre as mesmas três variáveis do `.env.local` para Production (e Preview, se quiser).
4. Faça o deploy. A Vercel roda `npm run build` e publica o site.
5. No Supabase, em **Authentication > URL Configuration**, coloque a URL da Vercel (por exemplo `https://reobote.vercel.app`) em **Site URL**. Inclua também `http://localhost:3000` nas Redirect URLs se for continuar testando localmente.

Não commite `.env.local`. A chave `service_role` não é usada neste projeto e não deve ir para a Vercel.
