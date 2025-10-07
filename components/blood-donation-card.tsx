'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Droplet, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function BloodDonationCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
    nome_mae: '',
    nome_pai: '',
    observacoes: ''
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

    try {
      const { error } = await supabase
        .from('blood_donation_registrations')
        .insert([formData]);

      if (error) throw error;

      toast.success('Inscrição realizada com sucesso!');
      setFormData({
        nome_completo: '',
        data_nascimento: '',
        cpf: '',
        endereco: '',
        telefone: '',
        email: '',
        nome_mae: '',
        nome_pai: '',
        observacoes: ''
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="rounded-2xl shadow-xl border-0 bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col" onClick={() => setIsOpen(true)}>
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <Droplet className="h-6 w-6 text-red-500" fill="currentColor" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">Campanha de Doação de Sangue</h3>
              <Badge className="bg-red-100 text-red-700 mt-1">
                Campanha Especial
              </Badge>
            </div>
          </div>

          <p className="text-gray-700 text-base leading-relaxed mb-4">
            Participe da nossa campanha de doação de sangue e ajude a salvar vidas. Cada doação pode beneficiar até 4 pessoas!
          </p>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-red-500" />
                <span className="font-medium">24 e 25 de outubro de 2025</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-red-500" />
                <span>Das 8h às 12h</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Local a ser confirmado</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <Button className="w-full bg-red-500 hover:bg-red-600 font-semibold rounded-xl py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Inscreva-se Agora
            </Button>

            <div className="text-center pt-4 border-t border-gray-200 mt-4">
              <p className="text-xs text-gray-500">
                Salve vidas com um gesto simples • Processo rápido e seguro
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <Droplet className="h-6 w-6" fill="currentColor" />
              Campanha de Doação de Sangue
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-bold text-lg mb-3 text-red-700">🩸 REQUISITOS PARA DOAR SANGUE</h4>
              <ul className="space-y-2 text-gray-700">
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

            <div className="border-t pt-6">
              <h4 className="font-bold text-lg mb-4 text-gray-900">Formulário de Inscrição</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome_completo">Nome Completo *</Label>
                  <Input
                    id="nome_completo"
                    required
                    value={formData.nome_completo}
                    onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    required
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    maxLength={14}
                  />
                </div>

                <div>
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    required
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    required
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    maxLength={15}
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="nome_mae">Nome da Mãe *</Label>
                  <Input
                    id="nome_mae"
                    required
                    value={formData.nome_mae}
                    onChange={(e) => handleInputChange('nome_mae', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="nome_pai">Nome do Pai *</Label>
                  <Input
                    id="nome_pai"
                    required
                    value={formData.nome_pai}
                    onChange={(e) => handleInputChange('nome_pai', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
