import { useState, useEffect, useRef } from "react";

type QuestType = "puzzle" | "task" | "comm";
type GameView = "home" | "game" | "result";
type TeamId = "fire" | "ice" | "forest" | "storm";

interface Quest {
  id: number;
  type: QuestType;
  title: string;
  description: string;
  points: number;
  timeLimit: number;
  emoji: string;
}

interface Team {
  id: TeamId;
  name: string;
  emoji: string;
  score: number;
  color: string;
  borderStyle: React.CSSProperties;
  glowStyle: React.CSSProperties;
}

const QUESTS: Quest[] = [
  { id: 1, type: "puzzle", title: "Магический лабиринт", description: "Найдите выход из зачарованного лабиринта, решив три магических загадки подряд", points: 150, timeLimit: 120, emoji: "🧩" },
  { id: 2, type: "task", title: "Зелье мудрости", description: "Смешайте правильные ингредиенты и назовите 5 волшебных трав из древнего гримуара", points: 100, timeLimit: 90, emoji: "⚗️" },
  { id: 3, type: "comm", title: "Телепатический мост", description: "Один игрок описывает магический предмет без слов, другие должны угадать за 3 попытки", points: 120, timeLimit: 60, emoji: "🔮" },
  { id: 4, type: "puzzle", title: "Рунический код", description: "Расшифруйте послание древних магов, записанное в рунах за ограниченное время", points: 200, timeLimit: 150, emoji: "🔣" },
  { id: 5, type: "task", title: "Охота за артефактом", description: "Следуйте по следам волшебного кристалла и найдите его в комнате за отведённое время", points: 130, timeLimit: 100, emoji: "💎" },
  { id: 6, type: "comm", title: "Хор заклинаний", description: "Вся команда произносит заклинание в унисон — засчитывается только при полной синхронности", points: 110, timeLimit: 45, emoji: "✨" },
  { id: 7, type: "puzzle", title: "Зеркало Истины", description: "Отгадайте что изображено на перевёрнутой магической картине за минимум подсказок", points: 180, timeLimit: 90, emoji: "🪞" },
  { id: 8, type: "task", title: "Башня Мага", description: "Постройте башню из карточек артефактов как можно выше — победит тот чья устоит дольше", points: 90, timeLimit: 120, emoji: "🏰" },
  { id: 9, type: "comm", title: "Волшебный телефон", description: "Передайте заклинание по цепочке из 5 игроков — итоговое слово должно совпасть", points: 140, timeLimit: 80, emoji: "📜" },
  { id: 10, type: "puzzle", title: "Карта Судьбы", description: "По описанию союзника найдите тайное место на магической карте комнаты", points: 160, timeLimit: 110, emoji: "🗺️" },
  { id: 11, type: "task", title: "Заклинание Света", description: "Воспроизведите последовательность из 7 световых сигналов без единой ошибки", points: 120, timeLimit: 75, emoji: "💡" },
  { id: 12, type: "comm", title: "Эхо Дракона", description: "Команды передают слово через пантомиму — нельзя произносить однокоренные слова", points: 150, timeLimit: 90, emoji: "🐉" },
];

const QUEST_TYPE_LABELS: Record<QuestType, string> = {
  puzzle: "Головоломка",
  task: "Задание",
  comm: "Коммуникация",
};

const QUEST_TYPE_COLORS: Record<QuestType, string> = {
  puzzle: "#a78bfa",
  task: "#34d399",
  comm: "#f472b6",
};

