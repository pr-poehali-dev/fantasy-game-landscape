import type { CategoryTopic, Zone, Team } from "@/types/game";

export const TOPIC_META: Record<CategoryTopic, { label: string; emoji: string; color: string }> = {
  characters:  { label: "Персонажи",           emoji: "🧙", color: "#a78bfa" },
  locations:   { label: "Локации",             emoji: "🗺️", color: "#34d399" },
  nature:      { label: "Природа",             emoji: "🌿", color: "#f5c842" },
  royal:       { label: "Указы Короля",        emoji: "👑", color: "#fb923c" },
  disaster:    { label: "Стихийные бедствия",  emoji: "🌪️", color: "#f87171" },
  duel:        { label: "Дуэли",               emoji: "⚔️", color: "#60a5fa" },
};

export const DEFAULT_ZONES: Zone[] = [
  {
    id: "sea", name: "Море", emoji: "🌊", color: "#0ea5e9",
    quests: [
      { id: 101, topic: "characters",  title: "Капитан пиратов",      description: "Изобразите капитана пиратов — жесты, походка, командный голос. Команда угадывает кто перед ними.", points: 120, timeLimit: 60, emoji: "🏴‍☠️" },
      { id: 102, topic: "locations",   title: "Затонувший город",     description: "Опишите затонувший город словами так, чтобы команда смогла нарисовать его план за 90 секунд.", points: 140, timeLimit: 90, emoji: "🏙️" },
      { id: 103, topic: "nature",      title: "Бутылочная почта",     description: "Напишите послание в бутылке в 10 слов — передайте его команде соперников, они должны угадать смысл.", points: 150, timeLimit: 75, emoji: "🍾" },
      { id: 104, topic: "royal",       title: "Указ об акулах",       description: "Король запретил бояться акул. Вся команда хором называет 5 морских существ страшнее акулы — на это 30 секунд.", points: 100, timeLimit: 30, emoji: "🦈" },
      { id: 105, topic: "disaster",    title: "Шторм 9 баллов",       description: "Команда изображает корабль в шторм: кто-то рулит, кто-то черпает воду, кто-то кричит «SOS» — удержитесь 45 секунд.", points: 130, timeLimit: 45, emoji: "⛈️" },
      { id: 106, topic: "duel",        title: "Морская угадайка",     description: "Два игрока от разных команд описывают одно морское существо — побеждает тот чья команда угадает быстрее.", points: 160, timeLimit: 90, emoji: "🐙" },
    ],
  },
  {
    id: "mountains", name: "Горы", emoji: "⛰️", color: "#78716c",
    quests: [
      { id: 201, topic: "characters",  title: "Дух горы",             description: "Один игрок — великий горный дух. Произнесите речь духа горы — торжественно, медленно, мощно.", points: 120, timeLimit: 60, emoji: "🗿" },
      { id: 202, topic: "locations",   title: "Пик туманов",          description: "Опишите вершину, где живут облака: назовите 7 вещей которые там могли бы находиться.", points: 130, timeLimit: 70, emoji: "☁️" },
      { id: 203, topic: "nature",     title: "Альпийский сигнал",    description: "Передайте сообщение команде через эхо — каждый игрок повторяет слово добавляя своё. Цепочка не должна прерваться.", points: 150, timeLimit: 90, emoji: "📢" },
      { id: 204, topic: "royal",       title: "Указ о вершинах",      description: "Король велит завоевать гору словами. Убедите остальных что ваша воображаемая гора — лучшая в мире за 40 секунд.", points: 110, timeLimit: 40, emoji: "👑" },
      { id: 205, topic: "disaster",    title: "Лавина!",              description: "Объявлена лавина. Вся команда за 20 секунд выстраивается по росту — молча, без слов.", points: 140, timeLimit: 20, emoji: "🏔️" },
      { id: 206, topic: "duel",        title: "Битва скалолазов",     description: "Два игрока из разных команд изображают скалолаза на воображаемой стене — кто продержится дольше.", points: 160, timeLimit: 60, emoji: "🧗" },
    ],
  },
  {
    id: "unknown", name: "Неизведанные земли", emoji: "🗺️", color: "#8b5cf6",
    quests: [
      { id: 301, topic: "characters",  title: "Первооткрыватель",     description: "Вы открыли новую землю. Назовите её, опишите 3 невиданных существа и придумайте флаг за 60 секунд.", points: 150, timeLimit: 60, emoji: "🧭" },
      { id: 302, topic: "locations",   title: "Карта неизвестного",   description: "Нарисуйте карту несуществующей земли за 45 секунд, затем другая команда угадывает что там изображено.", points: 140, timeLimit: 90, emoji: "📍" },
      { id: 303, topic: "nature",     title: "Новый язык",           description: "Изобретите 5 слов на несуществующем языке и обучите им всю команду — проверка: пусть команда произнесёт их.", points: 170, timeLimit: 90, emoji: "🔤" },
      { id: 304, topic: "royal",       title: "Указ об открытии",     description: "Король требует отчёт об экспедиции — расскажите о ней максимально драматично за 45 секунд.", points: 120, timeLimit: 45, emoji: "📜" },
      { id: 305, topic: "disaster",    title: "Землетрясение",        description: "Земля уходит из-под ног! Все игроки 30 секунд не могут стоять на месте и при этом молчат — кто остановится выбывает.", points: 130, timeLimit: 30, emoji: "💥" },
      { id: 306, topic: "duel",        title: "Дуэль картографов",    description: "Два игрока одновременно рисуют одну и ту же несуществующую страну — команды голосуют чья лучше.", points: 160, timeLimit: 60, emoji: "✏️" },
    ],
  },
  {
    id: "foreign", name: "Чужеземье", emoji: "🌍", color: "#f59e0b",
    quests: [
      { id: 401, topic: "characters",  title: "Посол из далёкой страны", description: "Один игрок — посол экзотической страны. Приветствуйте хозяев на выдуманном языке с переводом.", points: 130, timeLimit: 60, emoji: "🤵" },
      { id: 402, topic: "locations",   title: "Рынок пряностей",      description: "Опишите шумный заморский рынок — звуки, запахи, товары — за 60 секунд так чтобы все почувствовали аромат.", points: 140, timeLimit: 60, emoji: "🫙" },
      { id: 403, topic: "nature",     title: "Обряд чужеземцев",     description: "Придумайте странный ритуал приветствия на 5 движений и обучите ему всю команду за 45 секунд.", points: 160, timeLimit: 45, emoji: "🙏" },
      { id: 404, topic: "royal",       title: "Указ о пришельцах",    description: "Король подозревает чужеземца в шпионаже. Убедите его в своей невиновности за 30 секунд.", points: 120, timeLimit: 30, emoji: "🕵️" },
      { id: 405, topic: "disaster",    title: "Нашествие саранчи",    description: "Поля опустели! Назовите 10 блюд которые можно приготовить без зерна — у вас 40 секунд.", points: 130, timeLimit: 40, emoji: "🦗" },
      { id: 406, topic: "duel",        title: "Торговля с чужестранцем", description: "Два игрока торгуются: один продаёт «невидимый товар», другой торгуется. Команды угадывают что продаётся.", points: 150, timeLimit: 90, emoji: "🤝" },
    ],
  },
  {
    id: "glade", name: "Поляна", emoji: "🌸", color: "#34d399",
    quests: [
      { id: 501, topic: "characters",  title: "Добрая фея",           description: "Сыграйте добрую фею — исполните желание любого игрока в командной сцене за 60 секунд.", points: 110, timeLimit: 60, emoji: "🧚" },
      { id: 502, topic: "locations",   title: "Волшебный луг",        description: "Каждый игрок называет одно фантастическое растение на поляне и его магическое свойство — по кругу, без повторов.", points: 120, timeLimit: 60, emoji: "🌺" },
      { id: 503, topic: "nature",     title: "Хоровод удачи",        description: "Вся команда 30 секунд хором поёт придуманную песенку о весне — без слова «весна».", points: 140, timeLimit: 30, emoji: "🎵" },
      { id: 504, topic: "royal",       title: "Указ о пикнике",       description: "Король устраивает пикник на поляне. Составьте меню из 7 блюд — каждое должно содержать «магический» ингредиент.", points: 110, timeLimit: 50, emoji: "🧺" },
      { id: 505, topic: "disaster",    title: "Ливень с градом",      description: "Ливень срывает пикник! Вся команда 20 секунд спасает «воображаемые блюда» — пантомима, без слов.", points: 130, timeLimit: 20, emoji: "⛈️" },
      { id: 506, topic: "duel",        title: "Соревнование певчих",  description: "По одному от каждой команды — кто придумает более красивое название для цветка прямо сейчас. Голосует зал.", points: 140, timeLimit: 60, emoji: "🎤" },
    ],
  },
  {
    id: "city", name: "Город", emoji: "🏙️", color: "#94a3b8",
    quests: [
      { id: 601, topic: "characters",  title: "Городской глашатай",   description: "Объявите последние новости города максимально драматично — придумайте 3 новости за 60 секунд.", points: 120, timeLimit: 60, emoji: "📣" },
      { id: 602, topic: "locations",   title: "Рынок на площади",     description: "Каждый игрок — торговец на рынке. 30 секунд все одновременно рекламируют свой «товар» — побеждает громче всех.", points: 130, timeLimit: 30, emoji: "🏪" },
      { id: 603, topic: "nature",     title: "Городская легенда",    description: "Придумайте страшную городскую легенду за 45 секунд и расскажите её максимально пугающе.", points: 160, timeLimit: 45, emoji: "👻" },
      { id: 604, topic: "royal",       title: "Указ о комендантском часе", description: "Король вводит комендантский час. Убедите стражника что у вас есть особое разрешение — 30 секунд.", points: 120, timeLimit: 30, emoji: "🌙" },
      { id: 605, topic: "disaster",    title: "Пожар в таверне",      description: "Огонь! Команда за 15 секунд решает что спасать первым — каждый называет один предмет. Нет повторов.", points: 140, timeLimit: 15, emoji: "🔥" },
      { id: 606, topic: "duel",        title: "Спор горожан",         description: "Два игрока спорят: чей район лучше. Каждому по 20 секунд на аргументы. Зрители голосуют.", points: 150, timeLimit: 90, emoji: "🗣️" },
    ],
  },
  {
    id: "cherry", name: "Вишнёвый сад", emoji: "🌸", color: "#f472b6",
    quests: [
      { id: 701, topic: "characters",  title: "Хозяйка сада",         description: "Сыграйте утончённую хозяйку поместья — проведите экскурсию по саду за 60 секунд максимально театрально.", points: 120, timeLimit: 60, emoji: "👸" },
      { id: 702, topic: "locations",   title: "Аллея вишен",          description: "Опишите прогулку по цветущей аллее — что слышно, что видно, какой запах — не менее 5 деталей.", points: 130, timeLimit: 60, emoji: "🌳" },
      { id: 703, topic: "nature",     title: "Письмо из прошлого",   description: "Напишите письмо от жителя сада XIX века потомкам — продиктуйте его команде за 45 секунд.", points: 160, timeLimit: 45, emoji: "✉️" },
      { id: 704, topic: "royal",       title: "Указ о вишнях",        description: "Король требует все вишни отдать в казну! Обоснуйте за 30 секунд почему этого нельзя делать.", points: 110, timeLimit: 30, emoji: "🍒" },
      { id: 705, topic: "disaster",    title: "Вырубка сада",         description: "Слышен стук топора! Вся команда 30 секунд прощается с садом — каждый игрок одна фраза, по кругу.", points: 130, timeLimit: 30, emoji: "🪓" },
      { id: 706, topic: "duel",        title: "Поэтический турнир",   description: "Два игрока по очереди произносят строфы стихотворения о вишне — кто первый остановится тот проиграл.", points: 150, timeLimit: 90, emoji: "📝" },
    ],
  },
  {
    id: "swamp", name: "Болота", emoji: "🐊", color: "#65a30d",
    quests: [
      { id: 801, topic: "characters",  title: "Болотная ведьма",      description: "Сыграйте болотную ведьму — предложите зелье от любой беды команде-сопернику и опишите его состав.", points: 130, timeLimit: 60, emoji: "🧙‍♀️" },
      { id: 802, topic: "locations",   title: "Трясина",              description: "Опишите болото так страшно чтобы никто не захотел туда идти — не менее 6 жутких деталей.", points: 120, timeLimit: 60, emoji: "🌿" },
      { id: 803, topic: "nature",     title: "Болотный пузырь",      description: "Придумайте «болотное заклинание» из 5 слов — вся команда должна произнести его одновременно, с первого раза.", points: 150, timeLimit: 45, emoji: "💬" },
      { id: 804, topic: "royal",       title: "Указ об осушении",     description: "Король хочет осушить болото. Убедите его что болото важнее замка — 40 секунд.", points: 120, timeLimit: 40, emoji: "💧" },
      { id: 805, topic: "disaster",    title: "Туман болот",          description: "Густой туман — никто не видит дальше шага. Вся команда молча выстраивается в ряд по дням рождения.", points: 140, timeLimit: 30, emoji: "🌫️" },
      { id: 806, topic: "duel",        title: "Дуэль лягушек",        description: "Два игрока квакают — тот кто квакнет дольше или смешнее по версии зрителей побеждает.", points: 130, timeLimit: 60, emoji: "🐸" },
    ],
  },
  {
    id: "forest", name: "Лес", emoji: "🌲", color: "#16a34a",
    quests: [
      { id: 901, topic: "characters",  title: "Лесной страж",         description: "Вы — древний дух леса. Допросите команду соперников: зачем они пришли в ваш лес? 60 секунд.", points: 120, timeLimit: 60, emoji: "🌳" },
      { id: 902, topic: "locations",   title: "Чаща",                 description: "Нарисуйте мысленную карту леса — каждый игрок добавляет одно место. Не менее 5 мест.", points: 130, timeLimit: 70, emoji: "🗺️" },
      { id: 903, topic: "nature",     title: "Клич зверей",          description: "Каждый игрок выбирает лесного зверя и 30 секунд все издают его звуки одновременно. Победа если другие угадают всех.", points: 150, timeLimit: 30, emoji: "🦊" },
      { id: 904, topic: "royal",       title: "Указ об охоте",        description: "Король объявил охоту в лесу! Спрячьте команду за 15 секунд — придумайте план куда все прячутся.", points: 120, timeLimit: 15, emoji: "🏹" },
      { id: 905, topic: "disaster",    title: "Лесной пожар",         description: "Горит чаща! Назовите 7 животных которых надо спасти первыми — за 20 секунд, все вместе, без повторов.", points: 140, timeLimit: 20, emoji: "🔥" },
      { id: 906, topic: "duel",        title: "Дуэль следопытов",     description: "Два игрока описывают один и тот же лесной звук. Чьё описание точнее — решает команда соперников.", points: 150, timeLimit: 90, emoji: "👂" },
    ],
  },
  {
    id: "jokers", name: "Королевство шутов", emoji: "🃏", color: "#e879f9",
    quests: [
      { id: 1001, topic: "characters", title: "Придворный шут",       description: "Рассмешите команду соперников за 30 секунд — используя только мимику и жесты, без слов.", points: 140, timeLimit: 30, emoji: "🤡" },
      { id: 1002, topic: "locations",  title: "Зал кривых зеркал",   description: "Опишите комнату где всё наоборот — небо внизу, пол вверху. Назовите 5 предметов и что с ними не так.", points: 130, timeLimit: 60, emoji: "🪞" },
      { id: 1003, topic: "nature",    title: "Шутовской указ",       description: "Придумайте самый нелепый закон королевства — зачитайте его официальным тоном за 30 секунд.", points: 160, timeLimit: 30, emoji: "📜" },
      { id: 1004, topic: "royal",      title: "Указ смехом",          description: "Любой указ короля сегодня вступает в силу только если он произнесён смеясь. Произнесите указ команды-соперника смеясь.", points: 120, timeLimit: 30, emoji: "😂" },
      { id: 1005, topic: "disaster",   title: "Смех-эпидемия",        description: "По команде все начинают смеяться — кто засмеётся последним тот победил. Один игрок пытается рассмешить команду.", points: 130, timeLimit: 60, emoji: "😄" },
      { id: 1006, topic: "duel",       title: "Дуэль каламбуров",     description: "Два игрока по очереди говорят каламбуры или смешные фразы. Кто первый замолчит — проиграл.", points: 150, timeLimit: 90, emoji: "🎭" },
    ],
  },
  {
    id: "village", name: "Деревня", emoji: "🏡", color: "#d97706",
    quests: [
      { id: 1101, topic: "characters", title: "Деревенский староста", description: "Сыграйте строгого старосту — разберите «спор» двух игроков вашей команды справедливо за 60 секунд.", points: 120, timeLimit: 60, emoji: "👴" },
      { id: 1102, topic: "locations",  title: "Деревенская площадь",  description: "Опишите деревенскую площадь в день ярмарки — звуки, запахи, лица — не менее 6 деталей.", points: 130, timeLimit: 60, emoji: "🎪" },
      { id: 1103, topic: "nature",    title: "Рецепт бабушки",       description: "Продиктуйте «древний рецепт» деревенской стряпни из 6 ингредиентов — команда записывает и зачитывает обратно.", points: 150, timeLimit: 60, emoji: "🥘" },
      { id: 1104, topic: "royal",      title: "Указ о налогах",       description: "Король поднял налоги! Соберите «налог» — каждый игрок отдаёт один предмет добровольно за 15 секунд.", points: 110, timeLimit: 15, emoji: "💰" },
      { id: 1105, topic: "disaster",   title: "Засуха",               description: "Нет воды! Придумайте 5 способов добыть воду в деревне без колодца — за 30 секунд.", points: 130, timeLimit: 30, emoji: "☀️" },
      { id: 1106, topic: "duel",       title: "Спор соседей",         description: "Два игрока спорят у чьего забора выросла тыква. Каждому по 20 секунд на доказательства. Зал решает.", points: 150, timeLimit: 80, emoji: "🎃" },
    ],
  },
  {
    id: "lakeriver", name: "Озеро и Река", emoji: "🏞️", color: "#38bdf8",
    quests: [
      { id: 1201, topic: "characters", title: "Речная нимфа",         description: "Сыграйте нимфу реки — пригласите команду искупаться, описав реку так соблазнительно чтобы все захотели.", points: 120, timeLimit: 60, emoji: "🧜" },
      { id: 1202, topic: "locations",  title: "Дно озера",            description: "Опишите что лежит на дне тайного озера — не менее 7 предметов с историей каждого.", points: 140, timeLimit: 75, emoji: "🐚" },
      { id: 1203, topic: "nature",    title: "Загадка водяного",     description: "Водяной загадал загадку — придумайте её за 20 секунд и задайте команде-сопернику. Если те не ответят — ваши очки.", points: 170, timeLimit: 90, emoji: "🌊" },
      { id: 1204, topic: "royal",      title: "Указ о рыбной ловле",  description: "Король запретил ловить рыбу! Придумайте чем кормить деревню вместо рыбы — 5 идей за 30 секунд.", points: 120, timeLimit: 30, emoji: "🐟" },
      { id: 1205, topic: "disaster",   title: "Наводнение",           description: "Вода прибывает! Команда за 20 секунд решает что поднять выше — каждый называет один предмет без повторов.", points: 140, timeLimit: 20, emoji: "💦" },
      { id: 1206, topic: "duel",       title: "Рыбацкое хвастовство", description: "Два рыбака хвастаются уловом — рыба становится больше с каждой фразой. Кто первый засмеётся — проиграл.", points: 150, timeLimit: 90, emoji: "🎣" },
    ],
  },
];

