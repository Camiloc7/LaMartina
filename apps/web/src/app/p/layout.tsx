import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Barra superior sencilla para la marca */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">La Martina</h1>
      </header>
      
      <main className="flex-1 flex flex-col max-w-md w-full mx-auto p-4 sm:p-6 bg-white shadow-xl min-h-screen">
        {children}
      </main>
    </div>
  );
}
