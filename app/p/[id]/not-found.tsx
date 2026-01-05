export default function PasteNotFound() {
  return (
    <main className="max-w-2xl mx-auto mt-20 text-center p-6">
      <div className="p-8 bg-slate-50 border-2 border-dashed rounded-xl">
        <h2 className="text-2xl font-bold text-slate-800">Paste Unavailable</h2>
        <p className="text-slate-500 mt-2">
          This paste doesn't exist, has expired, or has reached its view limit.
        </p>
        <a 
          href="/" 
          className="mt-6 inline-block text-blue-600 hover:underline font-medium"
        >
          Create a new paste &rarr;
        </a>
      </div>
    </main>
  );
}