function PageShell({ children }) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">{children}</div>
    </main>
  );
}

export default PageShell;
