
import React from 'react';
import { X, BookOpen, User, Star } from 'lucide-react';
import { ReadingRecord } from '../types';
import { COLORS } from '../constants';

interface BookDetailProps {
  record: ReadingRecord | null;
  onClose: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ backgroundColor: COLORS.candle }}
      >
        {/* Header decoration */}
        <div className="h-2 w-full flex shrink-0">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: i % 2 === 0 ? COLORS.poinsettaRed : COLORS.leaf }}></div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black/5 z-10"
          style={{ color: COLORS.darkTruffle }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-6 pr-8">
            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: COLORS.poinsettaRed, color: COLORS.candle }}>
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-chinese leading-tight" style={{ color: COLORS.darkChocolate }}>
              {record.bookTitle}
            </h3>
          </div>

          <div className="space-y-4 font-chinese">
            <div className="flex items-center gap-2" style={{ color: COLORS.warmWood }}>
              <User className="w-4 h-4" />
              <span className="font-semibold text-lg">{record.member}</span>
            </div>

            <div className="p-4 rounded-xl border-l-4 italic" style={{ backgroundColor: COLORS.rusticWood + '15', borderColor: COLORS.poinsettaRed, color: COLORS.darkTruffle }}>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current text-yellow-500" />)}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">
                {record.review}
              </p>
            </div>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="p-4 text-center border-t border-black/5 shrink-0">
          <p className="text-sm font-christmas tracking-widest uppercase" style={{ color: COLORS.leaf }}>
            Merry Christmas & Happy Reading
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
