import { Info } from "lucide-react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { PageTitle } from "@components/layout/title";
import { useTranslation } from "react-i18next";
import { LevelBadge } from "@const/levels";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { RarityBadge, RarityBorder } from "@const/rarities";
import { Link, useParams } from "react-router-dom";


export function MapPreview() {
  const { t, i18n } = useTranslation("maps");
  const params = useParams();

  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <div className="flex flex-row gap-4 h-screen w-full">
        <span className="bg-card/10 h-screen w-3/4">
      {params["*"]} Map</span>
        <Card className="h-screen w-1/4"></Card>
      </div>
    </div>
  )
}

export default MapPreview;
