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


export function VillagePreview() {
  const { t, i18n } = useTranslation("maps");
  const params = useParams();

  return (
    <div className="relative flex flex-col page-container pb-24 items-center">
      <p>Village</p>
      <p>Special Suppage for Village </p>
    </div>
  )
}

export default VillagePreview;
