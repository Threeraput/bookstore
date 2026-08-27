'use client';

import React from 'react';
import { Category, Author } from '../lib/api';

interface FiltersProps {
  categories: Category[];
  authors: Author[];
  selectedCategoryId: number | null;
  selectedAuthorId: number | null;
  onSelectCategory: (id: number | null) => void;
  onSelectAuthor: (id: number | null) => void;
  onResetFilters: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  categories,
  authors,
  selectedCategoryId,
  selectedAuthorId,
  onSelectCategory,
  onSelectAuthor,
  onResetFilters,
}) => {
  const hasActiveFilters = selectedCategoryId !== null || selectedAuthorId !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Category Pills */}
        <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a1 1 0 01.707.293l7 7a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A1 1 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>หมวดหมู่หนังสือ</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategoryId === null
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              ทั้งหมด
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Author Selector Dropdown & Reset */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="w-full md:w-56">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>กรองตามผู้แต่ง</span>
            </label>
            <div className="relative">
              <select
                value={selectedAuthorId ?? ''}
                onChange={(e) =>
                  onSelectAuthor(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/90 px-3.5 py-2.5 pr-8 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-white text-slate-700 font-medium">ผู้แต่งทั้งหมด</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id} className="bg-white text-slate-800 font-medium">
                    {author.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="self-end px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-all cursor-pointer shrink-0"
              title="ล้างตัวกรองทั้งหมด"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
