'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Clock, 
  Mail,
  User,
  Building,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Footer from '@/components/layout/footer'
import { toast } from 'sonner'

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const categories = [
    { id: 'todos', name: 'Todas as Categorias', count: 12 },
    { id: 'cadastro', name: 'Cadastro e Login', count: 4 },
    { id: 'voluntario', name: 'Para Voluntários', count: 3 },
    { id: 'ong', name: 'Para ONGs', count: 3 },
    { id: 'tecnico', name: 'Problemas Técnicos', count: 2 }
  ]

  const faqs = [
    {
      id: 1,
      category: 'cadastro',
      question: 'Como faço para me cadastrar na plataforma?',
      answer: 'Para se cadastrar, clique no botão "Cadastrar" no menu superior, escolha se você é um voluntário ou representa uma ONG, preencha seus dados pessoais e confirme seu email. O processo é rápido e gratuito!'
    },
    {
      id: 2,
      category: 'cadastro',
      question: 'Esqueci minha senha, como recuperar?',
      answer: 'Na página de login, clique em "Esqueci minha senha", digite seu email cadastrado e você receberá instruções para criar uma nova senha. Verifique também sua caixa de spam.'
    },
    {
      id: 3,
      category: 'cadastro',
      question: 'Posso alterar meu tipo de conta depois do cadastro?',
      answer: 'Atualmente não é possível alterar o tipo de conta (voluntário para ONG ou vice-versa) após o cadastro. Se necessário, entre em contato conosco para avaliarmos seu caso específico.'
    },
    {
      id: 4,
      category: 'cadastro',
      question: 'Minha conta foi bloqueada, o que fazer?',
      answer: 'Se sua conta foi bloqueada, pode ser devido a violação dos termos de uso. Entre em contato conosco através do formulário abaixo explicando a situação para que possamos analisar seu caso.'
    },
    {
      id: 5,
      category: 'voluntario',
      question: 'Como encontro oportunidades de voluntariado?',
      answer: 'Use nossa página de Oportunidades para buscar ONGs por localização, causa ou tipo de atividade. Você também pode usar o Mapa Interativo para encontrar organizações próximas a você.'
    },
    {
      id: 6,
      category: 'voluntario',
      question: 'Como entro em contato com uma ONG?',
      answer: 'Após encontrar uma ONG de interesse, clique no card dela para ver os detalhes. Se a organização tiver WhatsApp cadastrado, você pode entrar em contato diretamente através do botão "Conversar no WhatsApp".'
    },
    {
      id: 7,
      category: 'voluntario',
      question: 'Posso me voluntariar em várias ONGs ao mesmo tempo?',
      answer: 'Sim! Você pode se conectar com quantas ONGs desejar. Recomendamos que avalie bem sua disponibilidade para não comprometer os compromissos assumidos com as organizações.'
    },
    {
      id: 8,
      category: 'ong',
      question: 'Como cadastro minha ONG na plataforma?',
      answer: 'Crie uma conta escolhendo "ONG" no cadastro. Após confirmar seu email, acesse seu perfil e preencha as informações da organização: nome, descrição, localização, áreas de atuação e formas como voluntários podem ajudar.'
    },
    {
      id: 9,
      category: 'ong',
      question: 'É gratuito para ONGs utilizarem a plataforma?',
      answer: 'Sim! Nossa plataforma é totalmente gratuita para ONGs. Nosso objetivo é facilitar a conexão entre organizações e voluntários sem custos adicionais.'
    },
    {
      id: 10,
      category: 'ong',
      question: 'Como apareço nos resultados de busca?',
      answer: 'Mantenha o perfil da sua ONG sempre atualizado com informações completas: descrição detalhada, localização, áreas de necessidade e formas de contato. Quanto mais completo o perfil, melhor a visibilidade.'
    },
    {
      id: 11,
      category: 'tecnico',
      question: 'O site está lento ou não carrega, o que fazer?',
      answer: 'Primeiro, verifique sua conexão com a internet. Tente atualizar a página (F5) ou limpar o cache do navegador. Se o problema persistir, pode ser uma manutenção temporária - tente novamente em alguns minutos.'
    },
    {
      id: 12,
      category: 'tecnico',
      question: 'Não consigo enviar mensagens ou fazer contato',
      answer: 'Verifique se você está logado na plataforma. Para contatar ONGs via WhatsApp, certifique-se de que tem o aplicativo instalado. Se o problema persistir, entre em contato conosco.'
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'todos' || faq.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    toast.success('Mensagem enviada com sucesso! Responderemos em até 24 horas.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 mb-6">
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
              <span className="text-sm sm:text-base md:text-lg text-primary font-medium">Suporte e Ajuda</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Central de <span className="text-primary">Ajuda</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre respostas para suas dúvidas ou entre em contato conosco. 
              Estamos aqui para ajudar você a aproveitar ao máximo a plataforma Voluntaria+.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="rounded-2xl shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Busque por palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl text-lg py-3"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Categorias</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${
                          selectedCategory === category.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${
                            selectedCategory === category.id ? 'text-primary' : 'text-gray-700'
                          }`}>
                            {category.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="rounded-2xl shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    Tempo de Resposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email</span>
                      <Badge className="bg-green-100 text-green-700">24h</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Formulário</span>
                      <Badge className="bg-blue-100 text-blue-700">48h</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Perguntas Frequentes
                  {searchTerm && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      - {filteredFaqs.length} resultado(s) para "{searchTerm}"
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  {selectedCategory === 'todos' 
                    ? 'Todas as perguntas mais comuns sobre a plataforma'
                    : `Perguntas sobre ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}`
                  }
                </p>
              </div>

              {/* FAQ List */}
              <div className="space-y-4 mb-12">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <Card key={faq.id} className="rounded-2xl shadow-lg">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                            {expandedFaq === faq.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        
                        {expandedFaq === faq.id && (
                          <div className="px-6 pb-6">
                            <div className="border-t pt-4">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="rounded-2xl shadow-lg">
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma pergunta encontrada</h3>
                      <p className="text-gray-600">
                        Tente usar outros termos de busca ou selecione uma categoria diferente.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Contact Form */}
              <Card className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <MessageCircle className="h-5 w-5 text-primary mr-3" />
                    Não encontrou sua resposta?
                  </CardTitle>
                  <p className="text-gray-600">
                    Entre em contato conosco e responderemos o mais rápido possível.
                  </p>
                </CardHeader>
                <CardContent>
                 <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold mb-2">Formas de contato:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-primary mr-2" />
                        <span>voluntariamaisrs@gmail.com</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-2" />
                        <span>Porto Alegre, RS - Brasil</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}