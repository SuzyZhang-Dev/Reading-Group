
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

      {/* The "Tree" made of Book Titles - Wrapped relative for SVG positioning */}
      <div className="relative flex flex-col items-center gap-2 w-full">
        <svg
          className="absolute inset-0 pointer-events-none z-0 overflow-visible"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient id={`lineGradient-${treeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {sortedRecords.map((record, i) => {
            // We stop before the last one because we draw segments TO the next one
            if (i >= sortedRecords.length - 1) return null;

            const currentRow = i;
            const nextRow = i + 1;

            // Constants for layout estimation
            const ROW_HEIGHT = 44; // approx height + gap
            const CHAR_WIDTH = 20; // approx 1.2rem
            const HALF_CONTAINER = 170;
            const Y_OFFSET = 20; // center of text vertically

            // Helper to get coordinates
            const getCoords = (idx: number, side: 'left' | 'right') => {
              const len = sortedRecords[idx].bookTitle.length;
              // Width of text block approx
              const halfTextWidth = (len * CHAR_WIDTH) / 2 + 16; // +16 for bracket/padding
              const y = idx * ROW_HEIGHT + Y_OFFSET;
              // 'left' means the bracket 《 position, 'right' means 》
              const x = side === 'left'
                ? HALF_CONTAINER - halfTextWidth
                : HALF_CONTAINER + halfTextWidth;
              return { x, y };
            };

            // Zigzag logic: Even rows start Left, Odd rows start Right? 
            // User said: "《 midpoint connect to next line's 》 midpoint"
            // This implies a cross: L -> R -> L -> R...
            // Let's assume we alternate Start Side based on index to keep a flow?
            // Actually, if we want a continuous line:
            // Path: P0 -> P1 -> P2 ...
            // P0: Row0 Left. P1: Row1 Right. P2: Row2 Left. P3: Row3 Right.
            // This creates the crossing pattern.

            // Let's determine Start and End for this SEGMENT (Row i -> Row i+1)
            const startSide = i % 2 === 0 ? 'left' : 'right';
            const endSide = i % 2 === 0 ? 'right' : 'left';

            const start = getCoords(currentRow, startSide);
            const end = getCoords(nextRow, endSide);

            // Control points for "curvy but flat"
            // If going L -> R, we want to swoop out a bit? or just a flat S?
            // A simple Bezier with horizontal handles works well for "wrapping".
            const cp1 = { x: start.x + (startSide === 'left' ? -20 : 20), y: start.y + 10 };
            const cp2 = { x: end.x + (endSide === 'left' ? -20 : 20), y: end.y - 10 };

            // Cubic Bezier function to find point at t
            const getBezierPoint = (t: number) => {
              const oneMinusT = 1 - t;
              const term0 = Math.pow(oneMinusT, 3);
              const term1 = 3 * Math.pow(oneMinusT, 2) * t;
              const term2 = 3 * oneMinusT * Math.pow(t, 2);
              const term3 = Math.pow(t, 3);

              return {
                x: term0 * start.x + term1 * cp1.x + term2 * cp2.x + term3 * end.x,
                y: term0 * start.y + term1 * cp1.y + term2 * cp2.y + term3 * end.y
              };
            };

            // Generate random dots along this segment
            // We'll generate 1-3 dots per segment at random positions
            const dots = [];
            const numDots = Math.floor(Math.random() * 2) + 1; // 1 or 2 dots per segment

            for (let d = 0; d < numDots; d++) {
              // Avoid strictly 0 or 1 to keep them "on the curve"
              const t = 0.2 + Math.random() * 0.6;
              const point = getBezierPoint(t);
              // Larger dots: 3px to 7px
              const size = 3 + Math.random() * 4;
              const opacity = 0.4 + Math.random() * 0.4;
              dots.push({ point, size, opacity });
            }

            return (
              <g key={`line-${i}`}>
                <path
                  d={`M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`}
                  fill="none"
                  stroke={`url(#lineGradient-${treeId})`}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {dots.map((dot, dIdx) => (
                  <circle
                    key={`dot-${dIdx}`}
                    cx={dot.point.x}
                    cy={dot.point.y}
                    r={dot.size}
                    fill="white"
                    fillOpacity={dot.opacity}
                    style={{ filter: 'blur(0.5px)' }}
                  />
                ))}
              </g>
            );
          })}
        </svg>

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



      <style dangerouslySetInnerHTML={{
        __html: `
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
