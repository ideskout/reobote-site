import { KpiCards } from "@/components/admin/kpi-cards";
import { StageChart } from "@/components/admin/stage-chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { getDashboard } from "@/lib/crm";

export default async function AdminHomePage() {
  const dashboard = await getDashboard();
  const cards = [
    { label: "Imóveis", value: dashboard.imoveis, href: "/admin/imoveis" },
    { label: "Leads novos", value: dashboard.leadsNovos, href: "/admin/pipeline" },
    { label: "Visitas da semana", value: dashboard.visitasSemana, href: "/admin/pipeline" },
    { label: "Fechados", value: dashboard.fechados, href: "/admin/clientes" },
  ];
  const semLinhas =
    dashboard.imoveis === 0 &&
    dashboard.leadsNovos === 0 &&
    dashboard.visitasSemana === 0 &&
    dashboard.fechados === 0 &&
    dashboard.porEstagio.every((stage) => stage.total === 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Painel</h1>
        <p className="text-sm text-muted-foreground">Resumo do portfólio e do funil.</p>
      </div>
      {dashboard.error && dashboard.error !== "missing_env" ? (
        <Alert>
          <AlertTitle>CRM ainda não está no banco</AlertTitle>
          <AlertDescription>
            Execute supabase/schema.sql de novo no SQL Editor para criar clientes, leads e visitas.
          </AlertDescription>
        </Alert>
      ) : null}
      <KpiCards cards={cards} />
      {semLinhas ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>O CRM ainda não tem linhas</EmptyTitle>
            <EmptyDescription>
              {dashboard.error === "missing_env"
                ? "Copie .env.example para .env.local e execute supabase/schema.sql no SQL Editor."
                : "Imóveis, leads e visitas aparecem aqui assim que forem cadastrados."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Leads por estágio</CardTitle>
        </CardHeader>
        <CardContent>
          <StageChart data={dashboard.porEstagio} />
        </CardContent>
      </Card>
    </div>
  );
}
