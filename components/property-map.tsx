import { Button } from "@/components/ui/button";

export function PropertyMap({
  titulo,
  endereco,
  cidade,
  latitude,
  longitude,
}: {
  titulo: string;
  endereco: string | null;
  cidade: string;
  latitude: number | null;
  longitude: number | null;
}) {
  const query = [endereco, cidade].filter(Boolean).join(", ");
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    latitude !== null && longitude !== null ? `${latitude},${longitude}` : query || cidade,
  )}`;

  const embed =
    key && (query || (latitude !== null && longitude !== null))
      ? latitude !== null && longitude !== null
        ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${latitude},${longitude}`
        : `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(query)}`
      : null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold">Localização</h2>
      {embed ? (
        <iframe
          title={`Mapa de ${titulo}`}
          src={embed}
          className="h-72 w-full rounded-lg border"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          {query || cidade}. O mapa incorporado aparece quando NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY está definido.
        </p>
      )}
      <Button asChild variant="outline" className="w-fit">
        <a href={mapsLink} target="_blank" rel="noopener noreferrer">
          Abrir no Google Maps
        </a>
      </Button>
    </section>
  );
}
