import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Church, Heart, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicHome: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Hero */}
            <section className="text-center py-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">MD Connect</h1>
                <p className="text-slate-500">Tecnologia a serviço do Reino. Mantenha-se conectado à Palavra onde estiver.</p>
            </section>

            {/* Quick Access Grid */}
            <section className="grid grid-cols-2 gap-4">
                <Link to="/biblia">
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Bíblia Online</h3>
                            <p className="text-xs text-slate-500 mt-1">Leitura diária</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/conteudos/devocionais">
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3">
                                <Heart className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Devocional</h3>
                            <p className="text-xs text-slate-500 mt-1">Alimento diário</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/c/demo-church">
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                                <Church className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Minha Igreja</h3>
                            <p className="text-xs text-slate-500 mt-1">Acessar área de membros</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/conteudos/mensagens/1">
                    <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                                <Video className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Conteúdos</h3>
                            <p className="text-xs text-slate-500 mt-1">Séries e Mensagens</p>
                        </CardContent>
                    </Card>
                </Link>
            </section>

            {/* Featured Verse */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
                <CardContent className="p-6">
                    <p className="text-lg font-medium italic opacity-90 mb-4">
                        "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles."
                    </p>
                    <p className="text-sm font-bold opacity-75 text-right">— Mateus 18:20</p>
                </CardContent>
            </Card>

            {/* Footer Info */}
            <div className="text-center text-xs text-slate-400 py-4">
                <p>© 2024 IPDA Connect. Todos os direitos reservados.</p>
            </div>
        </div>
    );
};

export default PublicHome;

