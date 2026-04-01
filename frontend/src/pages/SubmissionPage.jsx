function SubmissionPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">Submission Form</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access granted. Only logged-in directors can open this page.
        </p>
      </section>
    </main>
  );
}

export default SubmissionPage;
