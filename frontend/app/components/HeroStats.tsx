'use client';

import React from 'react';

interface HeroStatsProps {
  totalBooks: number;
  totalCategories: number;
  totalAuthors: number;
}

export const HeroStats: React.FC<HeroStatsProps> = ({
  totalBooks,
  totalCategories,
  totalAuthors,
}) => {
  return (
    <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-emerald-500/15 relative overflow-hidden">
        {/* Subtle Ambient Background Decorative Blobs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Welcome Text */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-[11px] sm:text-xs font-semibold backdrop-blur-md border border-white/20">
              <svg className="w-3.5 h-3.5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Explore Knowledge Collection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              ค้นพบหนังสือที่คุณชื่นชอบ
            </h2>
            <p className="text-emerald-100 text-xs sm:text-base leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
              ระบบคลังหนังสือออนไลน์ เชื่อมต่อปกหนังสือจาก Open Library ดึงข้อมูลหมวดหมู่และผู้แต่งอย่างเป็นระเบียบ
            </p>
          </div>

          {/* Minimal Emerald Stat Cards */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-2.5 sm:gap-4">
            {/* Total Books */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-xl sm:text-3xl font-extrabold text-white">
                {totalBooks}
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-emerald-100 mt-0.5 sm:mt-1">
                หนังสือทั้งหมด
              </div>
            </div>

            {/* Total Categories */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-xl sm:text-3xl font-extrabold text-white">
                {totalCategories}
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-emerald-100 mt-0.5 sm:mt-1">
                หมวดหมู่
              </div>
            </div>

            {/* Total Authors */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-xl sm:text-3xl font-extrabold text-white">
                {totalAuthors}
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-emerald-100 mt-0.5 sm:mt-1">
                ผู้แต่ง
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
