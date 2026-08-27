'use client';

import React, { useState } from 'react';
import { Category, Author, createBook } from '../lib/api';

interface AddBookModalProps {
  isOpen: boolean;
  categories: Category[];
  authors: Author[];
  onClose: () => void;
  onSuccess: () => void;
  onUnauthorized: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  categories,
  authors,
  onClose,
  onSuccess,
  onUnauthorized,
}) => {
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState<number>(new Date().getFullYear());
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  if (!isOpen) return null;

  const handleAuthorToggle = (authorId: number) => {
    setSelectedAuthorIds((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!categoryId) {
      setErrorMsg('กรุณาเลือกหมวดหมู่หนังสือ');
      return;
    }

    if (selectedAuthorIds.length === 0) {
      setErrorMsg('กรุณาเลือกผู้แต่งอย่างน้อย 1 คน');
      return;
    }

    setIsLoading(true);

    try {
      await createBook(
        {
          title,
          isbn,
          published_year: Number(publishedYear),
          category_id: Number(categoryId),
          author_ids: selectedAuthorIds,
        },
        onUnauthorized
      );

      // Reset form
      setTitle('');
      setIsbn('');
      setPublishedYear(new Date().getFullYear());
      setCategoryId('');
      setSelectedAuthorIds([]);

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเพิ่มหนังสือ');
      } else {
        setErrorMsg('เกิดข้อผิดพลาดในการเพิ่มหนังสือ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-modal my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              เพิ่มหนังสือใหม่
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              กรอกข้อมูลเพื่อบันทึกหนังสือเข้าสู่คลัง
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              ชื่อหนังสือ (Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ตัวอย่าง: Clean Code, Design Patterns..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          {/* ISBN & Year Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                เลข ISBN *
              </label>
              <input
                type="text"
                required
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-0201633610"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ปีที่พิมพ์ (Year) *
              </label>
              <input
                type="number"
                required
                min={1000}
                max={9999}
                value={publishedYear}
                onChange={(e) => setPublishedYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
          </div>

          {/* Custom Rounded Category Select */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              หมวดหมู่ (Category) *
            </label>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`w-full px-4 py-3 bg-emerald-50/40 hover:bg-emerald-50/70 focus:bg-white text-slate-800 text-sm font-semibold rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer shadow-xs ${
                isCategoryOpen ? 'border-emerald-600 ring-4 ring-emerald-500/20 bg-white' : 'border-emerald-500/80'
              }`}
            >
              <span className={categoryId ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}>
                {categoryId
                  ? categories.find((c) => c.id === categoryId)?.name || 'เลือกหมวดหมู่'
                  : '-- เลือกหมวดหมู่หนังสือ --'}
              </span>
              <svg
                className={`w-5 h-5 text-emerald-600 transition-transform duration-200 ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Floating Custom Options Menu */}
            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsCategoryOpen(false)}
                ></div>

                <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-white border-2 border-emerald-500 rounded-2xl p-1.5 shadow-2xl space-y-1 max-h-56 overflow-y-auto animate-fade-in">
                  {categories.map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setCategoryId(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs font-bold'
                            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && (
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Authors Multi-select Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              ผู้แต่ง (Authors) * (เลือกได้มากกว่า 1)
            </label>
            <div className="max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              {authors.map((author) => {
                const isChecked = selectedAuthorIds.includes(author.id);
                return (
                  <label
                    key={author.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-2xs'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAuthorToggle(author.id)}
                        className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{author.name}</span>
                    </div>
                    {isChecked && (
                      <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">
                        เลือกแล้ว
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'บันทึกหนังสือ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
