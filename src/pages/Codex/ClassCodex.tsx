import { useState, useEffect } from "react"
import { Button } from "@ui/button"
import {
  ArrowUpRightIcon,
  Globe,
  Grid2x2Icon,
  Package2Icon,
  ShipIcon,
  Users2Icon,
  WindIcon,
  ZapIcon,
  Rocket,
} from "lucide-react"
import { Card } from "@ui/card"
import { RarityBadge, RarityBorder, ItemSlot } from "@const/rarities"
import { Separator } from "@ui/separator"
import { DamageItem, SmallStatItem, StatItem } from "@const/statsAndDamage"
import { PageTitle } from "@components/layout/title"
import { Badge } from "@components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { CodexNav } from "@components/minebox/codex-nav"

export function ClassCodexPage() {
  return (
    <div className="relative page-container flex h-dvh flex-col overflow-hidden">
      <div className="absolute top-0 -z-1 aspect-[21/9] w-full bg-[url(/media/backgrounds/MainBackground.webp)] mask-y-from-50% mask-x-from-80% mask-radial-to-100% bg-center opacity-30" />
      <PageTitle title="Class Codex" />

      <CodexNav />

      <div className="flex min-h-0 flex-1 flex-row gap-4">
        <div
          className={`custom-scrollbar h-3/5 w-full scroll-fade overflow-y-auto pr-2`}
        >
          <div className={`grid grid-cols-3 gap-4`}>
            <RarityBorder
              rarity="legendary"
              className="gap- flex flex-col items-center justify-center"
            >
              <span className="flex flex-col gap-2">
                <span className="flex flex-row items-center justify-center gap-2">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAIAAABKVGGHAAACI0lEQVR4nOzdsaoTQRSA4UVCQFFSBJQgErANWIqlL2IhNha+g/gOtmLhI9hbi4VFIJUghCCCkDaCSWERkJA94qz7z0zu8n+VDrlk+TnLCXsvZLT//Lhp2X/51j5Uimu1L2BoDAozKMygMIPCRuHp9UdPil/J/zhsP1R89/CzkBMKMyjMoDCDwgwKi7d8aP3mbc4ruWi3F0GoH6tD+9AJhRkUZlCYQWEGhXXY8sXMX31NfOX65f3M19KZEwozKMygMIPCDAqrvOXTF3r6j9dd/U4ozKAwg8IMCjMorNyW77nQrwonFGZQmEFhBoUZFJZly9dd6HUf+DuhMIPCDAozKMygsCxb/tOLafvwxr0HZye7zfLh622OC0iU44F/iYcjx5S7zTI8HxhveZhBYQaFGRSWZSndmU5O/zue3Gya5tZucvay4/nAlJ7Q8Wwxni0Kv2lJ3vKw0n+K8+v76jinf/49ME4orMSEnk7l304Go9wtP3v+vth7JQqfOZx9ROnKWx5mUJhBYQaFGRR2ib+XD5dvKP2Bf46FHnJCYQaFGRRmUJhBYX23fI6F3nP5FlvoIScUZlCYQWEGhRkUVu6J/fAWesgJhRkUZlCYQWEGhfXd8ulP13Ms37oLPeSEwgwKMyjMoDCDwjps+fmzp+3Du1W/LyZU9wv1nFCYQWEGhRkUZlBYvOV/fnxX/Er+IfxqmAvkhMIMCjMozKAwg8J+BwAA//+mulTmbmHPcQAAAABJRU5ErkJggg=="
                    className="aspect-square w-1/3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                  />
                  <span className="flex w-full flex-col gap-0">
                    <p>Class Name</p>
                    <RarityBadge rarity="legendary" />
                  </span>
                </span>
                <p className="text-xs text-muted-foreground">
                  A frontline guardian who shields allies, controls space, and
                  can retaliate with holy force.
                </p>
              </span>
            </RarityBorder>
          </div>
        </div>

        <div
          className={`custom-scrollbar flex min-h-0 w-2/5 flex-col gap-2 overflow-y-auto pr-2`}
        >
          <RarityBorder rarity="legendary" className="flex flex-col">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAIAAABKVGGHAAACI0lEQVR4nOzdsaoTQRSA4UVCQFFSBJQgErANWIqlL2IhNha+g/gOtmLhI9hbi4VFIJUghCCCkDaCSWERkJA94qz7z0zu8n+VDrlk+TnLCXsvZLT//Lhp2X/51j5Uimu1L2BoDAozKMygMIPCRuHp9UdPil/J/zhsP1R89/CzkBMKMyjMoDCDwgwKi7d8aP3mbc4ruWi3F0GoH6tD+9AJhRkUZlCYQWEGhXXY8sXMX31NfOX65f3M19KZEwozKMygMIPCDAqrvOXTF3r6j9dd/U4ozKAwg8IMCjMorNyW77nQrwonFGZQmEFhBoUZFJZly9dd6HUf+DuhMIPCDAozKMygsCxb/tOLafvwxr0HZye7zfLh622OC0iU44F/iYcjx5S7zTI8HxhveZhBYQaFGRSWZSndmU5O/zue3Gya5tZucvay4/nAlJ7Q8Wwxni0Kv2lJ3vKw0n+K8+v76jinf/49ME4orMSEnk7l304Go9wtP3v+vth7JQqfOZx9ROnKWx5mUJhBYQaFGRR2ib+XD5dvKP2Bf46FHnJCYQaFGRRmUJhBYX23fI6F3nP5FlvoIScUZlCYQWEGhRkUVu6J/fAWesgJhRkUZlCYQWEGhfXd8ulP13Ms37oLPeSEwgwKMyjMoDCDwjps+fmzp+3Du1W/LyZU9wv1nFCYQWEGhRkUZlBYvOV/fnxX/Er+IfxqmAvkhMIMCjMozKAwg8J+BwAA//+mulTmbmHPcQAAAABJRU5ErkJggg=="
              className="aspect-square w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
            />

            <span className="mt-1 flex w-full flex-row items-center gap-2">
              <RarityBadge rarity="legendary" />
              <p>Class Name</p>
            </span>
            <p className="text-xs leading-none text-muted-foreground">
              A frontline guardian who shields allies, controls space, and can
              retaliate with holy force.
            </p>
            <span className="mt-1 flex w-full flex-row items-center gap-2">
              <p className="mr-auto text-xs font-semibold text-foreground">
                Class Types:{" "}
              </p>
              <Badge variant="secondary">Class Type</Badge>
              <Badge variant="secondary">Class Type</Badge>
            </span >
            <span className="mt-1 flex w-full flex-row items-center gap-2">
              <span className="flex flex-col gap-1 items-center">
                <p className="text-xs font-semibold text-foreground">Passive</p>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAIAAABKVGGHAAACI0lEQVR4nOzdsaoTQRSA4UVCQFFSBJQgErANWIqlL2IhNha+g/gOtmLhI9hbi4VFIJUghCCCkDaCSWERkJA94qz7z0zu8n+VDrlk+TnLCXsvZLT//Lhp2X/51j5Uimu1L2BoDAozKMygMIPCRuHp9UdPil/J/zhsP1R89/CzkBMKMyjMoDCDwgwKi7d8aP3mbc4ruWi3F0GoH6tD+9AJhRkUZlCYQWEGhXXY8sXMX31NfOX65f3M19KZEwozKMygMIPCDAqrvOXTF3r6j9dd/U4ozKAwg8IMCjMorNyW77nQrwonFGZQmEFhBoUZFJZly9dd6HUf+DuhMIPCDAozKMygsCxb/tOLafvwxr0HZye7zfLh622OC0iU44F/iYcjx5S7zTI8HxhveZhBYQaFGRSWZSndmU5O/zue3Gya5tZucvay4/nAlJ7Q8Wwxni0Kv2lJ3vKw0n+K8+v76jinf/49ME4orMSEnk7l304Go9wtP3v+vth7JQqfOZx9ROnKWx5mUJhBYQaFGRR2ib+XD5dvKP2Bf46FHnJCYQaFGRRmUJhBYX23fI6F3nP5FlvoIScUZlCYQWEGhRkUVu6J/fAWesgJhRkUZlCYQWEGhfXd8ulP13Ms37oLPeSEwgwKMyjMoDCDwjps+fmzp+3Du1W/LyZU9wv1nFCYQWEGhRkUZlBYvOV/fnxX/Er+IfxqmAvkhMIMCjMozKAwg8J+BwAA//+mulTmbmHPcQAAAABJRU5ErkJggg=="
                  className="aspect-square w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                />
              </span>
              <span>
                <p>Passive</p>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAIAAABKVGGHAAACI0lEQVR4nOzdsaoTQRSA4UVCQFFSBJQgErANWIqlL2IhNha+g/gOtmLhI9hbi4VFIJUghCCCkDaCSWERkJA94qz7z0zu8n+VDrlk+TnLCXsvZLT//Lhp2X/51j5Uimu1L2BoDAozKMygMIPCRuHp9UdPil/J/zhsP1R89/CzkBMKMyjMoDCDwgwKi7d8aP3mbc4ruWi3F0GoH6tD+9AJhRkUZlCYQWEGhXXY8sXMX31NfOX65f3M19KZEwozKMygMIPCDAqrvOXTF3r6j9dd/U4ozKAwg8IMCjMorNyW77nQrwonFGZQmEFhBoUZFJZly9dd6HUf+DuhMIPCDAozKMygsCxb/tOLafvwxr0HZye7zfLh622OC0iU44F/iYcjx5S7zTI8HxhveZhBYQaFGRSWZSndmU5O/zue3Gya5tZucvay4/nAlJ7Q8Wwxni0Kv2lJ3vKw0n+K8+v76jinf/49ME4orMSEnk7l304Go9wtP3v+vth7JQqfOZx9ROnKWx5mUJhBYQaFGRR2ib+XD5dvKP2Bf46FHnJCYQaFGRRmUJhBYX23fI6F3nP5FlvoIScUZlCYQWEGhRkUVu6J/fAWesgJhRkUZlCYQWEGhfXd8ulP13Ms37oLPeSEwgwKMyjMoDCDwjps+fmzp+3Du1W/LyZU9wv1nFCYQWEGhRkUZlBYvOV/fnxX/Er+IfxqmAvkhMIMCjMozKAwg8J+BwAA//+mulTmbmHPcQAAAABJRU5ErkJggg=="
                  className="aspect-square w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] [image-rendering:pixelated]"
                />
              </span>
            </span>
          </RarityBorder>
        </div>
      </div>
    </div>
  )
}

export default ClassCodexPage