export const DEFAULT_TEAMS: Team[] = [
  { id: "fire",   name: "Команда Огня",  emoji: "🔥", score: 0, color: "#ff6b35", borderStyle: { borderColor: "rgba(255,107,53,0.55)", boxShadow: "0 0 28px rgba(255,107,53,0.18)" }, glowStyle: { color: "#ff6b35", textShadow: "0 0 14px rgba(255,107,53,0.8)" } },
  { id: "ice",    name: "Команда Льда",  emoji: "❄️", score: 0, color: "#00d4ff", borderStyle: { borderColor: "rgba(0,212,255,0.55)",   boxShadow: "0 0 28px rgba(0,212,255,0.18)"   }, glowStyle: { color: "#00d4ff", textShadow: "0 0 14px rgba(0,212,255,0.8)"   } },
  { id: "forest", name: "Команда Леса",  emoji: "🌿", score: 0, color: "#4ade80", borderStyle: { borderColor: "rgba(74,222,128,0.55)",  boxShadow: "0 0 28px rgba(74,222,128,0.18)"  }, glowStyle: { color: "#4ade80", textShadow: "0 0 14px rgba(74,222,128,0.8)"  } },
  { id: "storm",  name: "Команда Грозы", emoji: "⚡", score: 0, color: "#facc15", borderStyle: { borderColor: "rgba(250,204,21,0.55)",  boxShadow: "0 0 28px rgba(250,204,21,0.18)"  }, glowStyle: { color: "#facc15", textShadow: "0 0 14px rgba(250,204,21,0.8)"  } },
];