const INITIAL_TEAMS: Team[] = [
  {
    id: "fire", name: "Команда Огня", emoji: "🔥", score: 0,
    color: "#ff6b35",
    borderStyle: { borderColor: "rgba(255,107,53,0.55)", boxShadow: "0 0 28px rgba(255,107,53,0.18)" },
    glowStyle: { color: "#ff6b35", textShadow: "0 0 14px rgba(255,107,53,0.8)" },
  },
  {
    id: "ice", name: "Команда Льда", emoji: "❄️", score: 0,
    color: "#00d4ff",
    borderStyle: { borderColor: "rgba(0,212,255,0.55)", boxShadow: "0 0 28px rgba(0,212,255,0.18)" },
    glowStyle: { color: "#00d4ff", textShadow: "0 0 14px rgba(0,212,255,0.8)" },
  },
  {
    id: "forest", name: "Команда Леса", emoji: "🌿", score: 0,
    color: "#4ade80",
    borderStyle: { borderColor: "rgba(74,222,128,0.55)", boxShadow: "0 0 28px rgba(74,222,128,0.18)" },
    glowStyle: { color: "#4ade80", textShadow: "0 0 14px rgba(74,222,128,0.8)" },
  },
  {
    id: "storm", name: "Команда Грозы", emoji: "⚡", score: 0,
    color: "#facc15",
    borderStyle: { borderColor: "rgba(250,204,21,0.55)", boxShadow: "0 0 28px rgba(250,204,21,0.18)" },
    glowStyle: { color: "#facc15", textShadow: "0 0 14px rgba(250,204,21,0.8)" },
  },
];

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
  return (
    <div className="stars">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, "--delay": `${s.delay}s`, "--duration": `${s.duration}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Score popup ──────────────────────────────────────────────────────────────
function ScorePopup({ points, color }: { points: number; color: string }) {
  return (
    <div
      className="score-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 font-cinzel font-bold text-4xl pointer-events-none"
      style={{ color }}
    >
      +{points}
    </div>
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────
function Timer({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLeft(seconds);
    ref.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) { clearInterval(ref.current!); onEnd(); return 0; }
        return prev - 1;
      });
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

// ─── Team Score Card ──────────────────────────────────────────────────────────
function TeamCard({ team, active, compact = false }: { team: Team; active: boolean; compact?: boolean }) {
  return (
    <div
      className={`magic-card p-3 flex flex-col items-center gap-1 transition-all ${active ? "pulse-glow" : "opacity-60"}`}
      style={active ? { ...team.borderStyle, opacity: 1 } : team.borderStyle}
    >
      <span className={compact ? "text-2xl" : "text-3xl"}>{team.emoji}</span>
      <span className={`font-cinzel font-bold text-center leading-tight ${compact ? "text-xs" : "text-xs"}`} style={team.glowStyle}>
        {team.name}
      </span>
      <span className={`font-cinzel font-black ${compact ? "text-2xl" : "text-3xl"}`} style={{ color: team.color, textShadow: `0 0 12px ${team.color}` }}>
        {team.score}
      </span>
      {active && <span className="text-xs text-yellow-400 font-golos animate-fade-in">▶ ходит</span>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [view, setView] = useState<GameView>("home");
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS.map(t => ({ ...t })));
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [phase, setPhase] = useState<"pick" | "play" | "judge">("pick");
  const [timerKey, setTimerKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<QuestType | "all">("all");
  const [roundNum, setRoundNum] = useState(1);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const totalRounds = QUESTS.length;
  const activeTeam = teams[activeTeamIdx];

  function startGame() {
    setTeams(INITIAL_TEAMS.map(t => ({ ...t })));
    setActiveTeamIdx(0);
    setPhase("pick");
    setCompletedQuests(new Set());
    setRoundNum(1);
    setSelectedQuest(null);
    setView("game");
  }

  function selectQuest(quest: Quest) {
    setSelectedQuest(quest);
    setPhase("play");
    setTimerKey(k => k + 1);
  }

  function judgeResult(success: boolean) {
    if (success && selectedQuest) {
      const pts = selectedQuest.points;
      setTeams(prev => prev.map((t, i) => i === activeTeamIdx ? { ...t, score: t.score + pts } : t));
      setPopupPoints(pts);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1200);
    }
    if (selectedQuest) setCompletedQuests(prev => new Set([...prev, selectedQuest.id]));
    nextTurn();
  }

  function nextTurn() {
    const newRound = roundNum + 1;
    if (newRound > totalRounds) { setView("result"); return; }
    setRoundNum(newRound);
    setActiveTeamIdx(prev => (prev + 1) % teams.length);
    setSelectedQuest(null);
    setPhase("pick");
  }

  const filteredQuests = QUESTS.filter(q => {
    if (completedQuests.has(q.id)) return false;
    if (activeTab === "all") return true;
    return q.type === activeTab;
  });

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="magic-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <Stars />
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-2xl mx-auto py-12">
          <div className="relative float-anim">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-yellow-400/60 shadow-2xl pulse-glow">
              <img src="https://cdn.poehali.dev/projects/7553a83e-ceb5-4de5-99a9-d28f91bf1318/files/cb1e61a4-1779-49c3-ad72-0adc1586fd00.jpg" alt="Магическая игра" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-3 -right-3 text-3xl spin-slow inline-block">⭐</div>
          </div>

          <div>
            <h1 className="font-cinzel text-4xl md:text-6xl font-black shimmer-text mb-3 leading-tight">Магический Квест</h1>
            <p className="font-cormorant text-xl text-yellow-100/70 italic">Эпическое командное приключение на 4 команды</p>
          </div>

          <div className="magic-divider w-64" />

          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { emoji: "🧩", label: "Головоломки" },
              { emoji: "⚔️", label: "Задания" },
              { emoji: "💬", label: "Коммуникация" },
            ].map(f => (
              <div key={f.label} className="magic-card p-4 flex flex-col items-center gap-2">
                <span className="text-3xl">{f.emoji}</span>
                <span className="font-golos font-bold text-yellow-400 text-sm">{f.label}</span>
              </div>
            ))}
          </div>

          {/* 4 teams */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {INITIAL_TEAMS.map(t => (
              <div key={t.id} className="magic-card p-4 text-center" style={t.borderStyle}>
                <div className="text-3xl mb-1">{t.emoji}</div>
                <div className="font-cinzel font-bold text-sm" style={t.glowStyle}>{t.name}</div>
              </div>
            ))}
          </div>

          <button onClick={startGame} className="btn-gold text-xl px-12 py-4 rounded-2xl font-cinzel font-bold tracking-wider pulse-glow">
            ⚡ Начать Квест
          </button>

          <p className="text-white/30 text-sm font-golos">{QUESTS.length} испытаний • 4 команды • Эпическая битва</p>
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
            <h2 className="font-cinzel text-3xl md:text-5xl font-black shimmer-text mb-3">
              {winner ? `${winner.name} победила!` : "Ничья! Достойны все!"}
            </h2>
            <p className="font-cormorant text-lg text-yellow-100/60 italic">Квест завершён — легенда записана в анналах</p>
          </div>

          <div className="magic-divider w-48" />

          <div className="flex flex-col gap-3 w-full">
            {sorted.map((t, i) => (
              <div
                key={t.id}
                className={`magic-card p-4 flex items-center gap-4 ${i === 0 ? "pulse-glow" : ""}`}
                style={t.borderStyle}
              >
                <span className="text-3xl w-10 text-center">{medals[i]}</span>
                <span className="text-3xl">{t.emoji}</span>
                <div className="flex-1 text-left">
                  <div className="font-cinzel font-bold text-sm" style={t.glowStyle}>{t.name}</div>
                </div>
                <span className="font-cinzel text-3xl font-black" style={{ color: t.color, textShadow: `0 0 12px ${t.color}` }}>
                  {t.score}
                </span>
                <span className="text-xs text-white/30 font-golos w-10">очков</span>
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5">

        {/* Scoreboard — 4 команды */}
        <div className="grid grid-cols-4 gap-2 items-stretch">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} active={t.id === activeTeam.id} compact />
          ))}
        </div>

        {/* Round progress */}
        <div className="flex items-center gap-3">
          <span className="font-golos text-xs text-white/40 whitespace-nowrap">Раунд {roundNum} из {totalRounds}</span>
          <div className="magic-progress flex-1">
            <div className="magic-progress-fill" style={{ width: `${(roundNum / totalRounds) * 100}%` }} />
          </div>
          <span className="font-cinzel text-xs text-yellow-400/60">{activeTeam.emoji} {activeTeam.name}</span>
        </div>

        {/* PHASE: PICK */}
        {phase === "pick" && (
          <div className="fade-in-up flex flex-col gap-4">
            <div className="text-center">
              <p className="font-cormorant text-xl italic text-yellow-100/70">
                {activeTeam.emoji} {activeTeam.name} выбирает испытание
              </p>
              <div className="magic-divider" />
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {([["all", "Все ✦", ""], ["puzzle", "🧩 Головоломки", "#a78bfa"], ["task", "⚔️ Задания", "#34d399"], ["comm", "💬 Общение", "#f472b6"]] as [string, string, string][]).map(([type, label, color]) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type as QuestType | "all")}
                  className={`px-4 py-2 rounded-full font-golos text-sm font-medium border transition-all ${activeTab === type ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"}`}
                  style={activeTab === type && color ? { borderColor: color, color, background: `${color}15` } : {}}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuests.map(quest => (
                <button
                  key={quest.id}
                  onClick={() => selectQuest(quest)}
                  className={`magic-card p-5 text-left hover:scale-[1.02] transition-all quest-${quest.type} flex flex-col gap-2`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl">{quest.emoji}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-golos font-medium" style={{ background: `${QUEST_TYPE_COLORS[quest.type]}20`, color: QUEST_TYPE_COLORS[quest.type] }}>
                      {QUEST_TYPE_LABELS[quest.type]}
                    </span>
                  </div>
                  <h3 className="font-cinzel font-bold text-yellow-100 text-sm leading-tight">{quest.title}</h3>
                  <p className="font-golos text-xs text-white/50 line-clamp-2">{quest.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/10">
                    <span className="font-cinzel font-bold text-yellow-400 text-sm">⭐ {quest.points}</span>
                    <span className="font-golos text-xs text-white/40">⏱ {quest.timeLimit}с</span>
                  </div>
                </button>
              ))}
              {filteredQuests.length === 0 && (
                <div className="col-span-3 text-center py-12 text-white/30 font-golos">
                  <div className="text-4xl mb-3">🌙</div>
                  Все испытания этого типа пройдены
                </div>
              )}
            </div>

            <div className="text-center">
              <button onClick={nextTurn} className="text-white/30 hover:text-white/60 font-golos text-sm transition-colors underline underline-offset-2">
                Пропустить ход
              </button>
            </div>
          </div>
        )}

        {/* PHASE: PLAY */}
        {phase === "play" && selectedQuest && (
          <div className="fade-in-up flex flex-col gap-5">
            <div className={`magic-card quest-${selectedQuest.type} p-8 flex flex-col items-center gap-4 text-center`}>
              <span className="text-6xl float-anim">{selectedQuest.emoji}</span>
              <span className="text-xs px-3 py-1 rounded-full font-golos font-medium" style={{ background: `${QUEST_TYPE_COLORS[selectedQuest.type]}20`, color: QUEST_TYPE_COLORS[selectedQuest.type] }}>
                {QUEST_TYPE_LABELS[selectedQuest.type]}
              </span>
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
              <button onClick={() => setPhase("pick")} className="text-white/30 hover:text-white/60 font-golos text-sm transition-colors">
                ← Выбрать другое задание
              </button>
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
