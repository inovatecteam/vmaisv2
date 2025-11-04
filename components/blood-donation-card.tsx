"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Droplet, Heart, Camera } from "lucide-react"

const instagramLink = "https://instagram.com/voluntariamais"

export function BloodDonationCard() {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 shadow-lg transition-shadow hover:shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full bg-orange-200/50 blur-3xl" />

      <CardHeader className="relative z-10 space-y-3 pb-4">
        <Badge className="w-fit bg-white/80 text-red-600 shadow-sm backdrop-blur">
          Campanha Especial
        </Badge>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-red-700 md:text-3xl">
          <Sparkles className="h-6 w-6 text-red-500" />
          Missão cumprida!
        </CardTitle>
        <p className="max-w-xl text-sm leading-relaxed text-rose-700/90 md:text-base">
          A campanha de doação de sangue do Voluntaria+ foi um sucesso absoluto! Obrigado a cada pessoa que chegou cedo, estendeu o braço e espalhou esperança. Vocês transformaram cuidado em impacto real.
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        <div className="grid gap-3 rounded-xl border border-white/40 bg-white/60 p-5 shadow-inner backdrop-blur-sm md:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-lg bg-white/70 p-3 shadow-sm">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500/80">
              <Droplet className="h-4 w-4" />
              Cuidado coletivo
            </span>
            <p className="text-sm text-rose-700/90">
              Triagens lotadas, bolsas coletadas, novas histórias conectadas. A energia da campanha mostrou como a solidariedade pulsa forte.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-white/70 p-3 shadow-sm">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500/80">
              <Heart className="h-4 w-4" />
              Gratidão sem fim
            </span>
            <p className="text-sm text-rose-700/90">
              Equipe, voluntários, parceiros e doadores: cada gesto construiu um legado de amor que segue inspirando novas ações.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-white/70 p-3 shadow-sm">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500/80">
              <Camera className="h-4 w-4" />
              Melhores momentos
            </span>
            <p className="text-sm text-rose-700/90">
              Resgates de sorrisos, abraços e celebrações estão registrados. Relembre cada conquista e compartilhe com quem você ama.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-white/40 bg-white/80 p-5 text-center shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-rose-700/90 md:text-base">
            Bora reviver tudo? Veja os bastidores, depoimentos e celebrações no nosso Instagram.
          </p>
          <Button
            asChild
            className="h-auto rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-red-500 hover:via-rose-500 hover:to-red-500"
          >
            <Link href={instagramLink} target="_blank" rel="noopener noreferrer">
              Celebrar no Instagram
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
