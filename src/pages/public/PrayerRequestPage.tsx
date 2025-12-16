import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Send, CheckCircle, ChevronLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { createPrayerRequest } from '@/lib/api/member';

interface PrayerForm {
    name: string;
    category: string;
    content: string;
    is_confidential: boolean;
}

const CATEGORIES = [
    { value: 'saude', label: 'Saúde' },
    { value: 'familia', label: 'Família' },
    { value: 'espiritual', label: 'Vida Espiritual' },
    { value: 'financeiro', label: 'Vida Financeira' },
    { value: 'gratidao', label: 'Agradecimento' },
    { value: 'outros', label: 'Outros' },
];

export default function PrayerRequestPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<PrayerForm>({
        defaultValues: {
            is_confidential: false
        }
    });
    const [success, setSuccess] = useState(false);

    const onSubmit = async (data: PrayerForm) => {
        try {
            await createPrayerRequest(data);
            setSuccess(true);
            toast.success("Pedido enviado com sucesso!");
        } catch (error) {
            toast.error("Erro ao enviar pedido. Tente novamente.");
            console.error(error);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500 p-4 pt-20">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Pedido Recebido</h2>
                <p className="text-slate-600 max-w-md text-lg mb-8">
                    Nossa equipe pastoral recebeu seu pedido e estará orando por você.
                    {watch('is_confidential') && " Seu pedido será mantido em sigilo absoluto."}
                </p>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/home')}
                    >
                        Voltar ao Início
                    </Button>
                    <Button
                        onClick={() => { setSuccess(false); setValue('content', ''); }}
                    >
                        Novo Pedido
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-6 px-4 pt-20 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-800">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
            </div>

            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
                    <Heart className="h-8 w-8 text-rose-500 fill-rose-100" />
                    Pedido de Oração
                </h1>
                <p className="text-muted-foreground">
                    "Clama a mim, e responder-te-ei..." <span className="text-xs font-semibold block mt-1">Jeremias 33:3</span>
                </p>
            </div>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Categoria</label>
                            <Select onValueChange={(val) => setValue('category', val)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o motivo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Seu Pedido</label>
                            <Textarea
                                {...register('content', { required: true })}
                                placeholder="Descreva seu pedido aqui..."
                                className="min-h-[150px] resize-none text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Nome (Opcional)</label>
                            <Input {...register('name')} placeholder="Como gostaria de ser identificado?" />
                            <p className="text-xs text-muted-foreground">Deixe em branco para enviar como Anônimo.</p>
                        </div>

                        <div className="flex items-center space-x-2 py-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Checkbox
                                id="confidential"
                                onCheckedChange={(checked) => setValue('is_confidential', checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="confidential"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                >
                                    <Lock className="w-3 h-3 text-slate-500" /> Pedido Sigiloso
                                </label>
                                <p className="text-xs text-slate-500">
                                    Apenas o pastor titular terá acesso a este pedido.
                                </p>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 text-lg shadow-md transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                "Enviando..."
                            ) : (
                                <>
                                    Enviar Pedido <Send className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
