import { useState, useEffect, useRef } from "react";
import type { GameView, Team, Zone, CategoryTopic } from "@/types/game";
import { DEFAULT_TEAMS, DEFAULT_ZONES, TOPIC_META } from "@/data/gameData";
import SettingsPage from "@/components/SettingsPage";

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1, delay: Math.random() * 4, duration: Math.random() * 3 + 2,
  }));
  return (
    <div className="stars">
      {stars.map(s => (
        <div key={s.id} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, "--delay": `${s.delay}s`, "--duration": `${s.duration}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function ScorePopup({ points, color }: { points: number; color: string }) {
  return (
    <div className="score-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 font-cinzel font-bold text-4xl pointer-events-none" style={{ color }}>
      +{points}
    </div>
  );
}

function Timer({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setLeft(seconds);
    ref.current = setInterval(() => {
      setLeft(prev => { if (prev <= 1) { clearInterval(ref.current!); onEnd(); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(ref.current!);
  }, [seconds]);
  const pct = (left / seconds) * 100;
  const color = left > seconds * 0.5 ? "#34d399" : left > seconds * 0.25 ? "#f5c842" : "#f87171";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-5xl font-cinzel font-bold" style={{ color, textShadow: `0 0 20px ${color}` }}>{left}</div>
      <div className="magic-progress w-48">
        <div className="magic-progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, #b8860b, ${color})` }} />
      </div>
      <div className="text-xs text-white/40 font-golos">секунд осталось</div>
    </div>
  );
}

