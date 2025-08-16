'use client'

import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Mail, Calendar, Lock, Eye, Users } from 'lucide-react'
import Footer from '@/components/layout/footer'

export default function PrivacidadePage() {
  const lastUpdated = "15 de Janeiro de 2025"

  const sections = [
    {
      icon: Eye,
      title: "Informações que Coletamos",
      content: [
        "Dados pessoais fornecidos voluntariamente (nome, email, telefone)",
        "Informações de perfil e preferências de voluntariado",
        "Dados de localização quando você utiliza nossos serviços de mapa",
        "Informações de uso do site através de cookies e tecnologias similares",
        "Dados de interação com ONGs através da plataforma"
      ]
    },
    {
      icon: Lock,
      title: "Como Utilizamos suas Informações",
      content: [
        "Conectar voluntários com ONGs compatíveis com seus interesses",
        "Personalizar sua experiência na plataforma",
        "Enviar comunicações relevantes sobre oportunidades de voluntariado",
        "Melhorar nossos serviços através de análises de uso",
        "Cumprir obrigações legais e regulamentares"
      ]
    },
    {
      icon: Users,
      title: "Compartilhamento de Dados",
      content: [
        "Com ONGs parceiras, apenas informações necessárias para conexão",
        "Com prestadores de serviços que nos auxiliam na operação da plataforma",
        "Quando exigido por lei ou autoridades competentes",
        "Nunca vendemos seus dados pessoais para terceiros",
        "Dados agregados e anonimizados podem ser compartilhados para pesquisas"
      ]
    },
    {
      icon: Shield,
      title: "Seus Direitos (LGPD)",
      content: [
        "Confirmação da existência de tratamento de dados pessoais",
        "Acesso aos seus dados pessoais",
        "Correção de dados incompletos, inexatos ou desatualizados",
        "Anonimização, bloqueio ou eliminação de dados desnecessários",
        "Portabilidade dos dados para outro fornecedor",
        "Eliminação dos dados tratados com seu consentimento",
        "Revogação do consentimento a qualquer momento"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50/30 to-orange-50/30">
      <Navbar />
      
      <div className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 mb-6">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
              <span className="text-sm sm:text-base md:text-lg text-primary font-medium">Proteção de Dados</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Política de <span className="text-primary">Privacidade</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Transparência total sobre como coletamos, utilizamos e protegemos suas informações pessoais.
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
                A <strong>Voluntaria+</strong> está comprometida com a proteção da sua privacidade e dos seus dados pessoais. 
                Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações 
                quando você utiliza nossa plataforma.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                e outras regulamentações aplicáveis de proteção de dados.
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
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

          {/* Security & Storage */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                Segurança e Armazenamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais 
                  contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
                <p>
                  Seus dados são armazenados em servidores seguros e criptografados. Mantemos seus dados apenas 
                  pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei.
                </p>
                <p>
                  Em caso de incidente de segurança que possa afetar seus dados, você será notificado conforme 
                  exigido pela legislação aplicável.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                Contato para Questões de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-700">
                <p>
                  Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos 
                  relacionados aos seus dados pessoais, entre em contato conosco:
                </p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p><strong>Email:</strong> voluntariamaisrs@gmail.com</p>
                  <p><strong>Localização:</strong> Porto Alegre, RS - Brasil</p>
                </div>
                <p className="text-sm text-gray-600">
                  Responderemos às suas solicitações dentro do prazo estabelecido pela LGPD (15 dias, 
                  prorrogáveis por mais 15 dias).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="rounded-2xl shadow-lg mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">Alterações nesta Política</h3>
              <p className="text-gray-700">
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos você sobre 
                mudanças significativas através do email cadastrado ou por meio de aviso em nossa plataforma. 
                Recomendamos que você revise esta política regularmente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}