
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Gift } from 'lucide-react';
import Snowfall from './components/Snowfall';
import MusicPlayer from './components/MusicPlayer';
import ChristmasTree from './components/ChristmasTree';
import BookDetail from './components/BookDetail';
import { ReadingRecord, TreeGroup } from './types';
import { COLORS, parseCSVData } from './constants';

const App: React.FC = () => {
    const [selectedBook, setSelectedBook] = useState<ReadingRecord | null>(null);
    const [data, setData] = useState<ReadingRecord[]>([]);

    useEffect(() => {
        setData(parseCSVData());
    }, []);

    const treeGroups = useMemo(() => {
        const groups: Record<string, ReadingRecord[]> = {};
        data.forEach(record => {
            if (!groups[record.treeId]) {
                groups[record.treeId] = [];
            }
            groups[record.treeId].push(record);
        });
        return Object.entries(groups).map(([id, records]) => ({ id, records } as TreeGroup));
    }, [data]);

    // Specific palettes for each tree using the vintage card colors
    const getTreeScheme = (treeId: string) => {
        const basePalette = [
            COLORS.poinsettaRed,
            COLORS.rusticWood,
            COLORS.leaf,
            COLORS.berryKiss,
            COLORS.juniper,
            COLORS.bow
        ];

        switch (treeId) {
            case '1号':
                return {
                    palette: [COLORS.poinsettaRed, COLORS.berryKiss, COLORS.bow, COLORS.darkChocolate],
                    accent: COLORS.candleGlow
                };
            case '2号':
                return {
                    palette: [COLORS.leaf, COLORS.juniper, COLORS.mistletoeShadow, COLORS.winterGarden],
                    accent: COLORS.candle
                };
            case '3号':
                return {
                    palette: [COLORS.rusticWood, COLORS.darkTruffle, COLORS.warmWood, COLORS.cookies],
                    accent: COLORS.candleGlow
                };
            case '4号':
                return {
                    palette: [COLORS.bow, COLORS.poinsettaRed, COLORS.darkChocolate, COLORS.berryKiss],
                    accent: COLORS.candle
                };
            case '5号':
                return {
                    palette: [COLORS.winterGarden, COLORS.juniper, COLORS.leaf, COLORS.mistletoeShadow],
                    accent: COLORS.candleGlow
                };
            default:
                return { palette: basePalette, accent: COLORS.candleGlow };
        }
    };

    return (
        <div className="min-h-screen relative font-chinese text-white pb-32 overflow-x-hidden">
            {/* Background with deep, rich gradient */}
            <div
                className="fixed inset-0 z-[-1]"
                style={{
                    background: `radial-gradient(circle at center, ${COLORS.mistletoeShadow} 0%, #050505 100%)`
                }}
            />

            <Snowfall />
            <MusicPlayer />

            {/* Header */}
            <header className="relative pt-24 pb-20 px-6 text-center z-10">
                <div className="inline-block relative">
                    <Sparkles className="absolute -top-12 -right-12 w-16 h-16 text-yellow-200 opacity-50 animate-pulse" />
                    <h1 className="font-christmas text-7xl md:text-9xl mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-tight tracking-tight" style={{ color: COLORS.candleGlow }}>
                        The Reading Forest
                    </h1>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/30"></div>
                        <p className="font-chinese text-xl md:text-3xl font-light tracking-[0.3em] uppercase opacity-80" style={{ color: COLORS.candle }}>
                            圣诞树共读活动
                        </p>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/30"></div>
                    </div>
                </div>
            </header>

            {/* Main Content: Trees Gallery */}
            <main className="container mx-auto px-4 relative z-10">
                {/* Constrain width on lg screens to force 2 items per row (1&2, 3&4), with 5th centered below */}
                <div className="flex flex-wrap justify-center gap-y-40 gap-x-16 lg:max-w-[900px] mx-auto">
                    {treeGroups.map((group) => {
                        const scheme = getTreeScheme(group.id);
                        return (
                            <div
                                key={group.id}
                                className="relative p-4 group"
                            >
                                {/* Subtle base glow */}
                                <div className="absolute inset-0 bg-white/[0.02] blur-3xl rounded-full scale-150 -z-10 group-hover:bg-white/[0.05] transition-colors duration-700"></div>

                                <ChristmasTree
                                    treeId={group.id}
                                    records={group.records}
                                    onBookClick={setSelectedBook}
                                    palette={scheme.palette}
                                    accentColor={scheme.accent}
                                />
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Footer Info */}
            <footer className="mt-48 text-center px-6 relative z-10">
                <div className="flex items-center justify-center gap-8 mb-10">
                    <div className="w-32 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                    <Gift className="w-10 h-10 animate-bounce" style={{ color: COLORS.poinsettaRed }} />
                    <div className="w-32 h-px bg-gradient-to-l from-transparent to-white/20"></div>
                </div>
                <p className="font-chinese text-lg opacity-70 max-w-3xl mx-auto leading-relaxed bold font-light">
                    与月言书·明亮的夜晚🌕<br />
                </p>
                <p className="font-chinese text-lg opacity-70 max-w-3xl mx-auto leading-relaxed bold font-light">
                    制作人：小胖雀儿<br />
                </p>
                <p className="mt-12 font-christmas text-lg tracking-[0.5em] opacity-40">
                    MERRY CHRISTMAS · 2025
                </p>
                <p className="font-chinese text-lg opacity-70 max-w-3xl mx-auto leading-relaxed bold font-light">
                    私人阅读群聊书评·请勿商用和转载。<br />
                </p>

            </footer>

            {/* Modal for Book Details */}
            <BookDetail
                record={selectedBook}
                onClose={() => setSelectedBook(null)}
            />

            {/* Large Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] blur-[180px] rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: COLORS.poinsettaRed }}></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] blur-[180px] rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: COLORS.leaf }}></div>
        </div>
    );
};

export default App;
