import { headers } from "next/headers";

import { Metadata } from "next";

import { getParamCampusBounds } from "@/utils/getParamCampusBounds";

import PlacesJSON from "../../data/places.json";

import MapComponent from "./map";

type SearchParams = { campus?: string; place?: string };

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const paramCampus: string | undefined = searchParams?.campus;
  const paramPlaceId: string | undefined = searchParams?.place;

  const params = new URLSearchParams();
  if (paramCampus) params.append("campus", paramCampus);
  if (paramPlaceId) params.append("place", paramPlaceId);

  const headersList = headers();
  const baseUrl = headersList.get("host") || "";

  return {
    title: paramCampus ? `UbiCate UC - ${paramCampus}` : "UbiCate UC - Mapa",
  };
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const campusBounds = getParamCampusBounds(searchParams.campus ?? null);
  const paramPlaceId: string | undefined = searchParams?.place;
  const paramPlace = PlacesJSON.features.find((place) => place.properties.identifier === paramPlaceId);

  return (
    <>
      <main spellCheck="false" className="h-full w-full">
        <MapComponent Places={PlacesJSON} paramCampusBounds={campusBounds} paramPlace={paramPlace} />
      </main>
    </>
  );
}

export const runtime = "edge";
