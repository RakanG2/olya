import React, { useMemo, useState, useRef } from "react";

/*
README - fast deploy to Netlify (3 steps)
1) Create a React app (CRA or Vite React).
2) Replace App.jsx/App.tsx with this file's content. Tailwind is optional; you can keep or remove classes.
3) Connect repo to Netlify and deploy. Public page is available at /public.

QR codes
- In Admin, click "Копировать QR-ссылку" to get URL like: https://your-domain/public#item-N
- Use these URLs to generate QR on printed coupons.

Music on public page
- Put a direct audio URL below into MUSIC_URL (mp3/stream).
- A "Включить музыку" button will appear and work on mobile after first tap.
*/

// Global music for public page
const MUSIC_URL = ""; // e.g. "https://example.com/song.mp3"
const MUSIC_TITLE = "For Olya";

// ===================== ADMIN PAGE =====================
function AdminPageOlya() {
  const initial = useMemo(
    () => [
      { id: 1, title: "Купон на исполнение желания", kind: "photo", url: "" },
      { id: 2, title: "Купон на идеальное свидание", kind: "music", url: "" },
      { id: 3, title: "Купон \"Отдыхай, солнышко\"", kind: "photo", url: "" },
      { id: 4, title: "Купон на блюдо от шеф-повара", kind: "music", url: "" },
      { id: 5, title: "Купон на завтрак в постель", kind: "music", url: "" },
      { id: 6, title: "Купон на выбор фильма", kind: "photo", url: "" },
      { id: 7, title: "Купон на массаж", kind: "music", url: "" },
      { id: 8, title: "Купон на фото-день", kind: "music", url: "" },
      { id: 9, title: "Купон на компы", kind: "photo", url: "" },
      { id: 10, title: "Купон на поездку", kind: "music", url: "" }
    ],
    []
  );

  const [items, setItems] = useState(initial);
  const [editingId, setEditingId] = useState(null as number | null);

  const baseBase =
    typeof window !== "undefined"
      ? \`\${window.location.origin}\${window.location.pathname}\`.replace(/#.*/, "")
      : "";
  // QR links should point to public page
  const baseLink = baseBase.replace(/\/public$/, "") + "/public";

  const setItem = (id: number, patch: Partial<(typeof items)[number]>) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)));
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Ссылка скопирована. Можешь вставлять её в генератор QR.");
    } catch {
      // Fallback prompt for older browsers
      // eslint-disable-next-line no-alert
      prompt("Скопируй ссылку вручную:", text);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-white to-pink-50 text-gray-800">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 pb-24">
        {/* Cover (visible also in admin so you see how it looks) */}
        <section className="mb-6">
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-rose-200/70 p-6 text-center shadow-sm">
            <div className="text-3xl font-semibold text-rose-700">Olya's Coupon Book</div>
            <div className="text-sm text-gray-600 mt-1">Сканируй купоны и открывай сюрпризы</div>
          </div>
        </section>

        <Intro />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {items.map(it => {
            const qrHash = `#item-\${it.id}`;
            const qrLink = `\${baseLink}\${qrHash}`;
            return (
              <section
                id={`item-\${it.id}`}
                key={it.id}
                className="relative rounded-2xl border border-rose-200/70 bg-white/70 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-rose-500 text-white grid place-items-center text-sm shadow">
                  {it.id}
                </div>

                <h3 className="text-lg font-semibold mb-1">{it.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Тип: {it.kind === "music" ? "Музыка/трек/плейлист" : "Фото/видео/альбом"}
                </p>

                {it.url ? <Preview kind={it.kind as any} url={it.url} /> : <Placeholder kind={it.kind as any} />}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setEditingId(v => (v === it.id ? null : it.id))}
                    className="px-3 py-2 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600"
                  >
                    {editingId === it.id ? "Сохранить" : "Редактировать"}
                  </button>
                  <a
                    href={it.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3 py-2 rounded-xl text-sm border ${
                      it.url
                        ? "border-rose-400 text-rose-700 hover:bg-rose-50"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Открыть
                  </a>
                  <button
                    onClick={() => copy(qrLink)}
                    className="px-3 py-2 rounded-xl bg-white text-rose-700 border border-rose-300 text-sm hover:bg-rose-50"
                  >
                    Копировать QR-ссылку
                  </button>
                  <span className="ml-auto text-xs text-gray-500 select-all hidden lg:inline">{qrLink}</span>
                </div>

                {editingId === it.id && (
                  <div className="mt-4 rounded-xl bg-rose-50 p-4 border border-rose-200">
                    <div className="grid grid-cols-1 gap-3">
                      <label className="text-sm">
                        Название
                        <input
                          value={it.title}
                          onChange={e => setItem(it.id, { title: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-rose-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </label>

                      <label className="text-sm">
                        Тип
                        <select
                          value={it.kind}
                          onChange={e => setItem(it.id, { kind: e.target.value as any })}
                          className="mt-1 w-full rounded-lg border border-rose-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        >
                          <option value="photo">Фото / Видео / Альбом</option>
                          <option value="music">Музыка / Плейлист</option>
                        </select>
                      </label>

                      <label className="text-sm">
                        Ссылка (вставь сюда URL)
                        <input
                          placeholder={
                            it.kind === "music"
                              ? "Например: https://music.yandex.ru/... или https://youtube.com/watch?v=..."
                              : "Например: ссылка на Google Photos / iCloud / Яндекс.Диск"
                          }
                          value={it.url}
                          onChange={e => setItem(it.id, { url: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-rose-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </label>

                      <div className="text-xs text-gray-600 leading-relaxed">
                        Подсказки:
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                          <li>Google Photos: включи доступ по ссылке, иначе может не открыться.</li>
                          <li>YouTube / Spotify / Apple Music: используй прямую ссылку на трек/плейлист.</li>
                          <li>Видео в Telegram/Drive: включи общий доступ по ссылке.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
      <HeartsBG />
    </div>
  );
}

function AdminHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-rose-700">Admin · Olya</h1>
        <p className="text-gray-600 mt-1">Редактируй ссылки и копируй QR-URL для купонов.</p>
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="relative z-10 mb-6">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-rose-200/70 p-5 shadow-sm">
          <h2 className="text-xl font-medium text-rose-700">Как это работает</h2>
          <ol className="list-decimal ml-6 mt-2 text-sm text-gray-700 space-y-1">
            <li>Нажми "Редактировать" на карточке и вставь ссылку на фото, видео или музыку.</li>
            <li>Нажми "Копировать QR-ссылку" — получишь URL вида <code className="bg-rose-100 px-1 rounded">/#item-N</code>.</li>
            <li>Создай QR из этой ссылки. При открытии страница прокрутится к карточке.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Preview({ kind, url }: { kind: "music" | "photo"; url: string }) {
  const isYouTube = /youtube\.com|youtu\.be/.test(url);
  const isSpotify = /open\.spotify\.com/.test(url);
  const isApple = /music\.apple\.com/.test(url);

  if (kind === "music") {
    if (isYouTube) {
      const id = extractYouTubeId(url);
      const embed = id ? \`https://www.youtube.com/embed/\${id}\` : "";
      return (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-rose-200">
          {embed ? (
            <iframe
              className="w-full h-full"
              src={embed}
              title={MUSIC_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <LinkBox url={url} label="Открыть трек/плейлист" />
          )}
        </div>
      );
    }
    if (isSpotify || isApple) return <LinkBox url={url} label="Открыть трек/плейлист" />;
    return <LinkBox url={url} label="Открыть музыку" />;
  }

  // photo/video generic
  return (
    <div className="rounded-xl border border-rose-200 bg-white p-4">
      <p className="text-sm text-gray-600">
        Ссылка: <a className="text-rose-700 underline" href={url} target="_blank" rel="noreferrer">открыть</a>
      </p>
      <p className="text-xs text-gray-500 mt-1">Подсказка: для Google Photos включи доступ по ссылке.</p>
    </div>
  );
}

function LinkBox({ url, label }: { url: string; label: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-white p-4">
      <a
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
      <p className="text-xs text-gray-600 mt-2">Если плеер не встраивается, ссылка откроется в новой вкладке.</p>
    </div>
  );
}

function Placeholder({ kind }: { kind: "music" | "photo" }) {
  return (
    <div className="rounded-xl border border-dashed border-rose-300 bg-rose-50 p-6 text-center text-sm text-gray-600">
      {kind === "music" ? (
        <p>Добавь ссылку на трек или плейлист. Поддерживаются YouTube, Spotify, Apple Music и др.</p>
      ) : (
        <p>Добавь ссылку на фото/видео/альбом. Включи общий доступ по ссылке, чтобы всё открывалось.</p>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-16">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-gray-500">
        Сделано с любовью для Olya · {new Date().getFullYear()}
      </div>
    </footer>
  );
}

// ===================== PUBLIC PAGE (read-only) =====================
function PublicPageOlya() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const hasMusic = Boolean(MUSIC_URL);
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const items = [
    { id: 1, title: "Купон на исполнение желания", kind: "photo", url: "" },
    { id: 2, title: "Купон на идеальное свидание", kind: "music", url: "" },
    { id: 3, title: "Купон \"Отдыхай, солнышко\"", kind: "photo", url: "" },
    { id: 4, title: "Купон на блюдо от шеф-повара", kind: "music", url: "" },
    { id: 5, title: "Купон на завтрак в постель", kind: "music", url: "" },
    { id: 6, title: "Купон на выбор фильма", kind: "photo", url: "" },
    { id: 7, title: "Купон на массаж", kind: "music", url: "" },
    { id: 8, title: "Купон на фото-день", kind: "music", url: "" },
    { id: 9, title: "Купон на компы", kind: "photo", url: "" },
    { id: 10, title: "Купон на поездку", kind: "music", url: "" }
  ];

  const baseHash = typeof window !== "undefined" ? window.location.hash : "";
  React.useEffect(() => {
    if (!baseHash) return;
    const el = document.querySelector(baseHash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-white to-pink-50 text-gray-800">
      <header className="relative z-10">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-4 flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-rose-700">Olya ❤</h1>
            <p className="text-gray-600 mt-1">Сканируй купоны и наслаждайся сюрпризами.</p>
          </div>
          {hasMusic && (
            <div className="pt-1">
              <button
                onClick={toggleMusic}
                className={`px-3 py-2 rounded-xl text-sm shadow border ${
                  playing ? "bg-rose-600 text-white border-rose-700" : "bg-white text-rose-700 border-rose-300 hover:bg-rose-50"
                }`}
              >
                {playing ? "Пауза" : "Включить музыку"}
              </button>
            </div>
          )}
        </div>
        {hasMusic && <audio ref={audioRef as any} src={MUSIC_URL} preload="none" />}
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24">
        {/* Cover for Olya */}
        <section className="mb-6">
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-rose-200/70 p-6 text-center shadow-sm">
            <div className="text-3xl font-semibold text-rose-700">Olya's Coupon Book</div>
            <div className="text-sm text-gray-600 mt-1">Сканируй купоны и открывай сюрпризы</div>
          </div>
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {items.map(it => (
            <section
              id={`item-${it.id}`}
              key={it.id}
              className="relative rounded-2xl border border-rose-200/70 bg-white/70 backdrop-blur p-5 shadow-sm"
            >
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-rose-500 text-white grid place-items-center text-sm shadow">
                {it.id}
              </div>
              <h3 className="text-lg font-semibold mb-1">{it.title}</h3>
              {/* Public page: show only Open button when URL exists */}
              {it.url ? (
                <a
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600"
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть
                </a>
              ) : null}
            </section>
          ))}
        </div>
      </main>

      <Footer />
      <HeartsBG />
    </div>
  );
}

// ===================== APP ROUTER =====================
export default function App() {
  const isPublic =
    typeof window !== "undefined" && (/\/public$/.test(window.location.pathname) || window.location.hash.includes("public"));
  return isPublic ? <PublicPageOlya /> : <AdminPageOlya />;
}

function HeartsBG() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-20 left-10 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-rose-100/50 blur-3xl" />
    </div>
  );
}

// ===================== HELPERS =====================
export function extractYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

// ===================== DEV TESTS =====================
// These run in dev only to ensure helper correctness
if (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production") {
  console.assert(extractYouTubeId("https://youtu.be/abcdEFG1234") === "abcdEFG1234", "YouTube short URL failed");
  console.assert(
    extractYouTubeId("https://www.youtube.com/watch?v=QwErTy12Zz8") === "QwErTy12Zz8".replace("T", "T"),
    "YouTube watch URL failed"
  );
  console.assert(extractYouTubeId("https://example.com/") === null, "Non-YouTube should be null");
}
