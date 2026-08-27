'use client';

import React, { useState } from 'react';
import { Book } from '../lib/api';
import { getOpenLibraryCoverUrl, generateFallbackCoverDataUrl } from '../lib/cover';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const [imgError, setImgError] = useState(false);

  if (!isOpen || !book) return null;

  const primaryCover = getOpenLibraryCoverUrl(book.isbn);
  const fallbackCover = generateFallbackCoverDataUrl(book.title);
  const coverSrc = imgError || !primaryCover ? fallbackCover : primaryCover;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-modal overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Cover Image Large */}
          <div className="md:col-span-5 aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 relative">
            {/* eslint-disable-next-html-element */}
            <img
              src={coverSrc}
              alt={book.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Metadata */}
          <div className="md:col-span-7 space-y-4">
            <div>
              {book.category && (
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
                  {book.category.name}
                </span>
              )}
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {book.title}
              </h2>
            </div>

            {/* Details List */}
            <div className="space-y-3 pt-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-900 min-w-24">
                  ✍️ ผู้แต่ง:
                </span>
                <span>
                  {book.authors && book.authors.length > 0
                    ? book.authors.map((a) => a.name).join(', ')
                    : 'ไม่ระบุ'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-900 min-w-24">
                  🔢 เลข ISBN:
                </span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                  {book.isbn}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-900 min-w-24">
                  📅 ปีที่พิมพ์:
                </span>
                <span>{book.published_year}</span>
              </div>
            </div>

            {/* Open Library Source Badge */}
            <div className="pt-4 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>📖</span> Open Library Cover API
                </div>
                <p className="text-[11px] leading-relaxed">
                  รูปปกดึงจาก Open Library อัตโนมัติด้วย ISBN หากรูปไม่แสดง ระบบจะเปลี่ยนเป็นปกแบบ Fallback ให้โดยอัตโนมัติ
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
