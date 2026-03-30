import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [handle, setHandle] = useState("");
  const [archetype, setArchetype] = useState("Builder");
  const [reputation, setReputation] = useState("growing");
  const [style, setStyle] = useState("raw");
  const [runId, setRunId] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({
    name: "Elon Musk",
    username: "@elonmusk",
    avatar: "",
    badge: "Legendary",
    archetype: "Visionary Builder",
    reputation: "High Signal Account",
    style: "Bold, future-driven",
    niche: "AI / Startups / Tech",
    summary: "Known for sharp opinions, product-first thinking, and high-impact posting.",
    followers: "218.4M",
    bestTweet: "12.4M views",
    creatorRank: "Top 1%",
  });
  const resultRef = useRef(null);
  const timeoutRef = useRef(null);
  const getSeed = () => (handle.trim() ? handle.trim().toLowerCase() : "elonmusk");

  const hashString = (value) => {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };

  const createRng = (seedValue) => {
    let t = seedValue >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  };

  const pickStable = (values, seed, salt) => {
    const hash = hashString(`${seed}:${salt}`);
    return values[hash % values.length];
  };

  const fetchProfile = async (seed) => {
    const response = await fetch(`/api/twittercv?handle=${encodeURIComponent(seed)}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  };

  const archetypes = [
    "Builder",
    "Thinker",
    "Visionary",
    "Shitposter",
    "Educator",
    "Operator",
    "Silent Builder",
    "Growth Hacker",
  ];

  const reputations = [
    "low signal",
    "growing",
    "underrated",
    "high signal",
    "attention magnet",
    "elite account",
  ];

  const styles = [
    "raw",
    "provocative",
    "minimal",
    "story-driven",
    "sharp",
    "chaotic",
    "clean",
  ];

  useEffect(() => {
    if (!isAnalyzing) return;
    let active = true;
    const intervals = [];
    const seed = getSeed();
    const rngArchetype = createRng(hashString(`${seed}:archetype`));
    const rngReputation = createRng(hashString(`${seed}:reputation`));
    const rngStyle = createRng(hashString(`${seed}:style`));

    const runSlot = (values, setValue, rng, speed = 120) => {
      const id = setInterval(() => {
        if (!active) return;
        const index = Math.floor(rng() * values.length);
        setValue(values[index]);
      }, speed);
      intervals.push(id);
    };

    runSlot(archetypes, setArchetype, rngArchetype, 90);
    runSlot(reputations, setReputation, rngReputation, 120);
    runSlot(styles, setStyle, rngStyle, 150);

    return () => {
      active = false;
      intervals.forEach(clearInterval);
    };
  }, [isAnalyzing, runId]);

  useEffect(() => {
    if (!showResult) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showResult]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-white antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        :root {
          font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .mono-label {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slowFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,198,0.22),rgba(0,0,0,0)_60%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(0,209,255,0.18),rgba(0,0,0,0)_60%)] blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center px-6 py-6 sm:px-10">
        <div className="text-lg font-semibold tracking-tight">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#00FFC6] motion-safe:animate-[pulseDot_2.4s_ease-in-out_infinite]" />
          Twitter <span className="text-[#00FFC6]">CV</span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100svh-80px)] items-center justify-center px-6 pb-16 sm:px-10">
        <div className="flex w-full max-w-4xl flex-col items-center gap-10 text-center">
          <div className="space-y-5 motion-safe:animate-[fadeUp_0.8s_ease-out]">
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-[#9CA3AF] sm:flex-row sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#00FFC6]/30 bg-[#00FFC6]/10 text-[#00FFC6]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l2.3 4.7L19 10l-4.7 2.3L12 17l-2.3-4.7L5 10l4.7-2.3L12 3z" />
                  </svg>
                </span>
                <span>Find your niche</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#00FFC6]/30 bg-[#00FFC6]/10 text-[#00FFC6]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                </span>
                <span>Discover viral tweets</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#00FFC6]/30 bg-[#00FFC6]/10 text-[#00FFC6]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l7 9-7 9-7-9 7-9z" />
                  </svg>
                </span>
                <span>Share your CV</span>
              </div>
            </div>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              This is your Twitter{" "}
              <span className="bg-gradient-to-br from-[#00FFC6] via-[#00FFC6] to-[#00D1FF] bg-clip-text text-transparent">
                CV
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-[#9CA3AF] sm:text-xl">
              Analyze your profile and generate a shareable resume.
            </p>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-3 motion-safe:animate-[fadeUp_0.9s_ease-out] sm:flex-row">
            <label className="sr-only" htmlFor="username">
              Twitter username
            </label>
            <div className="flex h-14 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#0B0B0B] px-4 text-white transition focus-within:border-[#00FFC6]/70 focus-within:ring-2 focus-within:ring-[#00FFC6]/20">
              <span className="text-[#00FFC6]">@</span>
              <input
                id="username"
                type="text"
                placeholder="elonmusk"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                className="w-full bg-transparent text-white placeholder:text-[#9CA3AF] outline-none"
              />
            </div>
            <button
              className="h-14 rounded-lg bg-[#00FFC6] px-6 font-semibold text-black transition-all duration-300 ease-out hover:brightness-95 hover:shadow-[0_0_28px_rgba(0,255,198,0.28)]"
              onClick={async () => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                setShowResult(false);
                setIsAnalyzing(true);
                setRunId((value) => value + 1);
                const seed = getSeed();
                const minDelay = new Promise((resolve) => {
                  timeoutRef.current = setTimeout(resolve, 2400);
                });
                const profilePromise = fetchProfile(seed).catch(() => null);
                const [profile] = await Promise.all([profilePromise, minDelay]);
                setArchetype(pickStable(archetypes, seed, "archetype"));
                setReputation(pickStable(reputations, seed, "reputation"));
                setStyle(pickStable(styles, seed, "style"));
                if (profile) {
                  setResultData((prev) => ({
                    ...prev,
                    name: profile.name || prev.name,
                    username: profile.username || prev.username,
                    avatar: profile.avatar || prev.avatar,
                    followers: profile.followers || prev.followers,
                    bestTweet: profile.bestTweet || prev.bestTweet,
                    creatorRank: profile.creatorRank || prev.creatorRank,
                    niche: profile.niche || prev.niche,
                    summary: profile.summary || prev.summary,
                  }));
                }
                setIsAnalyzing(false);
                setShowResult(true);
              }}
            >
              Analyze ->
            </button>
          </div>

          <div className="w-full max-w-xl motion-safe:animate-[fadeUp_1s_ease-out]">
            <div className="rounded-2xl border border-white/10 bg-[#0B0B0B] p-4 text-left shadow-[0_0_40px_rgba(0,0,0,0.45)]">
              <div className="mono-label mb-3 flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#00FFC6]/80 motion-safe:animate-[pulseDot_2.4s_ease-in-out_infinite]" />
                live analysis
              </div>
              <div className="mono-label space-y-2 text-sm">
                <p className="text-[#9CA3AF]">
                  &gt; decoding creator profile:{" "}
                  <span className="text-[#00FFC6]">
                    {handle ? `@${handle}` : "@elonmusk"}
                  </span>
                  ...
                </p>
                <p className="text-[#9CA3AF]">
                  &gt; archetype: <span className="text-white">{archetype}</span>{" "}
                  {isAnalyzing && <span className="blink text-[#00FFC6]">|</span>}
                </p>
                <p className="text-[#9CA3AF]">
                  &gt; reputation: <span className="text-white">{reputation}</span>{" "}
                  {isAnalyzing && <span className="blink text-[#00FFC6]">|</span>}
                </p>
                <p className="text-[#9CA3AF]">
                  &gt; style: <span className="text-white">{style}</span>{" "}
                  {isAnalyzing && <span className="blink text-[#00FFC6]">|</span>}
                </p>
                <p className="text-[#9CA3AF]">&gt; generating Twitter CV...</p>
              </div>
            </div>
          </div>

          {showResult && (
            <section
              ref={resultRef}
              className="mt-16 w-full max-w-5xl text-left motion-safe:animate-[fadeUp_0.8s_ease-out]"
            >
              <p className="mono-label text-xs uppercase tracking-[0.35em] text-[#9CA3AF]">
                TWITTER CV RESULT
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Your profile, decoded.
              </h2>

              <div className="relative mt-8">
                <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-[#00FFC6]/25 to-[#00D1FF]/20 blur-2xl" />
                <div className="relative rounded-[32px] border border-white/10 bg-[#111111] p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-[#00FFC6] to-[#00D1FF]">
                        {resultData.avatar && (
                          <img
                            src={resultData.avatar}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-2xl font-semibold">{resultData.name}</div>
                        <div className="text-sm text-[#9CA3AF]">{resultData.username}</div>
                      </div>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full border border-[#00FFC6]/40 bg-[#00FFC6]/10 px-4 py-1 text-xs font-semibold text-[#00FFC6]">
                      {resultData.badge}
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Archetype</div>
                      <div className="mt-2 font-semibold">{resultData.archetype}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Reputation</div>
                      <div className="mt-2 font-semibold">{resultData.reputation}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Style</div>
                      <div className="mt-2 font-semibold">{resultData.style}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Niche</div>
                      <div className="mt-2 font-semibold">{resultData.niche}</div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/5 bg-black/40 p-5 text-sm text-[#9CA3AF]">
                    {resultData.summary}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Followers</div>
                      <div className="mt-2 text-lg font-semibold">{resultData.followers}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Best Tweet</div>
                      <div className="mt-2 text-lg font-semibold">{resultData.bestTweet}</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
                      <div className="text-[#9CA3AF]">Creator Rank</div>
                      <div className="mt-2 text-lg font-semibold">{resultData.creatorRank}</div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button className="h-12 flex-1 rounded-lg border border-white/10 bg-[#0B0B0B] text-sm font-semibold text-white transition hover:border-[#00FFC6]/50 hover:text-[#00FFC6]">
                      Share on X
                    </button>
                    <button className="h-12 flex-1 rounded-lg bg-[#00FFC6] text-sm font-semibold text-black transition hover:brightness-95 hover:shadow-[0_0_24px_rgba(0,255,198,0.25)]">
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
