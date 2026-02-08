import React from 'react';

interface HomeHeroProps {
    onScrollToBar: () => void;
    onScrollToFood: () => void;
    onOpenReservation: () => void;
    onScrollToChapman: () => void;
}

const HomeHero: React.FC<HomeHeroProps> = ({
    onScrollToBar,
    onScrollToFood,
    onOpenReservation,
    onScrollToChapman
}) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-defacto-black via-defacto-green to-defacto-black">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

            {/* Radial gradient accent */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-defacto-gold/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
                {/* Brand */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-defacto-cream tracking-tight leading-none mb-4">
                        De Facto
                    </h1>
                    <p className="text-2xl md:text-3xl font-serif italic text-defacto-gold">
                        Lounge & Bar
                    </p>
                </div>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-defacto-cream/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                    Asaba's premier destination for curated spirits, exquisite cuisine, and quiet sophistication.
                    <br />
                    <span className="text-defacto-gold font-medium">Where every moment is crafted with intention.</span>
                </p>

                {/* CTA Buttons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {/* BAR */}
                    <button
                        onClick={onScrollToBar}
                        className="group relative overflow-hidden bg-defacto-gold text-defacto-black px-8 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-defacto-gold/50"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                            </svg>
                            Explore Bar
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-defacto-gold via-yellow-400 to-defacto-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* RESTAURANT */}
                    <button
                        onClick={onScrollToFood}
                        className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-defacto-cream/30 text-defacto-cream px-8 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-defacto-gold"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>
                            Food Menu
                        </span>
                    </button>

                    {/* RESERVE TABLE */}
                    <button
                        onClick={onOpenReservation}
                        className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-defacto-cream/30 text-defacto-cream px-8 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-defacto-gold"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            Reserve Table
                        </span>
                    </button>

                    {/* CHAPMAN TRAY */}
                    <button
                        onClick={onScrollToChapman}
                        className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                            Chapman Tray
                        </span>
                    </button>
                </div>

                {/* Scroll indicator */}
                <div className="mt-16 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto text-defacto-gold/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
