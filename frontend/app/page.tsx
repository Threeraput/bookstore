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
import { ConfirmModal } from './components/ConfirmModal';

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

  // Custom Confirm Modals state
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeletingBook, setIsDeletingBook] = useState(false);
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);

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
    setIsSessionExpiredOpen(true);
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

  // Handle Logout Confirmation
  const handleConfirmLogout = () => {
    removeStoredToken();
    setIsAdmin(false);
    setIsLogoutConfirmOpen(false);
  };

  // Handle Book Delete Confirmation
  const handleConfirmDeleteBook = async () => {
    if (!bookToDelete) return;
    setIsDeletingBook(true);
    try {
      await deleteBook(bookToDelete.id, handleUnauthorized);
      setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
      setBookToDelete(null);
    } catch (err: unknown) {
      console.error('Delete book error:', err);
    } finally {
      setIsDeletingBook(false);
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
        onLogout={() => setIsLogoutConfirmOpen(true)}
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
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>รายการหนังสือในคลัง</span>
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
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>เพิ่มหนังสือ</span>
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
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
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
              <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isAdmin={isAdmin}
                  onViewDetail={(b) => setSelectedBookDetail(b)}
                  onDelete={(id) => setBookToDelete(books.find((b) => b.id === id) || null)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Main Modals */}
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

      {/* Custom Confirmation Modals */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        title="ยืนยันการออกจากระบบ"
        message="คุณต้องการออกจากระบบ Admin ใช่หรือไม่?"
        confirmText="ออกจากระบบ"
        cancelText="ยกเลิก"
        variant="danger"
        icon="logout"
        onConfirm={handleConfirmLogout}
        onClose={() => setIsLogoutConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={bookToDelete !== null}
        title="ยืนยันการลบหนังสือ"
        message={`คุณต้องการลบหนังสือ "${bookToDelete?.title || ''}" ออกจากคลังใช่หรือไม่?`}
        confirmText="ลบหนังสือ"
        cancelText="ยกเลิก"
        variant="danger"
        isLoading={isDeletingBook}
        onConfirm={handleConfirmDeleteBook}
        onClose={() => setBookToDelete(null)}
      />

      <ConfirmModal
        isOpen={isSessionExpiredOpen}
        title="เซสชันผู้ใช้หมดอายุ"
        message="เซสชันการเข้าสู่ระบบของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
        confirmText="ตกลง"
        cancelText=""
        variant="warning"
        onConfirm={() => setIsSessionExpiredOpen(false)}
        onClose={() => setIsSessionExpiredOpen(false)}
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
