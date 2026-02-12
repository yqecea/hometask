import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-svh max-w-md flex-col bg-slate-950 shadow-2xl">
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
