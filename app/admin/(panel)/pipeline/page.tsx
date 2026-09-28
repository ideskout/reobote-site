import { AdminCrumbs } from "@/components/admin/admin-crumbs";
import { PipelineBoard } from "@/components/admin/pipeline-board";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { listLeads } from "@/lib/crm";

export default async function PipelinePage() {
  const { data, error } = await listLeads();

  return (
    <div className="flex flex-col gap-6">
      <AdminCrumbs current="Pipeline" />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Acompanhe cada lead do primeiro contato ao fechamento.</p>
      </div>
      {error && error !== "missing_env" ? (
        <Alert>
          <AlertTitle>Não foi possível carregar os leads</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : data.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Nenhum lead ainda</EmptyTitle>
            <EmptyDescription>Pedidos de visita no site aparecem aqui.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <PipelineBoard leads={data} />
      )}
    </div>
  );
}
