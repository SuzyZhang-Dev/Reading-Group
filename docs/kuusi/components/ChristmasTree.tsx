
import React, { useMemo } from 'react';
import { ReadingRecord } from '../types';
import { COLORS } from '../constants';
import { Star } from 'lucide-react';

interface ChristmasTreeProps {
  treeId: string;
  records: ReadingRecord[];
  onBookClick: (record: ReadingRecord) => void;
  palette: string[];
  accentColor: string;
}

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ 
  treeId, 
  records, 
  onBookClick, 
  palette,
  accentColor
}) => {
  // Sort books by length to naturally form a tree shape when centered
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => a.bookTitle.length - b.bookTitle.length);
  }, [records]);

  // Clean up title to avoid double brackets
  const formatTitle = (title: string) => {
    let clean = title.trim();
    if (clean.startsWith('《') && clean.endsWith('》')) {
      return clean;
    }
    return `《${clean}》`;
  };

  return (
    <div className="relative w-[340px] min-h-[550px] flex flex-col items-center justify-end pb-12 group">
      {/* Star at the top */}
      <div className="mb-6 relative">
        <Star 
          className="w-12 h-12 fill-current animate-pulse relative z-10" 
          style={{ 
            color: accentColor,
            filter: `drop-shadow(0 0 15px ${accentColor})`
          }} 
        />
        <div className="absolute inset-0 w-12 h-12 bg-white/20 blur-xl rounded-full scale-150 animate-ping opacity-20"></div>
      </div>

      {/* The "Tree" made of Book Titles */}
      <div className="flex flex-col items-center gap-2 w-full">
        {sortedRecords.map((record, idx) => {
          const color = palette[idx % palette.length];
          
          return (
            <button
              key={`${treeId}-${idx}`}
              onClick={() => onBookClick(record)}
              className="relative px-2 py-1 transition-all duration-300 hover:scale-125 hover:z-20 font-chinese whitespace-nowrap group/book"
              style={{ 
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: COLORS.candle,
                // Flowing highlight effect: staggering the animation delay creates a "rolling" look
                animation: `colorFlow 4s ease-in-out infinite`,
                animationDelay: `${idx * 0.15}s`,
                // We define custom properties to use in the keyframes below
                // @ts-ignore
                '--flow-color': color
              } as React.CSSProperties}
              title={`${record.member}: ${record.bookTitle}`}
            >
              <span className="relative z-10">{formatTitle(record.bookTitle)}</span>
              
              {/* Subtle underline on hover */}
              <div 
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover/book:w-full"
                style={{ backgroundColor: color }}
              />
            </button>
          );
        })}
      </div>

      {/* Trunk */}
      <div 
        className="w-12 h-16 mt-4 rounded-b-lg shadow-2xl opacity-80" 
        style={{ 
          background: `linear-gradient(to bottom, ${COLORS.warmWood}, ${COLORS.darkTruffle})`,
          boxShadow: `0 10px 20px rgba(0,0,0,0.4)`
        }}
      />

      {/* Group Label */}
      <div className="absolute -bottom-6 w-full text-center">
         <h2 className="font-christmas text-4xl font-bold tracking-tight" style={{ color: accentColor }}>
           Tree {treeId.replace('号', '')}
         </h2>
         <p className="font-chinese text-[11px] mt-1 opacity-60 tracking-widest uppercase" style={{ color: COLORS.candle }}>
           {records.length} COLLECTED VOLUMES
         </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes colorFlow {
          0%, 100% { 
            opacity: 0.7; 
            text-shadow: 0 0 5px var(--flow-color);
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            text-shadow: 0 0 15px var(--flow-color), 0 0 20px var(--flow-color);
            transform: scale(1.1);
          }
        }
      `}} />
    </div>
  );
};

export default ChristmasTree;
