'use client'

import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Scale, AlertTriangle, Calendar, Gavel, Users } from 'lucide-react'
import Footer from '@/components/layout/footer'

export default function TermosPage() {
  const lastUpdated = "15 de Janeiro de 2025"

  const sections = [
    {
      icon: Users,
      title: "Aceitação dos Termos",
      content: [
        "Ao acessar e utilizar a plataforma Voluntaria+, você concorda com estes Termos de Uso",
        "Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços",
        "Estes termos se aplicam a todos os usuários: voluntários, ONGs e visitantes",
        "O uso continuado da plataforma constitui aceitação de eventuais modificações nos termos"
      ]
    },
    {
      icon: FileText,
      title: "Descrição dos Serviços",
      content: [
        "A Voluntaria+ é uma plataforma que conecta voluntários com organizações não governamentais",
        "Facilitamos o encontro entre pessoas interessadas em voluntariado e ONGs que precisam de ajuda",
        "Oferecemos ferramentas de busca, mapa interativo e sistema de contato direto",
        "Não somos responsáveis pela qualidade ou execução das atividades de voluntariado",
        "Atuamos apenas como intermediário na conexão entre as partes"
      ]
    },
    {
      icon: Scale,
      title: "Direitos e Responsabilidades dos Usuários",
      content: [
        "Fornecer informações verdadeiras e atualizadas em seu perfil",
        "Utilizar a plataforma de forma ética e respeitosa",
        "Não utilizar o serviço para fins comerciais não autorizados",
        "Respeitar os direitos de propriedade intelectual da plataforma",
        "Comunicar qualquer uso inadequado ou violação destes termos",
        "Manter a confidencialidade de suas credenciais de acesso"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Condutas Proibidas",
      content: [
        "Publicar conteúdo falso, enganoso ou fraudulento",
        "Utilizar a plataforma para atividades ilegais ou prejudiciais",
        "Assediar, intimidar ou discriminar outros usuários",
        "Tentar acessar contas de outros usuários sem autorização",
        "Interferir no funcionamento normal da plataforma",
        "Utilizar bots, scripts ou outras ferramentas automatizadas não autorizadas"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
              <Gavel className="h-5 w-5 text-primary mr-2" />
              <span className="text-primary font-medium">Termos Legais</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Termos de <span className="text-primary">Uso</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Condições gerais para utilização da plataforma Voluntaria+ e seus serviços.
            </p>
            
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Última atualização: {lastUpdated}</span>
            </div>
          </div>

          {/* Introduction */}
          <Card className="rounded-2xl shadow-lg mb-8">
            <CardContent className="p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                Estes Termos de Uso regulam a utilização da plataforma <strong>Voluntaria+</strong>, 
                operada pela equipe Voluntaria+, estabelecendo os direitos e obrigações entre 
                a plataforma e seus usuários.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Ao utilizar nossos serviços, você declara ter lido, compreendido e concordado 
                com todos os termos e condições aqui estabelecidos.
              </p>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Liability Limitations */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                Limitações de Responsabilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  A Voluntaria+ atua exclusivamente como intermediária na conexão entre voluntários e ONGs. 
                  Não nos responsabilizamos por:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• Qualidade, segurança ou legalidade das atividades de voluntariado</li>
                  <li>• Ações ou omissões de usuários da plataforma</li>
                  <li>• Danos decorrentes do uso inadequado da plataforma</li>
                  <li>• Interrupções temporárias do serviço por manutenção ou falhas técnicas</li>
                  <li>• Perda de dados devido a problemas técnicos ou ações de terceiros</li>
                </ul>
                <p>
                  Nossa responsabilidade está limitada ao fornecimento da plataforma de conexão, 
                  conforme descrito nestes termos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Propriedade Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  Todo o conteúdo da plataforma Voluntaria+, incluindo mas não limitado a textos, 
                  gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e 
                  compilações de dados, é propriedade da Voluntaria+ ou de seus fornecedores de conteúdo.
                </p>
                <p>
                  É proibida a reprodução, distribuição, modificação ou uso comercial de qualquer 
                  conteúdo sem autorização expressa por escrito.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                Modificações dos Termos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após sua publicação na plataforma.
                </p>
                <p>
                  Usuários serão notificados sobre mudanças significativas através de email ou 
                  aviso na plataforma. O uso continuado após as modificações constitui aceitação 
                  dos novos termos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Jurisdiction */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                Jurisdição e Lei Aplicável
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                  Qualquer disputa decorrente destes termos será submetida à jurisdição dos 
                  tribunais brasileiros.
                </p>
                <p>
                  Para questões relacionadas a estes termos, entre em contato através do email: <strong>voluntariamaisrs@gmail.com</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Dúvidas sobre os Termos?</h3>
              <p className="text-gray-700 mb-4">
                Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p><strong>Email:</strong> voluntariamaisrs@gmail.com</p>
                <p><strong>Localização:</strong> Porto Alegre, RS - Brasil</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}