import { useState, useEffect, useRef } from "react";

type CategoryTopic = "characters" | "locations" | "special" | "royal" | "disaster" | "duel" | "obstacle";
type GameView = "home" | "game" | "result";
type TeamId = "fire" | "ice" | "forest" | "storm";

interface Quest {
  id: number;
  topic: CategoryTopic;
  title: string;
  description: string;
  points: number;
  timeLimit: number;
  emoji: string;
}

interface Zone {
  id: string;
  name: string;
  emoji: string;
  color: string;
  quests: Quest[];
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

const TOPIC_META: Record<CategoryTopic, { label: string; emoji: string; color: string }> = {
  characters:  { label: "Персонажи",           emoji: "🧙", color: "#a78bfa" },
  locations:   { label: "Локации",             emoji: "🗺️", color: "#34d399" },
  special:     { label: "Спец. задания",       emoji: "⭐", color: "#f5c842" },
  royal:       { label: "Указы Короля",        emoji: "👑", color: "#fb923c" },
  disaster:    { label: "Стихийные бедствия",  emoji: "🌪️", color: "#f87171" },
  duel:        { label: "Дуэли",               emoji: "⚔️", color: "#60a5fa" },
  obstacle:    { label: "Преграды",            emoji: "🚧", color: "#e879f9" },
};

const ZONES: Zone[] = [
  {
    id: "sea", name: "Море", emoji: "🌊", color: "#0ea5e9",
    quests: [
      { id: 101, topic: "characters",  title: "Капитан пиратов",      description: "Изобразите капитана пиратов — жесты, походка, командный голос. Команда угадывает кто перед ними.", points: 120, timeLimit: 60, emoji: "🏴‍☠️" },
      { id: 102, topic: "locations",   title: "Затонувший город",     description: "Опишите затонувший город словами так, чтобы команда смогла нарисовать его план за 90 секунд.", points: 140, timeLimit: 90, emoji: "🏙️" },
      { id: 103, topic: "special",     title: "Бутылочная почта",     description: "Напишите послание в бутылке в 10 слов — передайте его команде соперников, они должны угадать смысл.", points: 150, timeLimit: 75, emoji: "🍾" },
      { id: 104, topic: "royal",       title: "Указ об акулах",       description: "Король запретил бояться акул. Вся команда хором называет 5 морских существ страшнее акулы — на это 30 секунд.", points: 100, timeLimit: 30, emoji: "🦈" },
      { id: 105, topic: "disaster",    title: "Шторм 9 баллов",       description: "Команда изображает корабль в шторм: кто-то рулит, кто-то черпает воду, кто-то кричит «SOS» — удержитесь 45 секунд.", points: 130, timeLimit: 45, emoji: "⛈️" },
      { id: 106, topic: "duel",        title: "Морская угадайка",     description: "Два игрока от разных команд описывают одно морское существо — побеждает тот чья команда угадает быстрее.", points: 160, timeLimit: 90, emoji: "🐙" },
      { id: 107, topic: "obstacle",    title: "Водоворот",            description: "Нельзя использовать слова «море», «вода», «волна» — опишите морской пейзаж за 60 секунд.", points: 110, timeLimit: 60, emoji: "🌀" },
    ],
  },
  {
    id: "mountains", name: "Горы", emoji: "⛰️", color: "#78716c",
    quests: [
      { id: 201, topic: "characters",  title: "Дух горы",             description: "Один игрок — великий горный дух. Произнесите речь духа горы — торжественно, медленно, мощно.", points: 120, timeLimit: 60, emoji: "🗿" },
      { id: 202, topic: "locations",   title: "Пик туманов",          description: "Опишите вершину, где живут облака: назовите 7 вещей которые там могли бы находиться.", points: 130, timeLimit: 70, emoji: "☁️" },
      { id: 203, topic: "special",     title: "Альпийский сигнал",    description: "Передайте сообщение команде через эхо — каждый игрок повторяет слово добавляя своё. Цепочка не должна прерваться.", points: 150, timeLimit: 90, emoji: "📢" },
      { id: 204, topic: "royal",       title: "Указ о вершинах",      description: "Король велит завоевать гору словами. Убедите остальных что ваша воображаемая гора — лучшая в мире за 40 секунд.", points: 110, timeLimit: 40, emoji: "👑" },
      { id: 205, topic: "disaster",    title: "Лавина!",              description: "Объявлена лавина. Вся команда за 20 секунд выстраивается по росту — молча, без слов.", points: 140, timeLimit: 20, emoji: "🏔️" },
      { id: 206, topic: "duel",        title: "Битва скалолазов",     description: "Два игрока из разных команд изображают скалолаза на воображаемой стене — кто продержится дольше.", points: 160, timeLimit: 60, emoji: "🧗" },
      { id: 207, topic: "obstacle",    title: "Туман в ущелье",       description: "Нельзя открывать глаза. Ведущий с закрытыми глазами находит спрятанный предмет по голосовым подсказкам команды.", points: 130, timeLimit: 80, emoji: "🌫️" },
    ],
  },
  {
    id: "unknown", name: "Неизведанные земли", emoji: "🗺️", color: "#8b5cf6",
    quests: [
      { id: 301, topic: "characters",  title: "Первооткрыватель",     description: "Вы открыли новую землю. Назовите её, опишите 3 невиданных существа и придумайте флаг за 60 секунд.", points: 150, timeLimit: 60, emoji: "🧭" },
      { id: 302, topic: "locations",   title: "Карта неизвестного",   description: "Нарисуйте карту несуществующей земли за 45 секунд, затем другая команда угадывает что там изображено.", points: 140, timeLimit: 90, emoji: "📍" },
      { id: 303, topic: "special",     title: "Новый язык",           description: "Изобретите 5 слов на несуществующем языке и обучите им всю команду — проверка: пусть команда произнесёт их.", points: 170, timeLimit: 90, emoji: "🔤" },
      { id: 304, topic: "royal",       title: "Указ об открытии",     description: "Король требует отчёт об экспедиции — расскажите о ней максимально драматично за 45 секунд.", points: 120, timeLimit: 45, emoji: "📜" },
      { id: 305, topic: "disaster",    title: "Землетрясение",        description: "Земля уходит из-под ног! Все игроки 30 секунд не могут стоять на месте и при этом молчат — кто остановится выбывает.", points: 130, timeLimit: 30, emoji: "💥" },
      { id: 306, topic: "duel",        title: "Дуэль картографов",    description: "Два игрока одновременно рисуют одну и ту же несуществующую страну — команды голосуют чья лучше.", points: 160, timeLimit: 60, emoji: "✏️" },
      { id: 307, topic: "obstacle",    title: "Запретная зона",       description: "Нельзя называть страны, города и имена собственные. Расскажите историю путешественника за 60 секунд.", points: 120, timeLimit: 60, emoji: "🚫" },
    ],
  },
  {
    id: "foreign", name: "Чужеземье", emoji: "🌍", color: "#f59e0b",
    quests: [
      { id: 401, topic: "characters",  title: "Посол из далёкой страны", description: "Один игрок — посол экзотической страны. Приветствуйте хозяев на выдуманном языке с переводом.", points: 130, timeLimit: 60, emoji: "🤵" },
      { id: 402, topic: "locations",   title: "Рынок пряностей",      description: "Опишите шумный заморский рынок — звуки, запахи, товары — за 60 секунд так чтобы все почувствовали аромат.", points: 140, timeLimit: 60, emoji: "🫙" },
      { id: 403, topic: "special",     title: "Обряд чужеземцев",     description: "Придумайте странный ритуал приветствия на 5 движений и обучите ему всю команду за 45 секунд.", points: 160, timeLimit: 45, emoji: "🙏" },
      { id: 404, topic: "royal",       title: "Указ о пришельцах",    description: "Король подозревает чужеземца в шпионаже. Убедите его в своей невиновности за 30 секунд.", points: 120, timeLimit: 30, emoji: "🕵️" },
      { id: 405, topic: "disaster",    title: "Нашествие саранчи",    description: "Поля опустели! Назовите 10 блюд которые можно приготовить без зерна — у вас 40 секунд.", points: 130, timeLimit: 40, emoji: "🦗" },
      { id: 406, topic: "duel",        title: "Торговля с чужестранцем", description: "Два игрока торгуются: один продаёт «невидимый товар», другой торгуется. Команды угадывают что продаётся.", points: 150, timeLimit: 90, emoji: "🤝" },
      { id: 407, topic: "obstacle",    title: "Языковой барьер",      description: "Нельзя говорить на русском — объясните командным жестом три слова на выбор ведущего.", points: 140, timeLimit: 60, emoji: "🗣️" },
    ],
  },
  {
    id: "glade", name: "Поляна", emoji: "🌸", color: "#34d399",
    quests: [
      { id: 501, topic: "characters",  title: "Добрая фея",           description: "Сыграйте добрую фею — исполните желание любого игрока в командной сцене за 60 секунд.", points: 110, timeLimit: 60, emoji: "🧚" },
      { id: 502, topic: "locations",   title: "Волшебный луг",        description: "Каждый игрок называет одно фантастическое растение на поляне и его магическое свойство — по кругу, без повторов.", points: 120, timeLimit: 60, emoji: "🌺" },
      { id: 503, topic: "special",     title: "Хоровод удачи",        description: "Вся команда 30 секунд хором поёт придуманную песенку о весне — без слова «весна».", points: 140, timeLimit: 30, emoji: "🎵" },
      { id: 504, topic: "royal",       title: "Указ о пикнике",       description: "Король устраивает пикник на поляне. Составьте меню из 7 блюд — каждое должно содержать «магический» ингредиент.", points: 110, timeLimit: 50, emoji: "🧺" },
      { id: 505, topic: "disaster",    title: "Ливень с градом",      description: "Ливень срывает пикник! Вся команда 20 секунд спасает «воображаемые блюда» — пантомима, без слов.", points: 130, timeLimit: 20, emoji: "⛈️" },
      { id: 506, topic: "duel",        title: "Соревнование певчих",  description: "По одному от каждой команды — кто придумает более красивое название для цветка прямо сейчас. Голосует зал.", points: 140, timeLimit: 60, emoji: "🎤" },
      { id: 507, topic: "obstacle",    title: "Крапива на пути",      description: "Нельзя касаться пола руками. Добудьте «артефакт» с другого конца комнаты — договоритесь как.", points: 130, timeLimit: 60, emoji: "🌿" },
    ],
  },
  {
    id: "city", name: "Город", emoji: "🏙️", color: "#94a3b8",
    quests: [
      { id: 601, topic: "characters",  title: "Городской глашатай",   description: "Объявите последние новости города максимально драматично — придумайте 3 новости за 60 секунд.", points: 120, timeLimit: 60, emoji: "📣" },
      { id: 602, topic: "locations",   title: "Рынок на площади",     description: "Каждый игрок — торговец на рынке. 30 секунд все одновременно рекламируют свой «товар» — побеждает громче всех.", points: 130, timeLimit: 30, emoji: "🏪" },
      { id: 603, topic: "special",     title: "Городская легенда",    description: "Придумайте страшную городскую легенду за 45 секунд и расскажите её максимально пугающе.", points: 160, timeLimit: 45, emoji: "👻" },
      { id: 604, topic: "royal",       title: "Указ о комендантском часе", description: "Король вводит комендантский час. Убедите стражника что у вас есть особое разрешение — 30 секунд.", points: 120, timeLimit: 30, emoji: "🌙" },
      { id: 605, topic: "disaster",    title: "Пожар в таверне",      description: "Огонь! Команда за 15 секунд решает что спасать первым — каждый называет один предмет. Нет повторов.", points: 140, timeLimit: 15, emoji: "🔥" },
      { id: 606, topic: "duel",        title: "Спор горожан",         description: "Два игрока спорят: чей район лучше. Каждому по 20 секунд на аргументы. Зрители голосуют.", points: 150, timeLimit: 90, emoji: "🗣️" },
      { id: 607, topic: "obstacle",    title: "Толпа на ярмарке",     description: "Нельзя разговаривать — вся команда молча выстраивается по алфавиту имён за 30 секунд.", points: 120, timeLimit: 30, emoji: "🎪" },
    ],
  },
  {
    id: "cherry", name: "Вишнёвый сад", emoji: "🌸", color: "#f472b6",
    quests: [
      { id: 701, topic: "characters",  title: "Хозяйка сада",         description: "Сыграйте утончённую хозяйку поместья — проведите экскурсию по саду за 60 секунд максимально театрально.", points: 120, timeLimit: 60, emoji: "👸" },
      { id: 702, topic: "locations",   title: "Аллея вишен",          description: "Опишите прогулку по цветущей аллее — что слышно, что видно, какой запах — не менее 5 деталей.", points: 130, timeLimit: 60, emoji: "🌳" },
      { id: 703, topic: "special",     title: "Письмо из прошлого",   description: "Напишите письмо от жителя сада XIX века потомкам — продиктуйте его команде за 45 секунд.", points: 160, timeLimit: 45, emoji: "✉️" },
      { id: 704, topic: "royal",       title: "Указ о вишнях",        description: "Король требует все вишни отдать в казну! Обоснуйте за 30 секунд почему этого нельзя делать.", points: 110, timeLimit: 30, emoji: "🍒" },
      { id: 705, topic: "disaster",    title: "Вырубка сада",         description: "Слышен стук топора! Вся команда 30 секунд прощается с садом — каждый игрок одна фраза, по кругу.", points: 130, timeLimit: 30, emoji: "🪓" },
      { id: 706, topic: "duel",        title: "Поэтический турнир",   description: "Два игрока по очереди произносят строфы стихотворения о вишне — кто первый остановится тот проиграл.", points: 150, timeLimit: 90, emoji: "📝" },
      { id: 707, topic: "obstacle",    title: "Туман в саду",         description: "Нельзя видеть — один игрок с закрытыми глазами ищет «вишню» (любой предмет) по голосовым подсказкам.", points: 130, timeLimit: 60, emoji: "🌫️" },
    ],
  },
  {
    id: "swamp", name: "Болота", emoji: "🐊", color: "#65a30d",
    quests: [
      { id: 801, topic: "characters",  title: "Болотная ведьма",      description: "Сыграйте болотную ведьму — предложите зелье от любой беды команде-сопернику и опишите его состав.", points: 130, timeLimit: 60, emoji: "🧙‍♀️" },
      { id: 802, topic: "locations",   title: "Трясина",              description: "Опишите болото так страшно чтобы никто не захотел туда идти — не менее 6 жутких деталей.", points: 120, timeLimit: 60, emoji: "🌿" },
      { id: 803, topic: "special",     title: "Болотный пузырь",      description: "Придумайте «болотное заклинание» из 5 слов — вся команда должна произнести его одновременно, с первого раза.", points: 150, timeLimit: 45, emoji: "💬" },
      { id: 804, topic: "royal",       title: "Указ об осушении",     description: "Король хочет осушить болото. Убедите его что болото важнее замка — 40 секунд.", points: 120, timeLimit: 40, emoji: "💧" },
      { id: 805, topic: "disaster",    title: "Туман болот",          description: "Густой туман — никто не видит дальше шага. Вся команда молча выстраивается в ряд по дням рождения.", points: 140, timeLimit: 30, emoji: "🌫️" },
      { id: 806, topic: "duel",        title: "Дуэль лягушек",        description: "Два игрока квакают — тот кто квакнет дольше или смешнее по версии зрителей побеждает.", points: 130, timeLimit: 60, emoji: "🐸" },
      { id: 807, topic: "obstacle",    title: "Трясина засасывает",   description: "Нельзя поднимать ноги выше 5 см. Вся команда перемещается по комнате не отрывая ног — 20 секунд.", points: 140, timeLimit: 20, emoji: "🦶" },
    ],
  },
  {
    id: "forest", name: "Лес", emoji: "🌲", color: "#16a34a",
    quests: [
      { id: 901, topic: "characters",  title: "Лесной страж",         description: "Вы — древний дух леса. Допросите команду соперников: зачем они пришли в ваш лес? 60 секунд.", points: 120, timeLimit: 60, emoji: "🌳" },
      { id: 902, topic: "locations",   title: "Чаща",                 description: "Нарисуйте мысленную карту леса — каждый игрок добавляет одно место. Не менее 5 мест.", points: 130, timeLimit: 70, emoji: "🗺️" },
      { id: 903, topic: "special",     title: "Клич зверей",          description: "Каждый игрок выбирает лесного зверя и 30 секунд все издают его звуки одновременно. Победа если другие угадают всех.", points: 150, timeLimit: 30, emoji: "🦊" },
      { id: 904, topic: "royal",       title: "Указ об охоте",        description: "Король объявил охоту в лесу! Спрячьте команду за 15 секунд — придумайте план куда все прячутся.", points: 120, timeLimit: 15, emoji: "🏹" },
      { id: 905, topic: "disaster",    title: "Лесной пожар",         description: "Горит чаща! Назовите 7 животных которых надо спасти первыми — за 20 секунд, все вместе, без повторов.", points: 140, timeLimit: 20, emoji: "🔥" },
      { id: 906, topic: "duel",        title: "Дуэль следопытов",     description: "Два игрока описывают один и тот же лесной звук. Чьё описание точнее — решает команда соперников.", points: 150, timeLimit: 90, emoji: "👂" },
      { id: 907, topic: "obstacle",    title: "Бурелом",              description: "Нельзя ходить прямо — только зигзагом. Вся команда перемещается к цели 20 секунд без столкновений.", points: 130, timeLimit: 20, emoji: "🌪️" },
    ],
  },
  {
    id: "jokers", name: "Королевство шутов", emoji: "🃏", color: "#e879f9",
    quests: [
      { id: 1001, topic: "characters", title: "Придворный шут",       description: "Рассмешите команду соперников за 30 секунд — используя только мимику и жесты, без слов.", points: 140, timeLimit: 30, emoji: "🤡" },
      { id: 1002, topic: "locations",  title: "Зал кривых зеркал",    description: "Опишите комнату где всё наоборот — небо внизу, пол вверху. Назовите 5 предметов и что с ними не так.", points: 130, timeLimit: 60, emoji: "🪞" },
      { id: 1003, topic: "special",    title: "Шутовской указ",       description: "Придумайте самый нелепый закон королевства — зачитайте его официальным тоном за 30 секунд.", points: 160, timeLimit: 30, emoji: "📜" },
      { id: 1004, topic: "royal",      title: "Указ смехом",          description: "Любой указ короля сегодня вступает в силу только если он произнесён смеясь. Произнесите указ команды-соперника смеясь.", points: 120, timeLimit: 30, emoji: "😂" },
      { id: 1005, topic: "disaster",   title: "Смех-эпидемия",        description: "По команде все начинают смеяться — кто засмеётся последним тот победил. Один игрок пытается рассмешить команду.", points: 130, timeLimit: 60, emoji: "😄" },
      { id: 1006, topic: "duel",       title: "Дуэль каламбуров",     description: "Два игрока по очереди говорят каламбуры или смешные фразы. Кто первый замолчит — проиграл.", points: 150, timeLimit: 90, emoji: "🎭" },
      { id: 1007, topic: "obstacle",   title: "Зеркальный лабиринт",  description: "Нельзя говорить ничего кроме «да» и «нет». Объясните команде что нужно сделать за 45 секунд.", points: 140, timeLimit: 45, emoji: "🌀" },
    ],
  },
  {
    id: "village", name: "Деревня", emoji: "🏡", color: "#d97706",
    quests: [
      { id: 1101, topic: "characters", title: "Деревенский староста", description: "Сыграйте строгого старосту — разберите «спор» двух игроков вашей команды справедливо за 60 секунд.", points: 120, timeLimit: 60, emoji: "👴" },
      { id: 1102, topic: "locations",  title: "Деревенская площадь",  description: "Опишите деревенскую площадь в день ярмарки — звуки, запахи, лица — не менее 6 деталей.", points: 130, timeLimit: 60, emoji: "🎪" },
      { id: 1103, topic: "special",    title: "Рецепт бабушки",       description: "Продиктуйте «древний рецепт» деревенской стряпни из 6 ингредиентов — команда записывает и зачитывает обратно.", points: 150, timeLimit: 60, emoji: "🥘" },
      { id: 1104, topic: "royal",      title: "Указ о налогах",       description: "Король поднял налоги! Соберите «налог» — каждый игрок отдаёт один предмет добровольно за 15 секунд.", points: 110, timeLimit: 15, emoji: "💰" },
      { id: 1105, topic: "disaster",   title: "Засуха",               description: "Нет воды! Придумайте 5 способов добыть воду в деревне без колодца — за 30 секунд.", points: 130, timeLimit: 30, emoji: "☀️" },
      { id: 1106, topic: "duel",       title: "Спор соседей",         description: "Два игрока спорят у чьего забора выросла тыква. Каждому по 20 секунд на доказательства. Зал решает.", points: 150, timeLimit: 80, emoji: "🎃" },
      { id: 1107, topic: "obstacle",   title: "Грязная дорога",       description: "Нельзя касаться «грязи» — очерченной зоны пола. Вся команда перебирается с одной стороны на другую.", points: 140, timeLimit: 30, emoji: "🟫" },
    ],
  },
  {
    id: "lakeriver", name: "Озеро и Река", emoji: "🏞️", color: "#38bdf8",
    quests: [
      { id: 1201, topic: "characters", title: "Речная нимфа",         description: "Сыграйте нимфу реки — пригласите команду искупаться, описав реку так соблазнительно чтобы все захотели.", points: 120, timeLimit: 60, emoji: "🧜" },
      { id: 1202, topic: "locations",  title: "Дно озера",            description: "Опишите что лежит на дне тайного озера — не менее 7 предметов с историей каждого.", points: 140, timeLimit: 75, emoji: "🐚" },
      { id: 1203, topic: "special",    title: "Загадка водяного",     description: "Водяной загадал загадку — придумайте её за 20 секунд и задайте команде-сопернику. Если те не ответят — ваши очки.", points: 170, timeLimit: 90, emoji: "🌊" },
      { id: 1204, topic: "royal",      title: "Указ о рыбной ловле",  description: "Король запретил ловить рыбу! Придумайте чем кормить деревню вместо рыбы — 5 идей за 30 секунд.", points: 120, timeLimit: 30, emoji: "🐟" },
      { id: 1205, topic: "disaster",   title: "Наводнение",           description: "Вода прибывает! Команда за 20 секунд решает что поднять выше — каждый называет один предмет без повторов.", points: 140, timeLimit: 20, emoji: "💦" },
      { id: 1206, topic: "duel",       title: "Рыбацкое хвастовство", description: "Два рыбака хвастаются уловом — рыба становится больше с каждой фразой. Кто первый засмеётся — проиграл.", points: 150, timeLimit: 90, emoji: "🎣" },
      { id: 1207, topic: "obstacle",   title: "Переправа",            description: "Нельзя использовать ноги полностью — только пятки. Вся команда пересекает комнату за 25 секунд.", points: 140, timeLimit: 25, emoji: "🚣" },
    ],
  },
];

const INITIAL_TEAMS: Team[] = [
  { id: "fire",   name: "Команда Огня",  emoji: "🔥", score: 0, color: "#ff6b35", borderStyle: { borderColor: "rgba(255,107,53,0.55)", boxShadow: "0 0 28px rgba(255,107,53,0.18)" }, glowStyle: { color: "#ff6b35", textShadow: "0 0 14px rgba(255,107,53,0.8)" } },
  { id: "ice",    name: "Команда Льда",  emoji: "❄️", score: 0, color: "#00d4ff", borderStyle: { borderColor: "rgba(0,212,255,0.55)",   boxShadow: "0 0 28px rgba(0,212,255,0.18)"   }, glowStyle: { color: "#00d4ff", textShadow: "0 0 14px rgba(0,212,255,0.8)"   } },
  { id: "forest", name: "Команда Леса",  emoji: "🌿", score: 0, color: "#4ade80", borderStyle: { borderColor: "rgba(74,222,128,0.55)",  boxShadow: "0 0 28px rgba(74,222,128,0.18)"  }, glowStyle: { color: "#4ade80", textShadow: "0 0 14px rgba(74,222,128,0.8)"  } },
  { id: "storm",  name: "Команда Грозы", emoji: "⚡", score: 0, color: "#facc15", borderStyle: { borderColor: "rgba(250,204,21,0.55)",  boxShadow: "0 0 28px rgba(250,204,21,0.18)"  }, glowStyle: { color: "#facc15", textShadow: "0 0 14px rgba(250,204,21,0.8)"  } },
];

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
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS.map(t => ({ ...t })));
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [phase, setPhase] = useState<"zone" | "topic" | "play" | "judge">("zone");
  const [timerKey, setTimerKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [roundNum, setRoundNum] = useState(1);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<CategoryTopic | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeTopic, setActiveTopic] = useState<CategoryTopic | "all">("all");

  const totalRounds = ZONES.length * 2;
  const activeTeam = teams[activeTeamIdx];

  function startGame() {
    setTeams(INITIAL_TEAMS.map(t => ({ ...t })));
    setActiveTeamIdx(0); setPhase("zone"); setCompletedIds(new Set());
    setRoundNum(1); setSelectedZone(null); setSelectedTopic(null); setSelectedQuest(null);
    setView("game");
  }

  function pickZone(zone: Zone) { setSelectedZone(zone); setPhase("topic"); setActiveTopic("all"); }

  function pickTopic(topic: CategoryTopic) { setSelectedTopic(topic); }

  function pickQuest(quest: Quest) {
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

  const topicQuests = selectedZone
    ? selectedZone.quests.filter(q => {
        if (completedIds.has(q.id)) return false;
        if (activeTopic === "all" || activeTopic === selectedTopic) return q.topic === (selectedTopic || activeTopic);
        if (activeTopic === "all") return true;
        return q.topic === activeTopic;
      })
    : [];

  const questsForTopic = selectedZone && selectedTopic
    ? selectedZone.quests.filter(q => !completedIds.has(q.id) && q.topic === selectedTopic)
    : [];

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
            {INITIAL_TEAMS.map(t => (
              <div key={t.id} className="magic-card p-3 text-center" style={t.borderStyle}>
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="font-cinzel font-bold text-xs" style={t.glowStyle}>{t.name}</div>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="btn-gold text-xl px-12 py-4 rounded-2xl font-cinzel font-bold tracking-wider pulse-glow">⚡ Начать Квест</button>
          <p className="text-white/30 text-sm font-golos">{ZONES.length} локаций · {ZONES.reduce((a, z) => a + z.quests.length, 0)} заданий</p>
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
              {ZONES.map(zone => {
                const done = zone.quests.filter(q => completedIds.has(q.id)).length;
                const total = zone.quests.length;
                const allDone = done === total;
                return (
                  <button
                    key={zone.id}
                    onClick={() => !allDone && pickZone(zone)}
                    disabled={allDone}
                    className={`magic-card p-4 text-center flex flex-col items-center gap-2 transition-all ${allDone ? "opacity-30 cursor-not-allowed" : "hover:scale-[1.03]"}`}
                    style={{ borderColor: `${zone.color}55`, boxShadow: `0 0 20px ${zone.color}15` }}
                  >
                    <span className="text-3xl">{zone.emoji}</span>
                    <span className="font-cinzel font-bold text-sm" style={{ color: zone.color }}>{zone.name}</span>
                    <div className="magic-progress w-full">
                      <div className="magic-progress-fill" style={{ width: `${(done / total) * 100}%`, background: zone.color }} />
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
                  <button
                    key={topic}
                    onClick={() => !isDone && pickTopic(topic)}
                    disabled={isDone}
                    className={`magic-card p-4 text-center flex flex-col items-center gap-2 transition-all ${isDone ? "opacity-30 cursor-not-allowed" : isActive ? "scale-105" : "hover:scale-[1.03]"}`}
                    style={isActive ? { borderColor: meta.color, boxShadow: `0 0 20px ${meta.color}40` } : {}}
                  >
                    <span className="text-3xl">{meta.emoji}</span>
                    <span className="font-golos font-bold text-sm leading-tight" style={{ color: meta.color }}>{meta.label}</span>
                    <span className="text-xs text-white/30 font-golos">{available.length} заданий</span>
                  </button>
                );
              })}
            </div>

            {/* Quest list for selected topic */}
            {selectedTopic && questsForTopic.length > 0 && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="magic-divider" />
                <p className="font-cormorant text-lg italic text-center text-yellow-100/60">Выберите задание:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {questsForTopic.map(quest => (
                    <button
                      key={quest.id}
                      onClick={() => pickQuest(quest)}
                      className="magic-card p-4 text-left hover:scale-[1.02] transition-all flex flex-col gap-2"
                      style={{ borderTopColor: TOPIC_META[quest.topic].color, borderTopWidth: 3 }}
                    >
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
