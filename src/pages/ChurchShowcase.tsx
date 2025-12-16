import React from 'react';
import { useChurch } from '@/contexts/ChurchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, LogIn, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ChurchShowcase: React.FC = () => {
    const { church } = useChurch();
    const navigate = useNavigate();

    if (!church) return null; // Should not happen if inside ChurchProvider

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header / Brand */}
            <div className="bg-white border-b py-4 px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Voltar para Início</span>
                </Link>
                <div className="text-sm font-bold text-blue-600">MD Connect</div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 max-w-md mx-auto w-full">

                {/* Church Logo & Name */}
                <div className="text-center space-y-4">
                    <div className="h-24 w-24 bg-white rounded-full shadow-sm border mx-auto flex items-center justify-center p-2">
                        {church.logo_url ? (
                            <img src={church.logo_url} alt={church.name} className="h-full w-full object-contain rounded-full" />
                        ) : (
                            <span className="text-2xl font-bold text-slate-300">{church.name.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{church.name}</h1>
                        <p className="text-slate-500">{church.city || 'Localidade'}, {church.state || 'UF'}</p>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="w-full space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-blue-600" /> Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">
                                {church.address || 'Endereço não cadastrado'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-blue-600" /> Cultos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">
                                {church.service_times || 'Horários não disponíveis'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Login Action */}
                <div className="w-full">
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                        onClick={() => navigate('/login')}
                    >
                        <LogIn className="mr-2 h-5 w-5" />
                        Sou Membro / Entrar
                    </Button>
                    <p className="text-xs text-center text-slate-400 mt-4">
                        Acesso exclusivo para membros cadastrados.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ChurchShowcase;
