'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Heart, Users, MapPin, Search, HandHeart, Target, Shield } from 'lucide-react'
import { AuthModal } from '@/components/auth/auth-modal'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'
import Footer from '@/components/layout/footer'

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      icon: Search,
      title: 'Encontre ONGs',
      description: 'Descubra organizações que compartilham dos seus valores e causas.',
    },
    {
      icon: MapPin,
      title: 'Localize próximas',
      description: 'Encontre oportunidades de voluntariado na sua região.',
    },
    {
      icon: HandHeart,
      title: 'Conecte-se',
      description: 'Entre em contato direto com as ONGs através do WhatsApp.',
    },
    {
      icon: Target,
      title: 'Faça a diferença',
      description: 'Transforme vidas e fortaleça sua comunidade.',
    },
  ]

const faqs = [
    {
      question: 'E se eu não tiver experiência prévia em voluntariado?',
      answer: 'Não se preocupe! A maioria das ONGs oferece treinamento e orientação para novos voluntários. Muitas atividades não requerem experiência específica, apenas boa vontade e comprometimento. É uma excelente oportunidade para aprender novas habilidades enquanto ajuda sua comunidade.'
    },
    {
      question: 'Como posso ter certeza de que as ONGs são confiáveis?',
      answer: 'Todas as organizações passam por um processo de verificação rigoroso antes de serem aprovadas na plataforma. Verificamos documentação, histórico de atividades e legitimidade. Além disso, você pode ver avaliações de outros voluntários e sempre pode entrar em contato conosco se tiver dúvidas sobre alguma organização.'
    },
    {
      question: 'E se eu não conseguir cumprir o compromisso assumido?',
      answer: 'Entendemos que imprevistos acontecem. O importante é comunicar com antecedência à ONG sobre qualquer mudança na sua disponibilidade. A maioria das organizações é compreensiva e pode ajustar as atividades ou encontrar alternativas que funcionem para ambos.'
    },
    {
      question: 'O voluntariado realmente faz diferença ou é só para "limpar a consciência"?',
      answer: 'O voluntariado gera impacto real e mensurável nas comunidades. Cada hora dedicada contribui para projetos concretos: crianças alfabetizadas, famílias alimentadas, animais resgatados, meio ambiente preservado. Além do impacto social, você desenvolve habilidades, expande sua rede de contatos e ganha uma perspectiva mais ampla da sociedade.'
    },
    {
      question: 'Preciso me comprometer por muito tempo ou posso ajudar pontualmente?',
      answer: 'Oferecemos opções para todos os perfis! Há atividades pontuais (eventos, campanhas) e projetos de longo prazo. Você pode começar com ações esporádicas e, se gostar, aumentar gradualmente seu envolvimento. O importante é encontrar um ritmo sustentável para você.'
    },
    {
      question: 'Como voluntário, vou ter gastos ou custos adicionais?',
      answer: 'A maioria das atividades de voluntariado não gera custos para você. Algumas ONGs até fornecem transporte, alimentação ou materiais necessários. Quando há algum custo (como transporte para locais específicos), isso é sempre comunicado com antecedência, e muitas organizações oferecem ajuda de custo ou alternativas.'
    }
  ];
  
  const benefits = [
    {
      title: 'Para Voluntários',
      items: [
        'Encontrar causas que fazem sentido',
        'Conectar com organizações sérias',
        'Desenvolver novas habilidades',
        'Fazer networking social',
      ],
    },
    {
      title: 'Para ONGs',
      items: [
        'Alcançar mais voluntários',
        'Divulgar suas causas',
        'Receber ajuda qualificada',
        'Fortalecer impacto social',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 mb-6 sm:mb-8">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 fill-current" />
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 fill-current" />
            <span className="text-sm sm:text-base md:text-lg text-primary font-medium">Conectando corações e causas</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight px-2">
            Transforme vidas através do{' '}
            <span className="text-primary">voluntariado</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Conectamos voluntários apaixonados com ONGs que fazem a diferença. 
            Descubra oportunidades próximas de você e seja parte da mudança que o mundo precisa.
          </p>
          
          <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            {user ? (
              <Link href="/oportunidades">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg">
                  Explorar Oportunidades
                </Button>
              </Link>
            ) : (
              <Link href="/cadastrar">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
                >
                  Começar Agora
                </Button>
              </Link>
            )}
            <Link href="/oportunidades">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-primary hover:text-primary rounded-2xl px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
              >
                Ver Oportunidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-12 sm:py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">Conectar-se é simples e direto</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group">
                <CardHeader>
                  <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl px-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Benefícios Secton */}
      <section className="py-12 sm:py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 px-4">Por que usar a Voluntaria+?</h2>
      <p className="text-lg sm:text-xl text-gray-600 px-4">Benefícios para toda a comunidade</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
      {benefits.map((benefit, index) => (
        <Card key={index} className="border-none shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-xl sm:text-2xl flex items-center px-2">
              {benefit.title === 'Para Voluntários' ? (
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-3" />
              ) : (
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-3" />
              )}
              {benefit.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <ul className="space-y-3">
              {benefit.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 opacity-90 px-4">
            Junte-se a milhares de pessoas que já transformam suas comunidades através do voluntariado
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/cadastrar"
              className="w-full sm:w-auto bg-white text-yellow-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all text-center"
            >
              Sou Voluntário
            </Link>
            <Link
              href="/cadastrar"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all text-center"
            >
              Sou uma ONG
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              Tire suas dúvidas sobre como funciona nossa plataforma
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-2xl shadow-sm border-0">
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-gray-900 px-4 sm:px-6 py-4 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600 leading-relaxed px-4 sm:px-6 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  )
}