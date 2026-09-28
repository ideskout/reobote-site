import { AdminCrumbs } from "@/components/admin/admin-crumbs";
import { PropertyManager } from "@/components/admin/property-manager";
import { getImoveis } from "@/lib/imoveis";

export default async function AdminImoveisPage() {
  const { data } = await getImoveis({ page: 1, pageSize: 48 });

  return (
    <div className="flex flex-col gap-6">
      <AdminCrumbs current="Imóveis" />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Imóveis</h1>
        <p className="text-sm text-muted-foreground">Cadastre, edite e publique o portfólio.</p>
      </div>
      <PropertyManager initialImoveis={data} />
    </div>
  );
}
