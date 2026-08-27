'use client';

import React, { useState } from 'react';
import { Book } from '../lib/api';
import { getOpenLibraryCoverUrl, generateFallbackCoverDataUrl } from '../lib/cover';

interface BookCardProps {
  book: Book;
  isAdmin: boolean;
  onViewDetail: (book: Book) => void;
  onDelete: (id: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isAdmin,
  onViewDetail,
  onDelete,
}) => {
  const primaryCover = getOpenLibraryCoverUrl(book.isbn);
  const fallbackCover = generateFallbackCoverDataUrl(book.title);

  // State to track if primary cover failed loading
  const [imgSrc, setImgSrc] = useState<string>(primaryCover || fallbackCover);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== fallbackCover) {
      setImgSrc(fallbackCover);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(book.id);
  };

  return (
    <div
      onClick={() => onViewDetail(book)}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full relative"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-html-element */}
        <img
          src={imgSrc}
          alt={book.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Category Badge */}
        {book.category && (
          <div className="absolute top-3 left-3 bg-emerald-100/90 backdrop-blur-md text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
            {book.category.name}
          </div>
        )}

        {/* Floating Year Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
          {book.published_year}
        </div>
      </div>

      {/* Book Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
            {book.title}
          </h3>

          {/* Authors */}
          <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
            {book.authors && book.authors.length > 0
              ? book.authors.map((a) => a.name).join(', ')
              : 'ไม่ระบุผู้แต่ง'}
          </p>
        </div>

        {/* ISBN Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-md w-fit">
          <span>ISBN:</span>
          <span className="font-semibold text-slate-600">{book.isbn}</span>
        </div>

        {/* Card Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(book);
            }}
            className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>ดูรายละเอียด</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="py-2 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:border-rose-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="ลบหนังสือ"
            >
              {isDeleting ? (
                <span className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>ลบ</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
