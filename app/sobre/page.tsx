'use client'

import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  Mail, 
  MapPin, 
  Calendar,
  Lightbulb,
  Shield,
  Globe
} from 'lucide-react'
import Footer from '@/components/layout/footer'

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: "Solidariedade",
      description: "Acreditamos no poder da união e da ajuda mútua para transformar comunidades."
    },
    {
      icon: Shield,
      title: "Transparência",
      description: "Mantemos total clareza em nossos processos e na conexão entre voluntários e ONGs."
    },
    {
      icon: Globe,
      title: "Impacto Social",
      description: "Focamos em gerar mudanças positivas e duradouras na sociedade."
    },
    {
      icon: Users,
      title: "Inclusão",
      description: "Promovemos um ambiente acolhedor para todos, independente de origem ou condição."
    }
  ]

  const milestones = [
    {
      year: "2024",
      title: "Fundação da Voluntaria+",
      description: "Início do projeto com o objetivo de conectar voluntários e ONGs no Rio Grande do Sul."
    },
    {
      year: "2024",
      title: "Primeira Versão da Plataforma",
      description: "Lançamento da versão beta com funcionalidades básicas de cadastro e busca."
    },
    {
      year: "2025",
      title: "Expansão de Funcionalidades",
      description: "Implementação do mapa interativo e sistema de comunicação direta via WhatsApp."
    },
    {
      year: "2025",
      title: "Crescimento da Comunidade",
      description: "Meta de conectar mais de 1.000 voluntários com ONGs em todo o Brasil."
    }
  ]

  const team = [
    {
      name: "Equipe InovaTec - Voluntaria+",
      role: "Desenvolvedores e Idealistas",
      description: "Somos uma iniciativa estudantil sem fins lucrativos com o objetivo de facilitar a sua inserção em centros de ajuda comunitária, encorajando o voluntariado no Rio Grande do Sul de modo geral.",
      image: null
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 mb-6">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 fill-current" />
              <span className="text-sm sm:text-base md:text-lg text-primary font-medium">Nossa História</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Sobre a <span className="text-primary">Voluntaria+</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Nossa missão é simples, mas poderosa: conectar corações generosos com causas que fazem a diferença. 
              Como organização sem fins lucrativos, desenvolvemos uma plataforma que facilita o encontro entre 
              voluntários e ONGs, democratizando o acesso ao voluntariado em todo o Rio Grande do Sul.
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              Acreditamos que cada pessoa tem o poder de gerar impacto positivo em sua comunidade. Por isso, 
              criamos uma ponte digital que torna o voluntariado mais acessível, transparente e eficiente, 
              fortalecendo o tecido social gaúcho através da solidariedade e da inovação jovem.
            </p>
          </div>

          {/* Team */}
         <div className="mb-16">
  <div className="max-w-4xl mx-auto">
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-8">
        {/* Fotos lado a lado */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden group">
            <img
              src="/images/team/inovatec-team-1.jpg"
              alt="Equipe InovaTec - Foto 1"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.classList.add('hidden');
                const placeholder = e.currentTarget.nextElementSibling;
                if (placeholder) placeholder.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full bg-primary/10 rounded-xl flex items-center justify-center">
              {/* Placeholder */}
            </div>
          </div>

          <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden group">
            <img
              src="/images/team/inovatec-team-2.jpg"
              alt="Equipe InovaTec - Foto 2"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.classList.add('hidden');
                const placeholder = e.currentTarget.nextElementSibling;
                if (placeholder) placeholder.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full bg-primary/10 rounded-xl flex items-center justify-center">
              {/* Placeholder */}
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Equipe InovaTec - Voluntaria+</h3>
          <p className="text-primary font-medium mb-6">Desenvolvedores e Idealistas</p>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Somos uma iniciativa estudantil sem fins lucrativos com o objetivo de facilitar a sua inserção em centros de ajuda comunitária, encorajando o voluntariado no Rio Grande do Sul de modo geral.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  Nossa Missão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Democratizar o acesso ao voluntariado, conectando pessoas que desejam fazer a diferença 
                  com organizações que precisam de apoio, criando um ecossistema de solidariedade e 
                  transformação social.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  Nossa Visão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Ser a principal plataforma de voluntariado do Brasil, reconhecida por facilitar 
                  conexões significativas e por contribuir para a construção de uma sociedade mais 
                  justa e solidária.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
              <p className="text-xl text-gray-600">Os princípios que guiam cada decisão e ação</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossa Jornada</h2>
              <p className="text-xl text-gray-600">Marcos importantes da nossa história</p>
            </div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-primary text-black font-semibold px-3 py-1">
                          {milestone.year}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* Contact Information */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl justify-center">
                <Mail className="h-5 w-5 text-primary mr-3" />
                Entre em Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Tem alguma dúvida, sugestão ou quer saber mais sobre nosso trabalho? 
                  Adoraríamos ouvir de você!
                </p>
                
                <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-medium">voluntariamaisrs@gmail.com</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Porto Alegre, RS</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Respondemos todas as mensagens em até 48 horas úteis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}