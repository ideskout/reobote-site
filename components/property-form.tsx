"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { friendlyError } from "@/lib/errors";
import { CATEGORIAS, TIPOS, isCategoria, isTipo, labelCategoria, labelTipo } from "@/lib/labels";
import { normalizeImovel } from "@/lib/normalize";
import { removeFoto, uploadFoto } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import type { Imovel } from "@/types/imovel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PropertyFormProps = {
  imovel?: Imovel | null;
  onSaved: (imovel: Imovel) => void;
  onCancel?: () => void;
};

function optionalNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const number = Number(trimmed);
  return Number.isFinite(number) ? number : null;
}

export function PropertyForm({ imovel, onSaved, onCancel }: PropertyFormProps) {
  const editing = Boolean(imovel);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(imovel?.foto_url ?? null);
  const [categoria, setCategoria] = useState(imovel?.categoria ?? "casa");
  const [tipo, setTipo] = useState(imovel?.tipo ?? "venda");
  const [destaque, setDestaque] = useState(imovel?.destaque ?? false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    if (!next) return;
    setPreview(URL.createObjectURL(next));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const titulo = String(form.get("titulo") ?? "").trim();
    const cidade = String(form.get("cidade") ?? "").trim();
    const bairro = String(form.get("bairro") ?? "").trim();
    const endereco = String(form.get("endereco") ?? "").trim();
    const descricao = String(form.get("descricao") ?? "").trim();
    const preco = Number(form.get("preco"));
    const quartos = Number(form.get("quartos"));
    const area = Number(form.get("area"));
    const latitude = optionalNumber(String(form.get("latitude") ?? ""));
    const longitude = optionalNumber(String(form.get("longitude") ?? ""));

    try {
      if (!titulo || !cidade || !descricao) throw new Error("Preencha título, cidade e descrição.");
      if (!isCategoria(categoria) || !isTipo(tipo)) throw new Error("Escolha categoria e tipo válidos.");
      if (!Number.isFinite(preco) || preco <= 0) throw new Error("Informe um preço maior que zero.");
      if (!Number.isFinite(quartos) || quartos < 0 || !Number.isInteger(quartos)) {
        throw new Error("Informe a quantidade de quartos.");
      }
      if (!Number.isFinite(area) || area < 0) throw new Error("Informe a área em metros quadrados.");

      let fotoUrl = imovel?.foto_url ?? null;
      if (file) {
        const uploaded = await uploadFoto(file);
        if (imovel?.foto_url) await removeFoto(imovel.foto_url);
        fotoUrl = uploaded;
      }

      const payload = {
        titulo,
        cidade,
        bairro: bairro || null,
        endereco: endereco || null,
        preco,
        categoria,
        tipo,
        quartos,
        area,
        descricao,
        foto_url: fotoUrl,
        destaque,
        latitude,
        longitude,
      };

      const supabase = createClient();
      const query = imovel
        ? supabase.from("imoveis").update(payload).eq("id", imovel.id)
        : supabase.from("imoveis").insert(payload);

      const { data, error: saveError } = await query.select("*").single();
      if (saveError) throw new Error(friendlyError(saveError.message));
      onSaved(normalizeImovel(data as Record<string, unknown>));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Não foi possível salvar.";
      setError(friendlyError(message));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editing ? "Editar imóvel" : "Cadastrar imóvel"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="titulo">Título</FieldLabel>
              <Input id="titulo" name="titulo" defaultValue={imovel?.titulo ?? ""} required />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
                <Input id="cidade" name="cidade" defaultValue={imovel?.cidade ?? ""} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="bairro">Bairro</FieldLabel>
                <Input id="bairro" name="bairro" defaultValue={imovel?.bairro ?? ""} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="endereco">Endereço</FieldLabel>
              <Input id="endereco" name="endereco" defaultValue={imovel?.endereco ?? ""} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="preco">Preço</FieldLabel>
                <Input id="preco" name="preco" type="number" min={0} step="0.01" defaultValue={imovel?.preco ?? ""} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="area">Área (m²)</FieldLabel>
                <Input id="area" name="area" type="number" min={0} step="0.01" defaultValue={imovel?.area ?? ""} required />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select value={categoria} onValueChange={(value) => setCategoria(value as typeof categoria)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CATEGORIAS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {labelCategoria(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select value={tipo} onValueChange={(value) => setTipo(value as typeof tipo)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TIPOS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {labelTipo(item)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="quartos">Quartos</FieldLabel>
                <Input id="quartos" name="quartos" type="number" min={0} step={1} defaultValue={imovel?.quartos ?? 0} required />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                <Input id="latitude" name="latitude" inputMode="decimal" defaultValue={imovel?.latitude ?? ""} />
              </Field>
              <Field>
                <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                <Input id="longitude" name="longitude" inputMode="decimal" defaultValue={imovel?.longitude ?? ""} />
              </Field>
            </div>
            <Field orientation="horizontal">
              <Checkbox id="destaque" checked={destaque} onCheckedChange={(value) => setDestaque(value === true)} />
              <FieldLabel htmlFor="destaque">Exibir em destaque na página inicial</FieldLabel>
            </Field>
            <Field>
              <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
              <Textarea id="descricao" name="descricao" rows={5} defaultValue={imovel?.descricao ?? ""} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="foto">Foto</FieldLabel>
              <Input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} />
            </Field>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Pré-visualização da foto do imóvel" className="aspect-[16/9] w-full max-w-md rounded-lg object-cover" />
            ) : null}
          </FieldGroup>
          {error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar imóvel"}
            </Button>
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
