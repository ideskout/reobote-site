import { AdminCrumbs } from "@/components/admin/admin-crumbs";
import { ClientManager } from "@/components/admin/client-manager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { listClientes } from "@/lib/crm";

export default async function ClientesPage() {
  const { data, error } = await listClientes();

  return (
    <div className="flex flex-col gap-6">
      <AdminCrumbs current="Clientes" />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">Contatos que chegaram pelo site ou foram cadastrados aqui.</p>
      </div>
      {error && error !== "missing_env" ? (
        <Alert>
          <AlertTitle>Não foi possível carregar os clientes</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <ClientManager clientes={data} />
      )}
    </div>
  );
}
