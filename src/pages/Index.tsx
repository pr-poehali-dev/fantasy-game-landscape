import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type QuestType = "puzzle" | "task" | "comm";
type GameView = "home" | "game" | "result";

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
  id: "fire" | "ice";
  name: string;
  emoji: string;
  score: number;
  color: string;
  glowClass: string;
  borderClass: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const QUESTS: Quest[] = [
  { id: 1, type: "puzzle", title: "Магический лабиринт", description: "Найдите выход из зачарованного лабиринта, решив три магических загадки подряд", points: 150, timeLimit: 120, emoji: "🧩" },
  { id: 2, type: "task", title: "Зелье мудрости", description: "Смешайте правильные ингредиенты и назовите 5 волшебных трав из древнего гримуара", points: 100, timeLimit: 90, emoji: "⚗️" },
  { id: 3, type: "comm", title: "Телепатический мост", description: "Один игрок описывает магический предмет без слов, другие должны угадать за 3 попытки", points: 120, timeLimit: 60, emoji: "🔮" },
  { id: 4, type: "puzzle", title: "Рунический код", description: "Расшифруйте послание древних магов, записанное в рунах за ограниченное время", points: 200, timeLimit: 150, emoji: "🔣" },
  { id: 5, type: "task", title: "Охота за артефактом", description: "Следуйте по следам волшебного кристалла и найдите его в комнате за отведённое время", points: 130, timeLimit: 100, emoji: "💎" },
  { id: 6, type: "comm", title: "Хор заклинаний", description: "Вся команда должна произнести заклинание в унисон — попытка засчитывается если все синхронны", points: 110, timeLimit: 45, emoji: "✨" },
  { id: 7, type: "puzzle", title: "Зеркало Истины", description: "Отгадайте что изображено на перевёрнутой магической картине за минимум подсказок", points: 180, timeLimit: 90, emoji: "🪞" },
  { id: 8, type: "task", title: "Башня Мага", description: "Постройте башню из карточек артефактов как можно выше — победит тот чья устоит дольше", points: 90, timeLimit: 120, emoji: "🏰" },
  { id: 9, type: "comm", title: "Волшебный телефон", description: "Передайте сложное заклинание по цепочке из 5 игроков — итоговое слово должно совпасть", points: 140, timeLimit: 80, emoji: "📜" },
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
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--delay": `${s.delay}s`,
            "--duration": `${s.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Score popup ──────────────────────────────────────────────────────────────
function ScorePopup({ points, team }: { points: number; team: "fire" | "ice" }) {
  return (
    <div
      className="score-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 font-cinzel font-bold text-4xl pointer-events-none"
      style={{ color: team === "fire" ? "#ff6b35" : "#00d4ff" }}
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
        if (prev <= 1) {
          clearInterval(ref.current!);
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current!);
  }, [seconds]);

  const pct = (left / seconds) * 100;
  const color = left > seconds * 0.5 ? "#34d399" : left > seconds * 0.25 ? "#f5c842" : "#f87171";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-5xl font-cinzel font-bold"
        style={{ color, textShadow: `0 0 20px ${color}` }}
      >
        {left}
      </div>
      <div className="magic-progress w-48">
        <div
          className="magic-progress-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #b8860b, ${color})` }}
        />
      </div>
      <div className="text-xs text-muted-foreground font-golos">секунд осталось</div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [view, setView] = useState<GameView>("home");
  const [teams, setTeams] = useState<Team[]>([
    { id: "fire", name: "Команда Огня", emoji: "🔥", score: 0, color: "#ff6b35", glowClass: "team-fire-glow", borderClass: "team-fire" },
    { id: "ice", name: "Команда Льда", emoji: "❄️", score: 0, color: "#00d4ff", glowClass: "team-ice-glow", borderClass: "team-ice" },
  ]);
  const [activeTeam, setActiveTeam] = useState<"fire" | "ice">("fire");
  const [phase, setPhase] = useState<"pick" | "play" | "judge">("pick");
  const [timerKey, setTimerKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<QuestType | "all">("all");
  const [roundNum, setRoundNum] = useState(1);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const totalRounds = QUESTS.length;
  const currentTeam = teams.find((t) => t.id === activeTeam)!;

  function startGame() {
    setTeams([
      { id: "fire", name: "Команда Огня", emoji: "🔥", score: 0, color: "#ff6b35", glowClass: "team-fire-glow", borderClass: "team-fire" },
      { id: "ice", name: "Команда Льда", emoji: "❄️", score: 0, color: "#00d4ff", glowClass: "team-ice-glow", borderClass: "team-ice" },
    ]);
    setActiveTeam("fire");
    setPhase("pick");
    setCompletedQuests(new Set());
    setRoundNum(1);
    setSelectedQuest(null);
    setView("game");
  }

  function selectQuest(quest: Quest) {
    setSelectedQuest(quest);
    setPhase("play");
    setTimerKey((k) => k + 1);
  }

  function judgeResult(success: boolean) {
    if (success && selectedQuest) {
      const pts = selectedQuest.points;
      setTeams((prev) =>
        prev.map((t) => (t.id === activeTeam ? { ...t, score: t.score + pts } : t))
      );
      setPopupPoints(pts);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1200);
    }
    if (selectedQuest) {
      setCompletedQuests((prev) => new Set([...prev, selectedQuest.id]));
    }
    nextTurn();
  }

  function nextTurn() {
    const newRound = roundNum + 1;
    if (newRound > totalRounds) {
      setView("result");
      return;
    }
    setRoundNum(newRound);
    setActiveTeam((prev) => (prev === "fire" ? "ice" : "fire"));
    setSelectedQuest(null);
    setPhase("pick");
  }

  const filteredQuests = QUESTS.filter((q) => {
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
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-400/60 shadow-2xl pulse-glow">
              <img
                src="https://cdn.poehali.dev/projects/7553a83e-ceb5-4de5-99a9-d28f91bf1318/files/cb1e61a4-1779-49c3-ad72-0adc1586fd00.jpg"
                alt="Магическая игра"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-3 -right-3 text-3xl spin-slow inline-block">⭐</div>
            <div className="absolute -bottom-2 -left-2 text-2xl">✨</div>
          </div>

          <div>
            <h1 className="font-cinzel text-4xl md:text-6xl font-black shimmer-text mb-3 leading-tight">
              Магический Квест
            </h1>
            <p className="font-cormorant text-xl text-yellow-100/70 italic">
              Эпическое командное приключение
            </p>
          </div>

          <div className="magic-divider w-64" />

          <div className="grid grid-cols-3 gap-4 w-full">
            {[
              { emoji: "🧩", label: "Головоломки", desc: "Испытай разум" },
              { emoji: "⚔️", label: "Задания", desc: "Докажи силу" },
              { emoji: "💬", label: "Коммуникация", desc: "Объединись" },
            ].map((f) => (
              <div key={f.label} className="magic-card p-4 flex flex-col items-center gap-2">
                <span className="text-3xl">{f.emoji}</span>
                <span className="font-golos font-bold text-yellow-400 text-sm">{f.label}</span>
                <span className="font-golos text-xs text-white/40">{f.desc}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="magic-card team-fire p-4 text-center">
              <div className="text-4xl mb-1">🔥</div>
              <div className="font-cinzel font-bold team-fire-glow text-sm">Команда Огня</div>
            </div>
            <div className="magic-card team-ice p-4 text-center">
              <div className="text-4xl mb-1">❄️</div>
              <div className="font-cinzel font-bold team-ice-glow text-sm">Команда Льда</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="btn-gold text-xl px-12 py-4 rounded-2xl font-cinzel font-bold tracking-wider pulse-glow"
          >
            ⚡ Начать Квест
          </button>

          <p className="text-white/30 text-sm font-golos">
            {QUESTS.length} испытаний • 2 команды • Эпическая битва
          </p>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (view === "result") {
    const winner = teams[0].score > teams[1].score ? teams[0] : teams[1].score > teams[0].score ? teams[1] : null;
    return (
      <div className="magic-bg min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <Stars />
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-2xl mx-auto py-12">
          <div className="text-8xl float-anim">{winner ? winner.emoji : "🤝"}</div>
          <div>
            <h2 className="font-cinzel text-3xl md:text-5xl font-black shimmer-text mb-3">
              {winner ? `${winner.name} победила!` : "Ничья! Оба герои!"}
            </h2>
            <p className="font-cormorant text-lg text-yellow-100/60 italic">
              Квест завершён — легенда записана в анналы истории
            </p>
          </div>

          <div className="magic-divider w-48" />

          <div className="grid grid-cols-2 gap-6 w-full">
            {teams.map((t) => (
              <div
                key={t.id}
                className={`magic-card p-6 flex flex-col items-center gap-3 ${t.borderClass} ${winner?.id === t.id ? "pulse-glow" : ""}`}
              >
                <span className="text-5xl">{t.emoji}</span>
                <span className={`font-cinzel font-bold ${t.glowClass}`}>{t.name}</span>
                <span
                  className="font-cinzel text-5xl font-black"
                  style={{ color: t.color, textShadow: `0 0 20px ${t.color}` }}
                >
                  {t.score}
                </span>
                <span className="text-xs text-white/40 font-golos">очков</span>
                {winner?.id === t.id && (
                  <div className="font-golos text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
                    👑 Победитель
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={startGame} className="btn-gold px-8 py-3 rounded-xl font-golos font-bold">
              🔄 Играть снова
            </button>
            <button onClick={() => setView("home")} className="btn-magic px-8 py-3 rounded-xl font-golos font-bold text-yellow-100">
              🏠 На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME ──────────────────────────────────────────────────────────────────
  return (
    <div className="magic-bg min-h-screen relative overflow-hidden">
      <Stars />
      {showPopup && <ScorePopup points={popupPoints} team={activeTeam} />}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-4 items-center">
          {[teams[0], null, teams[1]].map((t, idx) => {
            if (!t) {
              return (
                <div key="round" className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-full border-2 border-yellow-400/30 flex items-center justify-center bg-purple-900/30">
                    <span className="font-cinzel font-bold text-yellow-400 text-lg">{roundNum}</span>
                  </div>
                  <span className="text-xs text-white/30 font-golos">из {totalRounds}</span>
                  <div className="magic-progress w-24 mt-1">
                    <div className="magic-progress-fill" style={{ width: `${(roundNum / totalRounds) * 100}%` }} />
                  </div>
                </div>
              );
            }
            return (
              <div
                key={t.id}
                className={`magic-card ${t.borderClass} p-4 flex flex-col items-center gap-1 ${activeTeam === t.id ? "pulse-glow" : "opacity-70"}`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <span className={`font-cinzel text-xs ${t.glowClass} font-bold`}>{t.name}</span>
                <span
                  className="font-cinzel text-4xl font-black"
                  style={{ color: t.color, textShadow: `0 0 15px ${t.color}` }}
                >
                  {t.score}
                </span>
                {activeTeam === t.id && (
                  <span className="text-xs text-yellow-400 font-golos animate-fade-in">▶ ходит</span>
                )}
              </div>
            );
          })}
        </div>

        {/* PHASE: PICK */}
        {phase === "pick" && (
          <div className="fade-in-up flex flex-col gap-4">
            <div className="text-center">
              <p className="font-cormorant text-xl italic text-yellow-100/70">
                {currentTeam.emoji} {currentTeam.name} выбирает испытание
              </p>
              <div className="magic-divider" />
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {([ ["all", "Все ✦", ""], ["puzzle", "🧩 Головоломки", "#a78bfa"], ["task", "⚔️ Задания", "#34d399"], ["comm", "💬 Общение", "#f472b6"] ] as [string, string, string][]).map(([type, label, color]) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type as QuestType | "all")}
                  className={`px-4 py-2 rounded-full font-golos text-sm font-medium border transition-all ${
                    activeTab === type
                      ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                      : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}
                  style={activeTab === type && color ? { borderColor: color, color, background: `${color}15` } : {}}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuests.map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => selectQuest(quest)}
                  className={`magic-card p-5 text-left hover:scale-[1.02] transition-all quest-${quest.type} flex flex-col gap-2`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl">{quest.emoji}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-golos font-medium"
                      style={{ background: `${QUEST_TYPE_COLORS[quest.type]}20`, color: QUEST_TYPE_COLORS[quest.type] }}
                    >
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
          <div className="fade-in-up flex flex-col gap-6">
            <div className={`magic-card quest-${selectedQuest.type} p-8 flex flex-col items-center gap-4 text-center`}>
              <span className="text-6xl float-anim">{selectedQuest.emoji}</span>
              <span
                className="text-xs px-3 py-1 rounded-full font-golos font-medium"
                style={{ background: `${QUEST_TYPE_COLORS[selectedQuest.type]}20`, color: QUEST_TYPE_COLORS[selectedQuest.type] }}
              >
                {QUEST_TYPE_LABELS[selectedQuest.type]}
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-yellow-100">{selectedQuest.title}</h2>
              <div className="magic-divider w-48" />
              <p className="font-cormorant text-lg text-white/80 leading-relaxed max-w-lg">
                {selectedQuest.description}
              </p>
              <div className="font-cinzel font-bold text-yellow-400 text-2xl mt-2">⭐ {selectedQuest.points} очков</div>
            </div>

            <div className="magic-card p-6 flex flex-col items-center gap-4">
              <h3 className="font-cinzel text-sm text-yellow-400/60 uppercase tracking-widest">Таймер</h3>
              <Timer key={timerKey} seconds={selectedQuest.timeLimit} onEnd={() => setPhase("judge")} />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => judgeResult(true)}
                className="btn-gold px-8 py-4 rounded-xl font-cinzel font-bold text-lg"
              >
                ✅ Выполнено!
              </button>
              <button
                onClick={() => judgeResult(false)}
                className="btn-magic px-8 py-4 rounded-xl font-cinzel font-bold text-lg text-yellow-100"
              >
                ❌ Не вышло
              </button>
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
            <p className="font-cormorant text-xl text-yellow-100/60 italic">
              Оцените выполнение задания
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => judgeResult(true)}
                className="btn-gold px-8 py-4 rounded-xl font-cinzel font-bold text-lg"
              >
                ✅ Засчитать!
              </button>
              <button
                onClick={() => judgeResult(false)}
                className="btn-magic px-8 py-4 rounded-xl font-cinzel font-bold text-lg text-yellow-100"
              >
                ❌ Не засчитать
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
