/**
 * Cover Image Helper Utility
 * Manages Open Library ISBN Cover fetching and fallback cover SVG generation.
 */

export function cleanIsbn(isbn: string): string {
  if (!isbn) return '';
  return isbn.replace(/[^0-9X]/gi, '');
}

export function getOpenLibraryCoverUrl(isbn: string): string | null {
  const cleaned = cleanIsbn(isbn);
  if (!cleaned) return null;
  return `https://covers.openlibrary.org/b/isbn/${cleaned}-L.jpg`;
}

/**
 * Generates an SVG Data URI placeholder for books without a valid cover image.
 * Uses White & Emerald Green palette with book icon and title text.
 */
export function generateFallbackCoverDataUrl(title: string): string {
  const safeTitle = (title || 'Bookstore').trim();
  // Truncate long titles for aesthetic SVG rendering
  const displayTitle = safeTitle.length > 28 ? safeTitle.slice(0, 25) + '...' : safeTitle;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#047857"/>
        <stop offset="50%" stop-color="#10B981"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
      <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25"/>
      </filter>
    </defs>

    <!-- Cover Background -->
    <rect width="400" height="600" fill="url(#bgGrad)"/>
    <rect width="400" height="600" fill="url(#overlay)"/>

    <!-- Subtle Spine Line -->
    <rect x="0" y="0" width="24" height="600" fill="rgba(0,0,0,0.15)"/>
    <line x1="24" y1="0" x2="24" y2="600" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>

    <!-- Inner Decorative Border -->
    <rect x="40" y="30" width="320" height="540" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="8"/>

    <!-- Center Icon Circle -->
    <circle cx="200" cy="220" r="55" fill="#ffffff" filter="url(#shadow)"/>
    
    <!-- Book Icon 📖 in Emerald -->
    <g transform="translate(168, 188) scale(1.6)">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <!-- Book Title Text -->
    <foreignObject x="50" y="310" width="300" height="180">
      <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; color:#ffffff; font-family:'Outfit', system-ui, sans-serif; padding:10px;">
        <span style="font-size:22px; font-weight:700; line-height:1.3; text-shadow:0 2px 4px rgba(0,0,0,0.3); word-break:break-word;">
          ${escapeXml(displayTitle)}
        </span>
        <span style="margin-top:14px; font-size:12px; letter-spacing:2px; font-weight:600; text-transform:uppercase; color:#dcfce7; background:rgba(0,0,0,0.2); padding:4px 12px; border-radius:12px;">
          BOOKSTORE
        </span>
      </div>
    </foreignObject>

    <!-- Bottom Decorative Bar -->
    <rect x="140" y="520" width="120" height="4" fill="#dcfce7" rx="2" opacity="0.8"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
