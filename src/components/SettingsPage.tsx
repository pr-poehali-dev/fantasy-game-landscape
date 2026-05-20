import { useState } from "react";
import type { Zone, Team, CategoryTopic } from "@/types/game";
import { TOPIC_META } from "@/data/gameData";

interface SettingsPageProps {
  teams: Team[];
  zones: Zone[];
  onTeamsChange: (teams: Team[]) => void;
  onZonesChange: (zones: Zone[]) => void;
  onBack: () => void;
}

type SettingsTab = "teams" | "quests" | "zones";

let nextQuestId = 9000;

function getNextId() {
  return ++nextQuestId;
}

export default function SettingsPage({ teams, zones, onTeamsChange, onZonesChange, onBack }: SettingsPageProps) {
  const [tab, setTab] = useState<SettingsTab>("teams");
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id ?? "");
  const [editingQuestId, setEditingQuestId] = useState<number | null>(null);
  const [newQuest, setNewQuest] = useState<{
    title: string; description: string; topic: CategoryTopic; points: number; timeLimit: number; emoji: string;
  }>({ title: "", description: "", topic: "special", points: 100, timeLimit: 60, emoji: "⭐" });
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedZone = zones.find(z => z.id === selectedZoneId) ?? zones[0];

  function updateTeamName(idx: number, name: string) {
    const next = teams.map((t, i) => i === idx ? { ...t, name } : t);
    onTeamsChange(next);
  }

  function updateZoneQuest(zoneId: string, questId: number, field: string, value: string | number) {
    const next = zones.map(z => z.id !== zoneId ? z : {
      ...z, quests: z.quests.map(q => q.id !== questId ? q : { ...q, [field]: value })
    });
    onZonesChange(next);
  }

  function deleteQuest(zoneId: string, questId: number) {
    const next = zones.map(z => z.id !== zoneId ? z : { ...z, quests: z.quests.filter(q => q.id !== questId) });
    onZonesChange(next);
  }

  function addQuest() {
    if (!newQuest.title.trim()) return;
    const quest = { ...newQuest, id: getNextId() };
    const next = zones.map(z => z.id !== selectedZoneId ? z : { ...z, quests: [...z.quests, quest] });
    onZonesChange(next);
    setNewQuest({ title: "", description: "", topic: "special", points: 100, timeLimit: 60, emoji: "⭐" });
    setShowAddForm(false);
  }

  const tabs: { id: SettingsTab; label: string; emoji: string }[] = [
    { id: "teams", label: "Команды", emoji: "🏆" },
    { id: "quests", label: "Задания", emoji: "📝" },
  ];

  return (
    <div className="magic-bg min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-magic px-4 py-2 rounded-xl font-golos text-sm text-yellow-100">← Назад</button>
          <h1 className="font-cinzel text-2xl font-bold shimmer-text">Настройки</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 rounded-xl font-cinzel font-bold text-sm transition-all ${tab === t.id ? "btn-gold" : "btn-magic text-yellow-100/60"}`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* TAB: TEAMS */}
        {tab === "teams" && (
          <div className="flex flex-col gap-4 fade-in-up">
            <p className="font-cormorant text-lg italic text-yellow-100/60 text-center">Измените названия команд</p>
            {teams.map((team, idx) => (
              <div key={team.id} className="magic-card p-4 flex items-center gap-4" style={team.borderStyle}>
                <span className="text-3xl">{team.emoji}</span>
                <div className="flex-1">
                  <div className="text-xs font-golos text-white/30 mb-1">Название команды</div>
                  <input
                    type="text"
                    value={team.name}
                    onChange={e => updateTeamName(idx, e.target.value)}
                    maxLength={30}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-cinzel text-sm text-yellow-100 outline-none focus:border-yellow-400/50 transition-colors"
                    style={{ caretColor: team.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: QUESTS */}
        {tab === "quests" && (
          <div className="flex flex-col gap-4 fade-in-up">

            {/* Zone selector */}
            <div>
              <div className="text-xs font-golos text-white/30 mb-2">Выберите раздел</div>
              <div className="grid grid-cols-3 gap-2">
                {zones.map(z => (
                  <button
                    key={z.id}
                    onClick={() => { setSelectedZoneId(z.id); setEditingQuestId(null); setShowAddForm(false); }}
                    className={`magic-card p-2 text-center transition-all ${selectedZoneId === z.id ? "scale-105" : "opacity-60 hover:opacity-100"}`}
                    style={selectedZoneId === z.id ? { borderColor: z.color, boxShadow: `0 0 16px ${z.color}40` } : {}}
                  >
                    <div className="text-xl">{z.emoji}</div>
                    <div className="font-cinzel text-xs leading-tight" style={selectedZoneId === z.id ? { color: z.color } : {}}>{z.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quest list */}
            {selectedZone && (
              <div className="flex flex-col gap-3">
                <div className="magic-divider" />
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-sm text-yellow-400">{selectedZone.emoji} {selectedZone.name} — {selectedZone.quests.length} заданий</span>
                  <button onClick={() => { setShowAddForm(v => !v); setEditingQuestId(null); }} className="btn-gold px-4 py-1.5 rounded-lg font-golos text-sm">
                    {showAddForm ? "✕ Отмена" : "+ Добавить"}
                  </button>
                </div>

                {/* Add form */}
                {showAddForm && (
                  <div className="magic-card p-5 flex flex-col gap-3 fade-in-up" style={{ borderColor: `${selectedZone.color}80` }}>
                    <p className="font-cinzel text-sm text-yellow-400">Новое задание</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs text-white/40 font-golos">Название *</label>
                        <input value={newQuest.title} onChange={e => setNewQuest(p => ({ ...p, title: e.target.value }))} placeholder="Название задания" className="settings-input" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-white/40 font-golos">Описание</label>
                        <textarea value={newQuest.description} onChange={e => setNewQuest(p => ({ ...p, description: e.target.value }))} placeholder="Опишите что нужно сделать..." rows={3} className="settings-input resize-none" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 font-golos">Эмодзи</label>
                        <input value={newQuest.emoji} onChange={e => setNewQuest(p => ({ ...p, emoji: e.target.value }))} maxLength={4} className="settings-input text-center text-2xl" />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 font-golos">Тема</label>
                        <select value={newQuest.topic} onChange={e => setNewQuest(p => ({ ...p, topic: e.target.value as CategoryTopic }))} className="settings-input">
                          {(Object.keys(TOPIC_META) as CategoryTopic[]).map(k => (
                            <option key={k} value={k}>{TOPIC_META[k].emoji} {TOPIC_META[k].label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 font-golos">Очки ⭐</label>
                        <div className="flex items-center gap-2">
                          <input type="range" min={50} max={300} step={10} value={newQuest.points} onChange={e => setNewQuest(p => ({ ...p, points: +e.target.value }))} className="flex-1 accent-yellow-400" />
                          <span className="font-cinzel text-yellow-400 font-bold w-10 text-right">{newQuest.points}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 font-golos">Время ⏱</label>
                        <div className="flex items-center gap-2">
                          <input type="range" min={10} max={300} step={5} value={newQuest.timeLimit} onChange={e => setNewQuest(p => ({ ...p, timeLimit: +e.target.value }))} className="flex-1 accent-yellow-400" />
                          <span className="font-cinzel text-yellow-400 font-bold w-12 text-right">{newQuest.timeLimit}с</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={addQuest} disabled={!newQuest.title.trim()} className="btn-gold py-2 rounded-xl font-cinzel font-bold disabled:opacity-30">✓ Добавить задание</button>
                  </div>
                )}

                {/* Existing quests */}
                {selectedZone.quests.map(quest => {
                  const meta = TOPIC_META[quest.topic];
                  const isEditing = editingQuestId === quest.id;
                  return (
                    <div key={quest.id} className="magic-card p-4 flex flex-col gap-3" style={isEditing ? { borderColor: meta.color, boxShadow: `0 0 16px ${meta.color}30` } : {}}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{quest.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-cinzel font-bold text-sm text-yellow-100 truncate">{quest.title}</div>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full font-golos" style={{ background: `${meta.color}20`, color: meta.color }}>{meta.emoji} {meta.label}</span>
                            <span className="text-xs text-yellow-400 font-cinzel">⭐ {quest.points}</span>
                            <span className="text-xs text-white/40 font-golos">⏱ {quest.timeLimit}с</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setEditingQuestId(isEditing ? null : quest.id)} className="text-xs px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all font-golos">
                            {isEditing ? "✕" : "✏️"}
                          </button>
                          <button onClick={() => deleteQuest(selectedZone.id, quest.id)} className="text-xs px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all font-golos">🗑</button>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex flex-col gap-3 pt-2 border-t border-white/10 fade-in-up">
                          <div>
                            <label className="text-xs text-white/40 font-golos">Название</label>
                            <input value={quest.title} onChange={e => updateZoneQuest(selectedZone.id, quest.id, "title", e.target.value)} className="settings-input" />
                          </div>
                          <div>
                            <label className="text-xs text-white/40 font-golos">Описание</label>
                            <textarea value={quest.description} onChange={e => updateZoneQuest(selectedZone.id, quest.id, "description", e.target.value)} rows={3} className="settings-input resize-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-white/40 font-golos">Эмодзи</label>
                              <input value={quest.emoji} onChange={e => updateZoneQuest(selectedZone.id, quest.id, "emoji", e.target.value)} maxLength={4} className="settings-input text-center text-xl" />
                            </div>
                            <div>
                              <label className="text-xs text-white/40 font-golos">Тема</label>
                              <select value={quest.topic} onChange={e => updateZoneQuest(selectedZone.id, quest.id, "topic", e.target.value)} className="settings-input">
                                {(Object.keys(TOPIC_META) as CategoryTopic[]).map(k => (
                                  <option key={k} value={k}>{TOPIC_META[k].emoji} {TOPIC_META[k].label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-white/40 font-golos">Очки ⭐ — {quest.points}</label>
                              <input type="range" min={50} max={300} step={10} value={quest.points} onChange={e => updateZoneQuest(selectedZone.id, quest.id, "points", +e.target.value)} className="w-full accent-yellow-400 mt-1" />
                            </div>
                            <div>
                              <label className="text-xs text-white/40 font-golos">Время ⏱ — {quest.timeLimit}с</label>
                              <input type="range" min={10} max={300} step={5} value={quest.timeLimit} onChange={e => updateZoneQuest(selectedZone.id, quest.id, "timeLimit", +e.target.value)} className="w-full accent-yellow-400 mt-1" />
                            </div>
                          </div>
                          <button onClick={() => setEditingQuestId(null)} className="btn-gold py-2 rounded-xl font-cinzel font-bold text-sm">✓ Сохранить</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
