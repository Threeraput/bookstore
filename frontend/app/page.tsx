'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Book,
  Category,
  Author,
  fetchBooks,
  fetchCategories,
  fetchAuthors,
  deleteBook,
  getStoredToken,
  removeStoredToken,
} from './lib/api';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { Filters } from './components/Filters';
import { BookCard } from './components/BookCard';
import { LoginModal } from './components/LoginModal';
import { AddBookModal } from './components/AddBookModal';
import { BookDetailModal } from './components/BookDetailModal';

export default function Home() {
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);

  // Data state
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);

  // UI / Modal state
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  // Handle auto-unauthorized logout
  const handleUnauthorized = useCallback(() => {
    removeStoredToken();
    setIsAdmin(false);
    alert('เซสชันผู้ใช้หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง');
  }, []);

  // Load books, categories, authors
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [fetchedBooks, fetchedCategories, fetchedAuthors] = await Promise.all([
        fetchBooks(undefined, handleUnauthorized),
        fetchCategories(),
        fetchAuthors(),
      ]);
      setBooks(fetchedBooks);
      setCategories(fetchedCategories);
      setAuthors(fetchedAuthors);
    } catch (err: unknown) {
      console.error('Failed to load bookstore data:', err);
      if (err instanceof Error) {
        setErrorMsg(err.message || 'ไม่สามารถโหลดข้อมูลจาก Backend Server ได้');
      } else {
        setErrorMsg('ไม่สามารถเชื่อมต่อระบบ Backend ได้');
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Logout
  const handleLogout = () => {
    removeStoredToken();
    setIsAdmin(false);
  };

  // Handle Book Delete
  const handleDeleteBook = async (bookId: number) => {
    try {
      await deleteBook(bookId, handleUnauthorized);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`ลบหนังสือไม่สำเร็จ: ${err.message}`);
      }
    }
  };

  // Filtered books computing
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Category filter
      if (selectedCategoryId !== null && book.category?.id !== selectedCategoryId) {
        return false;
      }

      // Author filter
      if (
        selectedAuthorId !== null &&
        !book.authors?.some((author) => author.id === selectedAuthorId)
      ) {
        return false;
      }

      // Search Query filter (Title or ISBN)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesIsbn = book.isbn.toLowerCase().includes(query);
        const matchesAuthor = book.authors?.some((a) =>
          a.name.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesIsbn && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [books, selectedCategoryId, selectedAuthorId, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAddBook={() => setIsAddBookModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section & Stats */}
        <HeroStats
          totalBooks={books.length}
          totalCategories={categories.length}
          totalAuthors={authors.length}
        />

        {/* Master Filters Section */}
        <Filters
          categories={categories}
          authors={authors}
          selectedCategoryId={selectedCategoryId}
          selectedAuthorId={selectedAuthorId}
          onSelectCategory={setSelectedCategoryId}
          onSelectAuthor={setSelectedAuthorId}
          onResetFilters={() => {
            setSelectedCategoryId(null);
            setSelectedAuthorId(null);
            setSearchQuery('');
          }}
        />

        {/* Book Grid & Status Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>📚</span> รายการหนังสือในคลัง
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                พบทั้งหมด {filteredBooks.length} เล่ม
                {(selectedCategoryId !== null ||
                  selectedAuthorId !== null ||
                  searchQuery) &&
                  ' (คัดกรองอยู่)'}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddBookModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200/80 flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕</span> เพิ่มหนังสือ
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-medium text-slate-500">
                กำลังโหลดข้อมูลคลังหนังสือ...
              </p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto my-12">
              <div className="text-3xl">⚠️</div>
              <h3 className="font-bold text-rose-800 text-base">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </h3>
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !errorMsg && filteredBooks.length === 0 && (
            <div className="bg-white/60 border border-slate-200/80 rounded-3xl p-12 text-center space-y-3 max-w-md mx-auto my-12 shadow-xs">
              <div className="text-4xl">🔍</div>
              <h3 className="font-bold text-slate-800 text-base">
                ไม่พบรายการหนังสือที่คุณค้นหา
              </h3>
              <p className="text-xs text-slate-500">
                ลองปรับเปลี่ยนคำค้นหา หรือล้างเงื่อนไขตัวกรองเพื่อดูรายการทั้งหมด
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedAuthorId(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}

          {/* Book Cards Grid */}
          {!isLoading && !errorMsg && filteredBooks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isAdmin={isAdmin}
                  onViewDetail={(b) => setSelectedBookDetail(b)}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />

      <AddBookModal
        isOpen={isAddBookModalOpen}
        categories={categories}
        authors={authors}
        onClose={() => setIsAddBookModalOpen(false)}
        onSuccess={() => loadData()}
        onUnauthorized={handleUnauthorized}
      />

      <BookDetailModal
        book={selectedBookDetail}
        isOpen={selectedBookDetail !== null}
        onClose={() => setSelectedBookDetail(null)}
      />

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            Bookstore Application — White &amp; Emerald Green Design System
          </p>
          <p>
            Powered by Next.js 15+, NestJS, TypeORM, PostgreSQL &amp; Open Library ISBN Covers API
          </p>
        </div>
      </footer>
    </div>
  );
}
