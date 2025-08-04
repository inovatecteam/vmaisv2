'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      question: 'Como faço para me cadastrar como voluntário?',
      answer: 'É muito simples! Clique em "Cadastrar" no menu superior, escolha "Voluntário", preencha seus dados e interesses. Após a confirmação do email, você já pode explorar as oportunidades.'
    },
    {
      question: 'É gratuito para ONGs utilizarem a plataforma?',
      answer: 'Sim! Nossa plataforma é totalmente gratuita para ONGs. Nosso objetivo é facilitar a conexão entre organizações e voluntários sem custos adicionais.'
    },
    {
      question: 'Como são verificadas as ONGs na plataforma?',
      answer: 'Todas as ONGs passam por um processo de verificação onde analisamos documentação, histórico e legitimidade da organização antes de aprovarem o cadastro.'
    },
    {
      question: 'Posso participar de várias atividades ao mesmo tempo?',
      answer: 'Claro! Você pode se inscrever em quantas atividades conseguir participar. Recomendamos que avalie bem sua disponibilidade para não comprometer os compromissos assumidos.'
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
      <section className="h-screen flex items-center justify-center px-4 pt-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-8">
            <Heart className="h-5 w-5 text-primary mr-2 fill-current" />
            <span className="text-primary font-medium">Conectando corações e causas</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
            Transforme vidas através do{' '}
            <span className="text-primary">voluntariado</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conectamos voluntários apaixonados com ONGs que fazem a diferença. 
            Descubra oportunidades próximas de você e seja parte da mudança que o mundo precisa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link href="/catalogo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl px-8 py-4 text-lg">
                  Explorar ONGs
                </Button>
              </Link>
            ) : (
              <Link href="/cadastrar">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl px-8 py-4 text-lg"
                >
                  Começar Agora
                </Button>
              </Link>
            )}
            <Link href="/catalogo">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-primary hover:text-primary rounded-2xl px-8 py-4 text-lg"
              >
                Ver ONGs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="flex items-center py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-gray-600">Conectar-se é simples e direto</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Benefícios Secton */}
      <section className="flex items-center py-16 px-4">
  <div className="max-w-7xl mx-auto"> {/* Changed from max-w-full to max-w-7xl */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">Por que usar a Voluntaria+?</h2>
      <p className="text-xl text-gray-600">Benefícios para toda a comunidade</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-12">
      {benefits.map((benefit, index) => (
        <Card key={index} className="border-none shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-2xl flex items-center">
              {benefit.title === 'Para Voluntários' ? (
                <Users className="h-6 w-6 text-primary mr-3" />
              ) : (
                <Shield className="h-6 w-6 text-primary mr-3" />
              )}
              {benefit.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {benefit.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
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
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Junte-se a milhares de pessoas que já transformam suas comunidades através do voluntariado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro"
              className="bg-white text-yellow-600 hover:bg-gray-50 px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
            >
              Sou Voluntário
            </Link>
            <Link
              href="/cadastro"
              className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
            >
              Sou uma ONG
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre como funciona nossa plataforma
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}