import { Info } from "lucide-react"
import { Card } from "@ui/card"
import { Button } from "@ui/button"
import { PageTitle } from "@components/layout/title"
import { useTranslation } from "react-i18next"
import { LevelBadge } from "@const/levels"
import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@components/ui/popover"
import { RarityBadge, RarityBorder } from "@const/rarities"
import { Link, useParams } from "react-router-dom"

export function VillagePreview() {
  const { t, i18n } = useTranslation("maps")
  const params = useParams()

  return (
    <div className="relative page-container flex flex-col items-center pb-24">
      <div className="flex w-full flex-row gap-4">
        <span className="relative w-2/3 bg-card/10">
          {" "}
          <img
            src="/media/maps/island_village_map.png"
            alt="Village Preview"
            className="relative aspect-square w-full object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />
          
          {/* 4 */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute top-0 top-28/138 left-46/140 size-1/14 hover:bg-white/10" />
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              <PopoverHeader >
                <PopoverTitle>Unlocked at Level 3 Village</PopoverTitle>
                <PopoverDescription>Possible Buildings to Construct:</PopoverDescription>
              </PopoverHeader>
              <p>- Miner</p>
              <p>- Lumberjack</p>
              <p>- Gathering</p>
              <p>- Farmer</p>
            </PopoverContent>
          </Popover>
          
          {/* 3 */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute top-0 top-37/138 left-87/140 size-1/14 hover:bg-white/10" />
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              <PopoverHeader >
                <PopoverTitle>Unlocked at Level 2 Village</PopoverTitle>
                <PopoverDescription>Possible Buildings to Construct:</PopoverDescription>
              </PopoverHeader>
              <p>- Fisherman</p>
              <p>- Pet Trainer</p>
            </PopoverContent>
          </Popover>
          
          {/* 1 */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute top-0 top-51/138 left-66/140 size-1/14 hover:bg-white/10" />
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              <PopoverHeader >
                <PopoverTitle>Unlocked at Level 1 Village</PopoverTitle>
                <PopoverDescription>Possible Buildings to Construct:</PopoverDescription>
              </PopoverHeader>
              <p>- Gathering</p>
              <p>- Farmer</p>
              <p>- Pet Trainer</p>
            </PopoverContent>
          </Popover>
          
          {/* 5 */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute top-0 top-83/138 left-30/140 size-1/14 hover:bg-white/10" />
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              <PopoverHeader >
                <PopoverTitle>Unlocked at Level 4 Village</PopoverTitle>
                <PopoverDescription>Possible Buildings to Construct:</PopoverDescription>
              </PopoverHeader>
              <p>- ???</p>
            </PopoverContent>
          </Popover>
          
          {/* 2 */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute top-0 top-90/138 left-57/140 size-1/14 hover:bg-white/10" />
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              <PopoverHeader >
                <PopoverTitle>Unlocked at Level 1 Village</PopoverTitle>
                <PopoverDescription>Possible Buildings to Construct:</PopoverDescription>
              </PopoverHeader>
              <p>- Miner</p>
              <p>- Lumberjack</p>
            </PopoverContent>
          </Popover>
          
          {/* 6 */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute top-0 top-103/138 left-102/140 size-1/15 hover:bg-white/10" />
            </PopoverTrigger>
            <PopoverContent className="gap-0">
              <PopoverHeader >
                <PopoverTitle>Unlocked at Level 5 Village</PopoverTitle>
                <PopoverDescription>Possible Buildings to Construct:</PopoverDescription>
              </PopoverHeader>
              <p>- ???</p>
            </PopoverContent>
          </Popover>
        </span>
        <Card className="w-1/3"></Card>
      </div>
    </div>
  )
}

export default VillagePreview
