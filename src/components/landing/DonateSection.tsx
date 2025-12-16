import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const DonateSection: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-rose-50 to-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-100/30 skew-x-12 transform origin-top-right"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-rose-100">

                    <div className="flex-1">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 font-heading">
                            Contribua com esta obra
                        </h2>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                            Se este projeto tem abençoado sua vida, considere fazer uma oferta voluntária.
                            Sua contribuição ajuda a manter a tecnologia, cobrir custos de infraestrutura e permitir
                            que continuemos evoluindo para servir mais igrejas.
                        </p>
                        <Link to="/doe">
                            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-200">
                                Quero contribuir <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="w-full md:w-1/3">
                        <img
                            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
                            alt="Donation Hand"
                            className="rounded-2xl shadow-lg w-full h-auto object-cover"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};
