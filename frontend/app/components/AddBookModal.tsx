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
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
            ➕
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
            <span>⚠️</span>
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

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              หมวดหมู่ (Category) *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Authors Multi-select Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              ผู้แต่ง (Authors) * (เลือกได้มากกว่า 1)
            </label>
            <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              {authors.map((author) => {
                const isChecked = selectedAuthorIds.includes(author.id);
                return (
                  <label
                    key={author.id}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-emerald-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAuthorToggle(author.id)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span>{author.name}</span>
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
