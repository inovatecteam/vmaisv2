'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Droplet, Calendar, Clock, MapPin, ArrowLeft, Download, Eye, FileText, CheckCircle, Heart, Users, Shield, Zap, FileCheck, UserPlus, Copy, ShieldPlus, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { testSupabaseConnection } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JsBarcode from 'jsbarcode';

export function BloodDonationCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registrationId, setRegistrationId] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<string>('');
  const [slotCapacities, setSlotCapacities] = useState<{[key: string]: number}>({});
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
    nome_mae: '',
    nome_pai: '',
    horario_selecionado: '',
    observacoes: '',
    participando_batalha: 'não',
    turma_batalha: ''
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return value.slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
    return value.slice(0, 15);
  };

  // Function to fetch slot capacities from database
  const fetchSlotCapacities = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_donation_registrations')
        .select('horario_selecionado')
        .in('horario_selecionado', ['30-7h40-8h40', '30-8h40-9h40', '30-9h40-10h40', '30-10h40-11h40']);

      if (error) throw error;

      // Count registrations for each slot
      const capacities: {[key: string]: number} = {
        '30-7h40-8h40': 0,
        '30-8h40-9h40': 0,
        '30-9h40-10h40': 0,
        '30-10h40-11h40': 0
      };

      data?.forEach(registration => {
        const slot = registration.horario_selecionado;
        if (capacities.hasOwnProperty(slot)) {
          capacities[slot]++;
        }
      });

      setSlotCapacities(capacities);
    } catch (error) {
      console.error('Error fetching slot capacities:', error);
      // Set default capacities if error occurs
      setSlotCapacities({
        '30-7h40-8h40': 0,
        '30-8h40-9h40': 0,
        '30-9h40-10h40': 0,
        '30-10h40-11h40': 0
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      setFormData({ ...formData, [field]: formatCPF(value) });
    } else if (field === 'telefone') {
      setFormData({ ...formData, [field]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar data de nascimento (não permitir datas após 30/10/2009)
    const birthDate = new Date(formData.data_nascimento);
    const maxDate = new Date('2009-10-30');
    
    if (birthDate > maxDate) {
      toast.error('A data de nascimento não pode ser posterior a 30/10/2009.');
      setIsSubmitting(false);
      return;
    }

    // Validar horário selecionado
    if (!formData.horario_selecionado) {
      toast.error('Por favor, selecione um horário para a doação.');
      setIsSubmitting(false);
      return;
    }

    // Validar turma da batalha se participando
    if (formData.participando_batalha === 'sim' && !formData.turma_batalha) {
      toast.error('Por favor, selecione sua turma para a Batalha dos Farroups.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Test Supabase connection first
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        console.error('Supabase connection test failed:', connectionTest);
        toast.error(`Erro de conexão: ${connectionTest.error}`);
        return;
      }

      // Check if CPF already exists
      const { data: existingRegistration, error: checkError } = await supabase
        .from('blood_donation_registrations')
        .select('cpf')
        .eq('cpf', formData.cpf)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking existing CPF:', checkError);
        toast.error('Erro ao verificar CPF. Tente novamente.');
        return;
      }

      if (existingRegistration) {
        toast.error('Este CPF já possui uma inscrição na campanha de doação de sangue.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for insertion, ensuring turma_batalha is null when not participating
      const insertData = {
        ...formData,
        turma_batalha: formData.participando_batalha === 'sim' ? formData.turma_batalha : null
      };

      console.log('Attempting to insert data:', insertData);

      const { error } = await supabase
        .from('blood_donation_registrations')
        .insert([insertData]);

      if (error) throw error;

      // Gerar ID único para a inscrição
      const newRegistrationId = `BD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setRegistrationId(newRegistrationId);

      toast.success('Inscrição realizada com sucesso!');
      setShowForm(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error submitting registration:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error('Error keys:', error ? Object.keys(error) : 'No keys');
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Form data being submitted:', formData);
      
      // Mostrar mensagem de erro mais específica
      let errorMessage = 'Erro desconhecido';
      
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('details' in error && typeof error.details === 'string') {
          errorMessage = error.details;
        } else if ('hint' in error && typeof error.hint === 'string') {
          errorMessage = error.hint;
        } else if ('code' in error && typeof error.code === 'string') {
          errorMessage = `Erro ${error.code}`;
        } else {
          // Tentar serializar o erro de forma mais robusta
          try {
            errorMessage = JSON.stringify(error, Object.getOwnPropertyNames(error));
          } catch (serializationError) {
            errorMessage = `Erro: ${error.toString()}`;
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error) {
        errorMessage = error.toString();
      }
      
      toast.error(`Erro ao realizar inscrição: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setShowForm(false);
    setShowConfirmation(false);
    setTermsAccepted(false);
    setRegistrationId('');
    setPdfBlob('');
      setFormData({
        nome_completo: '',
        data_nascimento: '',
        cpf: '',
        endereco: '',
        telefone: '',
        email: '',
        nome_mae: '',
        nome_pai: '',
      horario_selecionado: '',
      observacoes: '',
      participando_batalha: 'não',
      turma_batalha: ''
    });
  };

  const generateBarcode = (text: string): string => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, text, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: false,
        fontSize: 12,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000'
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Erro ao gerar código de barras:', error);
      // Fallback: criar um canvas simples com texto
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 50);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 100, 30);
      }
      return canvas.toDataURL('image/png');
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF();
      
      // Header com logo
      pdf.setFillColor(239, 68, 68); // Vermelho
      pdf.rect(0, 0, 210, 30, 'F');
      
      // Logo branco
      try {
        const logoImg = new Image();
        logoImg.src = '/logo-white.png';
        
        // Aguardar o carregamento da imagem
        await new Promise((resolve) => {
          if (logoImg.complete) {
            resolve(true);
          } else {
            logoImg.onload = () => resolve(true);
            logoImg.onerror = () => resolve(false);
          }
        });
        
        // Adicionar logo com dimensões apropriadas (mantendo proporção)
        const logoWidth = 57;
        const logoHeight = 30;
        pdf.addImage(logoImg, 'PNG', 18, 2, logoWidth, logoHeight);
      } catch (error) {
        console.warn('Erro ao carregar logo, usando texto como fallback');
        // Fallback para texto caso a imagem não carregue
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Voluntaria+', 20, 20);
      }
      
      // Adicionar informação da turma no canto superior direito (se participando da batalha)
      if (formData.participando_batalha === 'sim' && formData.turma_batalha) {
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Turma ${formData.turma_batalha}`, 167, 20);
      }
      
      // Título do documento
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Confirmação de Inscrição — Campanha de Doação de Sangue', 20, 50);
      
      // Dados da inscrição
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const yStart = 64;
      let yPos = yStart;
      
      pdf.text(`Nome: ${formData.nome_completo}`, 20, yPos);
      yPos += 10;
      
      // Formatar data de nascimento para dd/mm/aaaa
      const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
      };
      
      pdf.text(`Data de Nascimento: ${formatDate(formData.data_nascimento)}`, 20, yPos);
      yPos += 10;
      pdf.text(`CPF: ${formData.cpf}`, 20, yPos);
      yPos += 10;
      pdf.text(`Endereço: ${formData.endereco}`, 20, yPos);
      yPos += 10;
      pdf.text(`Telefone: ${formData.telefone}`, 20, yPos);
      yPos += 10;
      pdf.text(`E-mail: ${formData.email}`, 20, yPos);
      yPos += 10;
      pdf.text(`Nome da Mãe: ${formData.nome_mae}`, 20, yPos);
      yPos += 10;
      pdf.text(`Nome do Pai: ${formData.nome_pai}`, 20, yPos);
      yPos += 10;
      
      // Formatar e exibir horário selecionado
      const [dia, horario] = formData.horario_selecionado.split('-');
      const diaFormatado = '30 de outubro de 2025';
      pdf.text(`Horário Selecionado: ${diaFormatado}, ${horario}`, 20, yPos);
      yPos += 10;
      pdf.text(`Local: Colégio Farroupilha, Jardim de Infância – Rua Carlos Huber, 425`, 20, yPos);
      yPos += 10;
      
      // Adicionar observações se preenchidas
      if (formData.observacoes && formData.observacoes.trim()) { 
        pdf.text(`Observações: ${formData.observacoes}`, 20, yPos);
      }

      yPos += 20;
      
      // Orientações (Lorem Ipsum)
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Orientações Importantes:', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const instructions = [
"No dia da coleta, leve documento oficial com foto, não esteja em jejum e evite alimentos gordurosos nas 3 horas anteriores.",
"Durma ao menos 6 horas nas últimas 24h, mantenha-se hidratado e não consuma bebida alcoólica nas 12 horas anteriores.",
"Após doar, evite esforço físico, esportes e carregar peso por 12 horas.",
"Se apresentar febre, diarreia ou sintomas infecciosos até 15 dias após a doação, comunique imediatamente o hemocentro.",
"Seja sincero na triagem — informações corretas protegem pacientes. Mais informações: https://saude.rs.gov.br/doacao-de-sangue"
      ];
      
      instructions.forEach((instruction) => {
        if (instruction.trim() === "") {
          yPos += 5; // Espaço extra para linhas vazias
        } else {
          const lines = pdf.splitTextToSize(instruction, 170);
          lines.forEach((line: string) => {
            pdf.text(line, 20, yPos);
            yPos += 5;
          });
          yPos += 2;
        }
      });
      
      yPos += 20;
      
      // Código de inscrição e código de barras posicionados abaixo, independente do espaço
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Código de Inscrição: ${registrationId}`, 20, 266);
      
      // Código de barras menor, alinhado à margem direita
      const barcodeData = generateBarcode(registrationId);
      const barcodeWidth = 60; // Reduzido de 80 para 60
      const barcodeHeight = 15; // Reduzido de 20 para 15
      const rightMargin = 210 - 20; // Margem direita de 20px
      const barcodeX = rightMargin - barcodeWidth;
      const barcodeY = 256; // Centralizado com o texto
      pdf.addImage(barcodeData, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
      
      yPos += 15;
      
      // Footer
      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFillColor(239, 68, 68);
      pdf.rect(0, pageHeight - 20, 210, 20, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      // Centralizar verticalmente no footer (altura do footer é 20px, então centro é pageHeight - 10)
      pdf.text('Voluntaria+ | Conectando pessoas a causas que importam', 20, pageHeight - 8);
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      pdf.text(`Gerado em: ${formattedDate}`, 150, pageHeight - 8);
      
      return pdf;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  const generateAndStorePDF = async () => {
    try {
      const pdf = await generatePDF();
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfBlob(pdfUrl);
      return pdf;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = await generateAndStorePDF();
      pdf.save(`confirmacao_doacao_sangue_${registrationId}.pdf`);
      toast.success('PDF baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Gerar PDF automaticamente quando a confirmação for exibida
  useEffect(() => {
    if (showConfirmation && registrationId) {
      generateAndStorePDF().catch(error => {
        console.error('Erro ao gerar PDF para visualização:', error);
      });
    }
  }, [showConfirmation, registrationId]);

  // Fetch slot capacities when form is shown
  useEffect(() => {
    if (showForm) {
      fetchSlotCapacities();
    }
  }, [showForm]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
      toast.success('Código copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar código. Tente novamente.');
    }
  };

  return (
    <>
      <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-br from-red-50 via-red-100/50 to-pink-50 hover:shadow-2xl transition-all duration-500 h-full flex flex-col group overflow-hidden">
        {/* Header com gradiente e padrão */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <Droplet className="h-7 w-7 text-white" fill="currentColor" />
            </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Campanha de Doação de Sangue</h3>
                <Badge className="bg-white/20 text-white border-white/30 mt-2 backdrop-blur-sm">
                Campanha Especial
              </Badge>
            </div>
          </div>

          </div>

          <p className="text-white/90 text-lg leading-relaxed mb-6">
            🎉 Campanha realizada com sucesso! Obrigado a todos os 80 voluntários que participaram dessa ação incrível. Juntos, salvamos vidas!
          </p>

          {/* Estatísticas visuais */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <CheckCircle className="h-5 w-5 text-white mx-auto mb-1" />
              <div className="text-sm text-white/80">Campanha</div>
              <div className="text-lg font-bold text-white">Concluída</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-white mx-auto mb-1" />
              <div className="text-sm text-white/80">Voluntários</div>
              <div className="text-lg font-bold text-white">80</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
              <Heart className="h-5 w-5 text-white mx-auto mb-1 fill-current" />
              <div className="text-sm text-white/80">Vidas</div>
              <div className="text-lg font-bold text-white">Salvas</div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Informações do evento */}
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-red-200/50 shadow-sm mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">30 de outubro de 2025</div>
                  <div className="text-sm text-gray-600">Dia da campanha</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Das 7h40 às 11h40</div>
                  <div className="text-sm text-gray-600">Horário estendido</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Colégio Farroupilha</div>
                  <div className="text-sm text-gray-600">Entrada Jardim de Infância</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileCheck className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Documento com foto obrigatório</div>
                  <div className="text-sm text-gray-600">RG, CNH ou passaporte</div>
                </div>
              </div>
            </div>
          </div>

          

          <div className="mt-auto">
            <a href="https://www.instagram.com/voluntariamais/" target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold rounded-xl py-4 text-md shadow-lg flex items-center justify-center gap-2 border-0 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
                Ver Fotos da Campanha no Instagram
              </Button>
            </a>

            <div className="text-center pt-4 border-t border-gray-200/50 mt-4">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                ✨ Obrigado por fazer parte dessa história • Cada doação salvou vidas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <Droplet className="h-6 w-6" fill="currentColor" />
              Campanha de Doação de Sangue
            </DialogTitle>
          </DialogHeader>

          {!showForm && !showConfirmation ? (
            // Primeiro estágio: Informações sobre a campanha e termos
          <div className="space-y-6">
              {/* Texto inicial sobre a campanha */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                  Sobre a Campanha
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Participe da nossa campanha de doação de sangue e ajude a salvar vidas! 
                  Cada doação pode beneficiar até 4 pessoas e é um gesto de solidariedade que 
                  faz toda a diferença para quem precisa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span><strong>Data:</strong> 30 de outubro de 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span><strong>Horário:</strong> Das 7h40 às 11h40</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span><strong>Local:</strong> Colégio Farroupilha</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileCheck className="h-4 w-4 text-red-500" />
                    <span><strong>Documento:</strong> Com foto (obrigatório)</span>
                  </div>
                </div>
              </div>

              {/* Informações completas sobre doação de sangue */}
              <div className="space-y-6">
                {/* Requisitos básicos */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center gap-2">
                    <span className="text-xl">🩸</span>
                    Requisitos para Doar Sangue
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Estar em boas condições de saúde</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Apresentar documento oficial com foto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Idade entre 16 e 69 anos (menores acompanhados por responsável; primeira doação até 60 anos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Pesar no mínimo 50 kg</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Não estar em jejum (evitar alimentação gordurosa nas 3h anteriores)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Ter dormido pelo menos 6h nas últimas 24h</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Não ingerir bebidas alcoólicas nas 12h anteriores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Não fumar por pelo menos 2h antes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Reforçar a hidratação</span>
                </li>
              </ul>
            </div>

                {/* Intervalo entre doações */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-lg mb-4 text-blue-700 flex items-center gap-2">
                    <span className="text-xl">🔁</span>
                    Intervalo entre Doações
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                      <div className="font-semibold text-blue-800 mb-2">Mulheres</div>
                      <div className="text-sm text-gray-700">
                        <div className="font-bold text-blue-600">Mínimo de 90 dias</div>
                        <div className="text-gray-600">(até 3x ao ano)</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                      <div className="font-semibold text-blue-800 mb-2">Homens</div>
                      <div className="text-sm text-gray-700">
                        <div className="font-bold text-blue-600">Mínimo de 60 dias</div>
                        <div className="text-gray-600">(até 4x ao ano)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impeditivos temporários */}
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h4 className="font-bold text-lg mb-4 text-yellow-700 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    Impeditivos Temporários
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">Saúde Geral:</div>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Resfriado: aguardar 7 dias após os sintomas</li>
                        <li>• Gripe com febre: 14 dias após melhora</li>
                        <li>• Covid-19: 10 dias após recuperação completa</li>
                        <li>• Alergias ativas: aguardar até desaparecerem</li>
                        <li>• Infecções bacterianas: 2 semanas após término</li>
                        <li>• Herpes labial/genital: após desaparecimento das lesões</li>
                        <li>• Epilepsia: 3 anos após fim do tratamento e sem crises</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">Gravidez e Parto:</div>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Gravidez</li>
                        <li>• Parto normal: após 90 dias</li>
                        <li>• Cesariana: após 180 dias</li>
                        <li>• Amamentação: após 12 meses do parto</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">Procedimentos:</div>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Tatuagem/maquiagem definitiva: 12 meses (6 se local seguro)</li>
                        <li>• Situações de risco para ISTs: 6 a 12 meses</li>
                        <li>• Piercing oral/genital: 12 meses após retirada</li>
                        <li>• Procedimento endoscópico: 6 meses</li>
                        <li>• Extração dentária/canal: mínimo de 7 dias</li>
                        <li>• Cirurgias: 3 a 6 meses</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 mb-2">Vacinas:</div>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Gripe, Hep. B, Coronavac/Covaxin: após 48h</li>
                        <li>• AstraZeneca, Pfizer, Janssen, Moderna: após 7 dias</li>
                        <li>• Febre Amarela, Tríplice viral: após 4 semanas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Impeditivos definitivos */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h4 className="font-bold text-lg mb-4 text-red-700 flex items-center gap-2">
                    <span className="text-xl">❌</span>
                    Impeditivos Definitivos
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Teste positivo para HIV, HTLV, Hepatite B ou C</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Hepatite após os 11 anos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Doença de Chagas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Câncer ou leucemia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Diabetes com complicações vasculares ou em uso de insulina</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Bronquite ou asma grave</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>AVC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Tuberculose extrapulmonar</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      <span className="font-semibold">🩺</span> Outros critérios podem ser avaliados pelo profissional de triagem.
                    </p>
                    <p className="text-sm text-red-800 mt-1">
                      <span className="font-semibold">Seja sincero</span> — honestidade também salva vidas.
                    </p>
                  </div>
                </div>

                {/* Cuidados pós-doação */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h4 className="font-bold text-lg mb-4 text-green-700 flex items-center gap-2">
                    <span className="text-xl">🔋</span>
                    Cuidados Pós-Doação
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Permaneça no hemocentro por <strong>15 minutos</strong> após doar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Consuma o lanche oferecido antes de sair</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Beba mais líquidos nas próximas 24h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Evite álcool por 12h e cigarro por 1h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Mantenha o curativo por 4h; não faça força com o braço da coleta</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Evite esforço físico e esportes por 12h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Em caso de mal-estar: <strong>sente-se ou deite-se com as pernas elevadas</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>Se os sintomas persistirem, procure o hemocentro ou serviço de saúde</span>
                    </li>
                  </ul>
                </div>

                {/* Atenção */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                  <h4 className="font-bold text-lg mb-4 text-orange-700 flex items-center gap-2">
                    <span className="text-xl">☎️</span>
                    Atenção
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      Se tiver <strong>febre, diarreia ou sintomas infecciosos até 15 dias após doar</strong>, 
                      informe o hemocentro imediatamente.
                    </p>
                    <p>
                      Se lembrar de <strong>qualquer motivo que impeça o uso do seu sangue</strong>, 
                      avise o hemocentro o quanto antes — isso protege quem precisa da transfusão.
                    </p>
                    <p className="text-orange-700">
                      📞 Contatos disponíveis na listagem de serviços do hemocentro.
                    </p>
                    <p className="text-orange-700">
                      🌐 <strong>Mais informações:</strong> <a href="https://www.saude.rs.gov.br/doacao-de-sangue" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-800">www.saude.rs.gov.br/doacao-de-sangue</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkbox de confirmação */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-semibold">Declaro que li e estou em conformidade</span> com todos os requisitos e termos mencionados acima para a doação de sangue. 
                      Entendo que é obrigatória a leitura completa dos termos para prosseguir com a inscrição.
                    </label>
                  </div>
                </div>
              </div>

              {/* Botão para prosseguir */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleModalClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={!termsAccepted}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Fazer Inscrição
                </Button>
              </div>
            </div>
          ) : showForm ? (
            // Segundo estágio: Formulário de inscrição
            <div className="space-y-6">
              {/* Cabeçalho do formulário */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h4 className="text-lg font-semibold text-gray-900">Formulário de Inscrição</h4>
            </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="nome_completo" className="text-sm font-medium">
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
                  <Input
                    id="nome_completo"
                    required
                    maxLength={50}
                    value={formData.nome_completo}
                    onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                      className="mt-1"
                  />
                </div>

                <div>
                    <Label htmlFor="data_nascimento" className="text-sm font-medium">
                      Data de Nascimento <span className="text-red-500">*</span>
                    </Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    required
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                      max="2009-10-30"
                      className="mt-1"
                  />
                    <p className="text-xs text-gray-500 mt-1">
                      Data máxima: 30/10/2009
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="cpf" className="text-sm font-medium">
                      CPF <span className="text-red-500">*</span>
                    </Label>
                  <Input
                    id="cpf"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    maxLength={14}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="text-sm font-medium">
                      Telefone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="telefone"
                      required
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      maxLength={15}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="endereco" className="text-sm font-medium">
                    Endereço Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endereco"
                    required
                    maxLength={50}
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    maxLength={50}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="nome_mae" className="text-sm font-medium">
                      Nome da Mãe <span className="text-red-500">*</span>
                    </Label>
                  <Input
                    id="nome_mae"
                    required
                    maxLength={50}
                    value={formData.nome_mae}
                    onChange={(e) => handleInputChange('nome_mae', e.target.value)}
                      className="mt-1"
                  />
                </div>

                <div>
                    <Label htmlFor="nome_pai" className="text-sm font-medium">
                      Nome do Pai <span className="text-red-500">*</span>
                    </Label>
                  <Input
                    id="nome_pai"
                    required
                    maxLength={50}
                    value={formData.nome_pai}
                    onChange={(e) => handleInputChange('nome_pai', e.target.value)}
                      className="mt-1"
                  />
                  </div>
                </div>

                {/* Seleção de horário */}
                <div>
                  <Label className="text-sm font-medium">
                    Horário de Preferência <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 space-y-4">
                    {/* 30 de outubro */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">30 de outubro de 2025</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { display: '7h40-8h40', value: '30-7h40-8h40' },
                          { display: '8h40-9h40', value: '30-8h40-9h40' },
                          { display: '9h40-10h40', value: '30-9h40-10h40' },
                          { display: '10h40-11h40', value: '30-10h40-11h40' }
                        ].map(({ display, value }) => {
                          const isFull = slotCapacities[value] >= 20;
                          const isSelected = formData.horario_selecionado === value;
                          
                          return (
                            <Button
                              key={value}
                              type="button"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() => !isFull && setFormData({...formData, horario_selecionado: value})}
                              disabled={isFull}
                              className={`text-sm py-2 ${
                                isFull 
                                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed border-dashed' 
                                  : isSelected 
                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                    : 'border-red-200 text-red-600 hover:bg-red-50'
                              }`}
                            >
                              {display}
                              {isFull && <span className="ml-1 text-xs">(Lotado)</span>}
                            </Button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Cada horário tem limite de 20 doadores. Horários lotados aparecem em cinza.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-sm font-medium">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={3}
                    maxLength={100}
                    className="mt-1"
                    placeholder="Informações adicionais que considere relevantes..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.observacoes.length}/100 caracteres
                  </p>
                </div>

                {/* Campo Batalha dos Farroups */}
                <div>
                  <Label className="text-sm font-medium">
                    Estou participando da Batalha dos Farroups <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="participando_batalha"
                        value="não"
                        checked={formData.participando_batalha === 'não'}
                        onChange={(e) => setFormData({...formData, participando_batalha: e.target.value, turma_batalha: ''})}
                        className="text-red-500"
                      />
                      <span className="text-sm">Não</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="participando_batalha"
                        value="sim"
                        checked={formData.participando_batalha === 'sim'}
                        onChange={(e) => setFormData({...formData, participando_batalha: e.target.value})}
                        className="text-red-500"
                      />
                      <span className="text-sm">Sim</span>
                    </label>
                  </div>
                  
                  {/* Seleção de turma - aparece apenas se "Sim" for selecionado */}
                  {formData.participando_batalha === 'sim' && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">
                        Turma <span className="text-red-500">*</span>
                      </Label>
                      <div className="mt-2 grid grid-cols-3 md:grid-cols-6 gap-2">
                        {['9A', '9B', '9C', '9D', '9E', '9F'].map((turma) => (
                          <Button
                            key={turma}
                            type="button"
                            variant={formData.turma_batalha === turma ? 'default' : 'outline'}
                            onClick={() => setFormData({...formData, turma_batalha: turma})}
                            className={`text-sm py-2 ${
                              formData.turma_batalha === turma 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {turma}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                <Button
                  type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}
                </Button>
                </div>
              </form>
            </div>
          ) : (
            // Terceiro estágio: Confirmação e PDF
            <div className="space-y-6">
              {/* Cabeçalho da confirmação */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(true)}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h4 className="text-lg font-semibold text-gray-900">Confirmação de Inscrição</h4>
              </div>

              {/* Mensagem de sucesso */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-green-700">Inscrição Recebida!</h3>
                </div>
                <p className="text-green-700 leading-relaxed">
                  Sua inscrição para a campanha de doação de sangue foi realizada com sucesso! 
                  A apresentação da confirmação não é necessária, mas ajudará na agilidade do processo.
                </p>
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      <strong>Código de Inscrição:</strong> {registrationId}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyCode}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Seção do PDF */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Confirmação em PDF</h4>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Baixe sua confirmação em PDF com todos os seus dados e orientações.
                </p>

                {/* Botão de download em largura completa */}
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>

                {/* Visualização do PDF real */}
                <div className="mt-6">
                  <h5 className="font-semibold text-gray-800 mb-3">Visualização do Documento:</h5>
                  <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                    {pdfBlob ? (
                      <iframe
                        src={pdfBlob}
                        className="w-full h-96 border-0"
                        title="Confirmação de Inscrição - PDF"
                      />
                    ) : (
                      <div className="h-96 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Gerando documento...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="flex-1"
                >
                  Voltar ao Formulário
                </Button>
                <Button
                  onClick={handleModalClose}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Finalizar
                </Button>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
