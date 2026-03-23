import "./globals.css";

export const metadata = {
  title: "LZ Tech - Innovacion Digital",
  description: "Tecnologia, accesorios y gadgets al mejor precio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-900 min-h-screen">{children}</body>
    </html>
  );
}
