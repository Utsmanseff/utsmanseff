// page.jsx is a client route and cannot export metadata; this layout carries it.
//
// The canonical points at `/`, not at itself. Below 1024px and without
// JavaScript both URLs render exactly the same paper document, and a crawler
// that sees two addresses for one body of text picks one of them on its own.
export const metadata = {
  alternates: { canonical: '/' },
};

export default function SistemLayout({ children }) {
  return children;
}
