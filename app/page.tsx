import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f5f1] text-[#201f1c]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e86e54] text-lg font-black text-white">
            S
          </span>
          <span className="text-lg">SceneSet</span>
        </Link>
        <Link
          href="/app"
          className="rounded-full border border-[#d9d4cb] bg-white px-4 py-2 text-sm font-medium transition hover:border-[#201f1c]"
        >
          Open workspace
        </Link>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:pt-24">
        <div>
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[#e86e54]">
            The calm control room for good events
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
            Make the next move <em className="font-serif font-normal">obvious.</em>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#68645d]">
            Keep suppliers, spend, tasks, guests and the run of show in one clear workspace — so your event can feel as good behind the scenes as it does in the room.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="rounded-full bg-[#201f1c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3c3933]"
            >
              Open the demo workspace →
            </Link>
            <a
              href="#workflow"
              className="rounded-full border border-[#d9d4cb] bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#201f1c]"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#ded9d0] bg-white p-4 shadow-[0_24px_70px_rgba(32,31,28,0.1)]">
          <div className="rounded-[1.4rem] bg-[#242321] p-5 text-white">
            <div className="mb-8 flex items-center justify-between text-xs text-white/55">
              <span>sceneset / afterglow</span>
              <span className="rounded-full bg-[#a6d8c4]/15 px-2 py-1 text-[#a6d8c4]">LIVE PLAN</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Sunday · 18 October 2026</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Midnight Garden Gala</h2>
                <p className="mt-1 text-sm text-white/55">The Conservatory · Manchester</p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-full border-[5px] border-[#a6d8c4] text-center">
                <span><strong className="block text-xl leading-none">82</strong><small className="text-[9px] uppercase text-white/50">ready</small></span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              {[
                ["COMMITTED SPEND", "£15,710"],
                ["GUEST RSVPs", "5/7"],
                ["TASKS SHIPPED", "2/8"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/40">{label}</p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-[#ded9d0] bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e86e54]">One workspace · less tab switching</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">The plan is the event.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Shape the day", "Set the date, venue and goals, then turn the shape of the event into a plan your team can read."],
              ["02", "See what moves", "Compare quotes, watch the contingency and understand what is committed before it becomes a surprise."],
              ["03", "Hand off with confidence", "Lock the run of show, share the day-of link and give everyone the same version of the room."],
            ].map(([number, title, body]) => (
              <article key={number} className="rounded-3xl border border-[#ded9d0] bg-[#f7f5f1] p-6">
                <span className="text-sm font-semibold text-[#e86e54]">{number}</span>
                <h3 className="mt-12 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#68645d]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