function TeamCard({ team, active }: { team: Team; active: boolean }) {
  return (
    <div className={`magic-card p-3 flex flex-col items-center gap-1 transition-all ${active ? "pulse-glow" : "opacity-60"}`} style={active ? { ...team.borderStyle, opacity: 1 } : team.borderStyle}>
      <span className="text-2xl">{team.emoji}</span>
      <span className="font-cinzel font-bold text-center leading-tight text-xs" style={team.glowStyle}>{team.name}</span>
      <span className="font-cinzel font-black text-2xl" style={{ color: team.color, textShadow: `0 0 12px ${team.color}` }}>{team.score}</span>
      {active && <span className="text-xs text-yellow-400 font-golos animate-fade-in">▶ ходит</span>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [view, setView] = useState<GameView>("home");
  const [teamTemplates, setTeamTemplates] = useState<Team[]>(DEFAULT_TEAMS.map(t => ({ ...t })));
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES.map(z => ({ ...z, quests: [...z.quests] })));
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS.map(t => ({ ...t })));
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [phase, setPhase] = useState<"zone" | "topic" | "play" | "judge">("zone");
  const [timerKey, setTimerKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [roundNum, setRoundNum] = useState(1);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<CategoryTopic | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<{ id: number; topic: CategoryTopic; title: string; description: string; points: number; timeLimit: number; emoji: string } | null>(null);

  const totalRounds = zones.length * 2;
  const activeTeam = teams[activeTeamIdx];

  function startGame() {
    setTeams(teamTemplates.map(t => ({ ...t, score: 0 })));
    setActiveTeamIdx(0); setPhase("zone"); setCompletedIds(new Set());
    setRoundNum(1); setSelectedZone(null); setSelectedTopic(null); setSelectedQuest(null);
    setView("game");
  }

  function pickZone(zone: Zone) { setSelectedZone(zone); setPhase("topic"); }

  function pickTopic(topic: CategoryTopic) { setSelectedTopic(topic); }

  function pickQuest(quest: typeof selectedQuest) {
    setSelectedQuest(quest); setPhase("play"); setTimerKey(k => k + 1);
  }

  function judgeResult(success: boolean) {
    if (success && selectedQuest) {
      const pts = selectedQuest.points;
      setTeams(prev => prev.map((t, i) => i === activeTeamIdx ? { ...t, score: t.score + pts } : t));
      setPopupPoints(pts); setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1200);
    }
    if (selectedQuest) setCompletedIds(prev => new Set([...prev, selectedQuest.id]));
    nextTurn();
  }

  function nextTurn() {
    const newRound = roundNum + 1;
    if (newRound > totalRounds) { setView("result"); return; }
    setRoundNum(newRound);
    setActiveTeamIdx(prev => (prev + 1) % teams.length);
    setSelectedZone(null); setSelectedTopic(null); setSelectedQuest(null); setPhase("zone");
  }

  const questsForTopic = selectedZone && selectedTopic
    ? selectedZone.quests.filter(q => !completedIds.has(q.id) && q.topic === selectedTopic)
    : [];

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  if (view === "settings") {
    return (
      <SettingsPage
        teams={teamTemplates}
        zones={zones}
        onTeamsChange={setTeamTemplates}
        onZonesChange={setZones}
        onBack={() => setView("home")}
      />
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="magic-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <Stars />
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-2xl mx-auto py-12">
          <div className="relative float-anim">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-yellow-400/60 shadow-2xl pulse-glow">
              <img src="https://cdn.poehali.dev/projects/7553a83e-ceb5-4de5-99a9-d28f91bf1318/files/cb1e61a4-1779-49c3-ad72-0adc1586fd00.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-3 -right-3 text-3xl spin-slow inline-block">⭐</div>
          </div>
          <div>
            <h1 className="font-cinzel text-4xl md:text-6xl font-black shimmer-text mb-3 leading-tight">Магический Квест</h1>
            <p className="font-cormorant text-xl text-yellow-100/70 italic">12 земель · 7 тем · 4 команды</p>
          </div>
          <div className="magic-divider w-64" />
          <div className="grid grid-cols-4 gap-2 w-full">
            {Object.values(TOPIC_META).map(t => (
              <div key={t.label} className="magic-card p-3 flex flex-col items-center gap-1">
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-golos text-xs text-center leading-tight" style={{ color: t.color }}>{t.label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {teamTemplates.map(t => (
              <div key={t.id} className="magic-card p-3 text-center" style={t.borderStyle}>
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="font-cinzel font-bold text-xs" style={t.glowStyle}>{t.name}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={startGame} className="btn-gold flex-1 text-xl py-4 rounded-2xl font-cinzel font-bold tracking-wider pulse-glow">⚡ Начать Квест</button>
            <button onClick={() => setView("settings")} className="btn-magic px-5 py-4 rounded-2xl font-cinzel font-bold text-yellow-100/70 hover:text-yellow-100 transition-colors">⚙️</button>
          </div>
          <p className="text-white/30 text-sm font-golos">{zones.length} локаций · {zones.reduce((a, z) => a + z.quests.length, 0)} заданий</p>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (view === "result") {
    const sorted = [...teams].sort((a, b) => b.score - a.score);
    const winner = sorted[0].score > sorted[1].score ? sorted[0] : null;
    const medals = ["🥇", "🥈", "🥉", "4️⃣"];
    return (
      <div className="magic-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <Stars />
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-2xl mx-auto py-12">
          <div className="text-8xl float-anim">{winner ? winner.emoji : "🤝"}</div>
          <div>
            <h2 className="font-cinzel text-3xl md:text-5xl font-black shimmer-text mb-3">{winner ? `${winner.name} победила!` : "Ничья!"}</h2>
            <p className="font-cormorant text-lg text-yellow-100/60 italic">Квест завершён — легенда вписана в анналы</p>
          </div>
          <div className="magic-divider w-48" />
          <div className="flex flex-col gap-3 w-full">
            {sorted.map((t, i) => (
              <div key={t.id} className={`magic-card p-4 flex items-center gap-4 ${i === 0 ? "pulse-glow" : ""}`} style={t.borderStyle}>
                <span className="text-3xl w-10 text-center">{medals[i]}</span>
                <span className="text-3xl">{t.emoji}</span>
                <div className="flex-1 text-left font-cinzel font-bold text-sm" style={t.glowStyle}>{t.name}</div>
                <span className="font-cinzel text-3xl font-black" style={{ color: t.color, textShadow: `0 0 12px ${t.color}` }}>{t.score}</span>
                <span className="text-xs text-white/30 font-golos">очков</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={startGame} className="btn-gold px-8 py-3 rounded-xl font-golos font-bold">🔄 Играть снова</button>
            <button onClick={() => setView("home")} className="btn-magic px-8 py-3 rounded-xl font-golos font-bold text-yellow-100">🏠 На главную</button>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME ──────────────────────────────────────────────────────────────────
  return (
    <div className="magic-bg min-h-screen relative overflow-hidden">
      <Stars />
      {showPopup && <ScorePopup points={popupPoints} color={activeTeam.color} />}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">

        {/* Scoreboard */}
        <div className="grid grid-cols-4 gap-2">
          {teams.map(t => <TeamCard key={t.id} team={t} active={t.id === activeTeam.id} />)}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="font-golos text-xs text-white/40 whitespace-nowrap">Раунд {roundNum}/{totalRounds}</span>
          <div className="magic-progress flex-1"><div className="magic-progress-fill" style={{ width: `${(roundNum / totalRounds) * 100}%` }} /></div>
          <span className="font-cinzel text-xs text-yellow-400/60">{activeTeam.emoji} {activeTeam.name}</span>
        </div>

        {/* PHASE: ZONE */}
        {phase === "zone" && (
          <div className="fade-in-up flex flex-col gap-4">
            <div className="text-center">
              <p className="font-cormorant text-xl italic text-yellow-100/70">{activeTeam.emoji} {activeTeam.name} выбирает локацию</p>
              <div className="magic-divider" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {zones.map(zone => {
                const done = zone.quests.filter(q => completedIds.has(q.id)).length;
                const total = zone.quests.length;
                const allDone = total === 0 || done === total;
                return (
                  <button key={zone.id} onClick={() => !allDone && pickZone(zone)} disabled={allDone}
                    className={`magic-card p-4 text-center flex flex-col items-center gap-2 transition-all ${allDone ? "opacity-30 cursor-not-allowed" : "hover:scale-[1.03]"}`}
                    style={{ borderColor: `${zone.color}55`, boxShadow: `0 0 20px ${zone.color}15` }}>
                    <span className="text-3xl">{zone.emoji}</span>
                    <span className="font-cinzel font-bold text-sm" style={{ color: zone.color }}>{zone.name}</span>
                    <div className="magic-progress w-full">
                      <div className="magic-progress-fill" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%`, background: zone.color }} />
                    </div>
                    <span className="text-xs text-white/30 font-golos">{done}/{total} пройдено</span>
                  </button>
                );
              })}
            </div>
            <div className="text-center">
              <button onClick={nextTurn} className="text-white/30 hover:text-white/60 font-golos text-sm transition-colors underline underline-offset-2">Пропустить ход</button>
            </div>
          </div>
        )}

        {/* PHASE: TOPIC */}
        {phase === "topic" && selectedZone && (
          <div className="fade-in-up flex flex-col gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-3xl">{selectedZone.emoji}</span>
                <h2 className="font-cinzel text-2xl font-bold" style={{ color: selectedZone.color }}>{selectedZone.name}</h2>
              </div>
              <p className="font-cormorant text-lg italic text-yellow-100/60">{activeTeam.emoji} {activeTeam.name} выбирает тему</p>
              <div className="magic-divider" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(Object.keys(TOPIC_META) as CategoryTopic[]).map(topic => {
                const meta = TOPIC_META[topic];
                const available = selectedZone.quests.filter(q => !completedIds.has(q.id) && q.topic === topic);
                const isDone = available.length === 0;
                const isActive = selectedTopic === topic;
                return (
                  <button key={topic} onClick={() => !isDone && pickTopic(topic)} disabled={isDone}
                    className={`magic-card p-4 text-center flex flex-col items-center gap-2 transition-all ${isDone ? "opacity-30 cursor-not-allowed" : isActive ? "scale-105" : "hover:scale-[1.03]"}`}
                    style={isActive ? { borderColor: meta.color, boxShadow: `0 0 20px ${meta.color}40` } : {}}>
                    <span className="text-3xl">{meta.emoji}</span>
                    <span className="font-golos font-bold text-sm leading-tight" style={{ color: meta.color }}>{meta.label}</span>
                    <span className="text-xs text-white/30 font-golos">{available.length} заданий</span>
                  </button>
                );
              })}
            </div>

            {selectedTopic && questsForTopic.length > 0 && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="magic-divider" />
                <p className="font-cormorant text-lg italic text-center text-yellow-100/60">Выберите задание:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {questsForTopic.map(quest => (
                    <button key={quest.id} onClick={() => pickQuest(quest)}
                      className="magic-card p-4 text-left hover:scale-[1.02] transition-all flex flex-col gap-2"
                      style={{ borderTopColor: TOPIC_META[quest.topic].color, borderTopWidth: 3 }}>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-2xl">{quest.emoji}</span>
                        <span className="font-cinzel font-bold text-yellow-400 text-sm">⭐ {quest.points}</span>
                      </div>
                      <h3 className="font-cinzel font-bold text-yellow-100 text-sm">{quest.title}</h3>
                      <p className="font-golos text-xs text-white/50 line-clamp-2">{quest.description}</p>
                      <span className="font-golos text-xs text-white/30">⏱ {quest.timeLimit}с</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSelectedZone(null); setSelectedTopic(null); setPhase("zone"); }} className="text-white/30 hover:text-white/60 font-golos text-sm transition-colors">← Другая локация</button>
              <span className="text-white/20">·</span>
              <button onClick={nextTurn} className="text-white/30 hover:text-white/60 font-golos text-sm transition-colors underline underline-offset-2">Пропустить ход</button>
            </div>
          </div>
        )}

        {/* PHASE: PLAY */}
        {phase === "play" && selectedQuest && selectedZone && (
          <div className="fade-in-up flex flex-col gap-5">
            <div className="magic-card p-8 flex flex-col items-center gap-4 text-center" style={{ borderTopColor: TOPIC_META[selectedQuest.topic].color, borderTopWidth: 3 }}>
              <div className="flex items-center gap-2 text-sm">
                <span>{selectedZone.emoji}</span>
                <span style={{ color: selectedZone.color }} className="font-cinzel font-bold">{selectedZone.name}</span>
                <span className="text-white/30">·</span>
                <span>{TOPIC_META[selectedQuest.topic].emoji}</span>
                <span style={{ color: TOPIC_META[selectedQuest.topic].color }} className="font-golos font-medium">{TOPIC_META[selectedQuest.topic].label}</span>
              </div>
              <span className="text-5xl float-anim">{selectedQuest.emoji}</span>
              <h2 className="font-cinzel text-2xl font-bold text-yellow-100">{selectedQuest.title}</h2>
              <div className="magic-divider w-48" />
              <p className="font-cormorant text-lg text-white/80 leading-relaxed max-w-lg">{selectedQuest.description}</p>
              <div className="font-cinzel font-bold text-yellow-400 text-2xl mt-2">⭐ {selectedQuest.points} очков</div>
            </div>
            <div className="magic-card p-6 flex flex-col items-center gap-4">
              <h3 className="font-cinzel text-sm text-yellow-400/60 uppercase tracking-widest">Таймер</h3>
              <Timer key={timerKey} seconds={selectedQuest.timeLimit} onEnd={() => setPhase("judge")} />
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => judgeResult(true)} className="btn-gold px-8 py-4 rounded-xl font-cinzel font-bold text-lg">✅ Выполнено!</button>
              <button onClick={() => judgeResult(false)} className="btn-magic px-8 py-4 rounded-xl font-cinzel font-bold text-lg text-yellow-100">❌ Не вышло</button>
            </div>
            <div className="text-center">
              <button onClick={() => { setSelectedQuest(null); setPhase("topic"); }} className="text-white/30 hover:text-white/60 font-golos text-sm transition-colors">← Выбрать другое задание</button>
            </div>
          </div>
        )}

        {/* PHASE: JUDGE */}
        {phase === "judge" && selectedQuest && (
          <div className="fade-in-up flex flex-col gap-6 items-center text-center py-8">
            <div className="text-7xl float-anim">⏰</div>
            <h2 className="font-cinzel text-3xl font-bold shimmer-text">Время вышло!</h2>
            <p className="font-cormorant text-xl text-yellow-100/60 italic">Оцените выполнение задания</p>
            <div className="flex gap-4">
              <button onClick={() => judgeResult(true)} className="btn-gold px-8 py-4 rounded-xl font-cinzel font-bold text-lg">✅ Засчитать!</button>
              <button onClick={() => judgeResult(false)} className="btn-magic px-8 py-4 rounded-xl font-cinzel font-bold text-lg text-yellow-100">❌ Не засчитать</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
