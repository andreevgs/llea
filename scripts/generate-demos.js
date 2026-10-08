import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demosDir = path.resolve(__dirname, "../public/demos");

if (!fs.existsSync(demosDir)) {
  fs.mkdirSync(demosDir, { recursive: true });
}

const now = new Date();
const hoursAgo = h => new Date(now.getTime() - h * 3600 * 1000).toISOString();
const daysAgo = (d, h = 0) => new Date(now.getTime() - (d * 24 + h) * 3600 * 1000).toISOString();

function calculateEssayPoints(totalSentences, cleanSentences, grammarEstimation, isTranslatorUsed) {
  const base = 2;
  const accuracyRatio = totalSentences > 0 ? cleanSentences / totalSentences : 0;
  const accuracyBonus = accuracyRatio * 4;
  const grammarBonus = (Math.max(0, Math.min(10, grammarEstimation)) / 10) * 4;
  const raw = base + accuracyBonus + grammarBonus;
  const mult = isTranslatorUsed ? 0.5 : 1.0;
  return Math.max(1, Math.round(raw * mult));
}

function buildProfile({ essays, dictionaryEntries }) {
  const essaysWithPoints = essays.map((essay) => {
    const cleanSentences = essay.analyzedSentences.length - essay.numOfSentencesWithMistakes;
    const earned = calculateEssayPoints(
      essay.analyzedSentences.length,
      cleanSentences,
      essay.grammarQuality.estimation,
      essay.isTranslatorUsed,
    );
    return {
      ...essay,
      earnedPoints: earned,
    };
  });

  return {
    currentLanguage: "ru",
    targetLanguage: "en",
    dictionaryEntries,
    essays: essaysWithPoints,
  };
}

// -------------------------------------------------------------
// PROFILE 1: beginner-5.llea (5 essays, red/struggling zone)
// -------------------------------------------------------------
const beginnerEssays = [
  {
    id: 1,
    text: "Hello! My name is Ivan and I from Moscow. Yesterday I go to supermarket for buy milk and bread. Weather was very cold and rain started. I come back home quick and drank hot tea with lemon. Today I want to learn more English words.",
    date: daysAgo(6, 4),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 3.5 },
    numOfMistakes: 5,
    numOfSentencesWithMistakes: 4,
    numOfWords: 43,
    analyzedSentences: [
      {
        sentence: "Hello! My name is Ivan and I from Moscow.",
        translation: "Привет! Меня зовут Иван, и я из Москвы.",
        mistakes: [{ type: "Verb to be", mistake: "Пропущен глагол-связка 'am': 'and I am from Moscow'" }],
        correctedSentence: "Hello! My name is Ivan and I am from Moscow.",
      },
      {
        sentence: "Yesterday I go to supermarket for buy milk and bread.",
        translation: "Вчера я пошел в супермаркет купить молока и хлеба.",
        mistakes: [
          { type: "Past Tense", mistake: "Неправильная форма глагола в прошедшем времени: 'went' вместо 'go'" },
          { type: "Infinitive of Purpose", mistake: "Для обозначения цели используется инфинитив 'to buy', а не 'for buy'" },
        ],
        correctedSentence: "Yesterday I went to the supermarket to buy milk and bread.",
      },
      {
        sentence: "Weather was very cold and rain started.",
        translation: "Погода была очень холодной, и пошел дождь.",
        mistakes: [{ type: "Article", mistake: "С существительным 'weather' нужен определенный артикль: 'The weather was...'" }],
        correctedSentence: "The weather was very cold and the rain started.",
      },
      {
        sentence: "I come back home quick and drank hot tea with lemon.",
        translation: "Я быстро вернулся домой и выпил горячего чая с лимоном.",
        mistakes: [{ type: "Adverb", mistake: "Требуется наречие 'quickly' вместо прилагательного 'quick'" }],
        correctedSentence: "I came back home quickly and drank hot tea with lemon.",
      },
      {
        sentence: "Today I want to learn more English words.",
        translation: "Сегодня я хочу выучить больше английских слов.",
        mistakes: [],
        correctedSentence: "Today I want to learn more English words.",
      },
    ],
  },
  {
    id: 2,
    text: "I have one brother and two sisters. My brother work in hospital as doctor. He like his job because he help sick people every day. In weekend we often visit our grandmother in village. We eat delicious pies and talking about childhood.",
    date: daysAgo(5, 2),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 4.0 },
    numOfMistakes: 4,
    numOfSentencesWithMistakes: 3,
    numOfWords: 44,
    analyzedSentences: [
      {
        sentence: "I have one brother and two sisters.",
        translation: "У меня один брат и две сестры.",
        mistakes: [],
        correctedSentence: "I have one brother and two sisters.",
      },
      {
        sentence: "My brother work in hospital as doctor.",
        translation: "Мой брат работает в больнице врачом.",
        mistakes: [
          { type: "Subject-Verb Agreement", mistake: "Для 3-го лица единственного числа нужно 'works'" },
          { type: "Article", mistake: "Пропущен артикль 'a doctor' и 'in a hospital'" },
        ],
        correctedSentence: "My brother works in a hospital as a doctor.",
      },
      {
        sentence: "He like his job because he help sick people every day.",
        translation: "Ему нравится его работа, потому что он каждый день помогает больным людям.",
        mistakes: [{ type: "Subject-Verb Agreement", mistake: "Окончание -s пропущено: 'He likes... he helps...'" }],
        correctedSentence: "He likes his job because he helps sick people every day.",
      },
      {
        sentence: "In weekend we often visit our grandmother in village.",
        translation: "На выходных мы часто навещаем нашу бабушку в деревне.",
        mistakes: [{ type: "Preposition & Article", mistake: "Правильно: 'At the weekend... in the village'" }],
        correctedSentence: "At the weekend we often visit our grandmother in the village.",
      },
      {
        sentence: "We eat delicious pies and talking about childhood.",
        translation: "Мы едим вкусные пироги и говорим о детстве.",
        mistakes: [{ type: "Parallel Structure", mistake: "Формы глаголов должны быть согласованы: 'eat and talk'" }],
        correctedSentence: "We eat delicious pies and talk about our childhood.",
      },
    ],
  },
  {
    id: 3,
    text: "My hobby is playing guitar and listen music. I started play when I was fifteen years old. Music make me feel happy when I am sad. Sometimes I play for my friends on birthday party. They say that I play good.",
    date: daysAgo(3, 8),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 3.5 },
    numOfMistakes: 4,
    numOfSentencesWithMistakes: 4,
    numOfWords: 42,
    analyzedSentences: [
      {
        sentence: "My hobby is playing guitar and listen music.",
        translation: "Мое хобби — играть на гитаре и слушать музыку.",
        mistakes: [{ type: "Gerund", mistake: "Нужен герундий для параллелизма: 'listening to music'" }],
        correctedSentence: "My hobby is playing the guitar and listening to music.",
      },
      {
        sentence: "I started play when I was fifteen years old.",
        translation: "Я начал играть, когда мне было пятнадцать лет.",
        mistakes: [{ type: "Verb complement", mistake: "После start используется инфинитив или герундий: 'started to play'" }],
        correctedSentence: "I started playing when I was fifteen years old.",
      },
      {
        sentence: "Music make me feel happy when I am sad.",
        translation: "Музыка делает меня счастливым, когда мне грустно.",
        mistakes: [{ type: "Subject-Verb Agreement", mistake: "Неисчисляемое существительное 'Music makes me...'" }],
        correctedSentence: "Music makes me feel happy when I am sad.",
      },
      {
        sentence: "Sometimes I play for my friends on birthday party.",
        translation: "Иногда я играю для друзей на вечеринке по случаю дня рождения.",
        mistakes: [{ type: "Preposition", mistake: "Используется предлог 'at': 'at birthday parties'" }],
        correctedSentence: "Sometimes I play for my friends at birthday parties.",
      },
      {
        sentence: "They say that I play good.",
        translation: "Они говорят, что я хорошо играю.",
        mistakes: [{ type: "Adverb", mistake: "Нужно наречие 'well', а не прилагательное 'good'" }],
        correctedSentence: "They say that I play well.",
      },
    ],
  },
  {
    id: 4,
    text: "Last summer I traveled to sea with my family. We swimming in sea every morning before breakfast. The sun was shine bright and water was warm. In evening we walked along the beach and watched beautiful sunset. It was best vacation.",
    date: daysAgo(2, 5),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 3.2 },
    numOfMistakes: 5,
    numOfSentencesWithMistakes: 4,
    numOfWords: 44,
    analyzedSentences: [
      {
        sentence: "Last summer I traveled to sea with my family.",
        translation: "Прошлым летом я поехал на море с семьей.",
        mistakes: [{ type: "Article", mistake: "Пропущен артикль: 'to the sea'" }],
        correctedSentence: "Last summer I traveled to the sea with my family.",
      },
      {
        sentence: "We swimming in sea every morning before breakfast.",
        translation: "Мы купались в море каждое утро перед завтраком.",
        mistakes: [{ type: "Past Continuous / Past Simple", mistake: "Пропущен глагол was/were или форма Past Simple: 'We swam in the sea'" }],
        correctedSentence: "We swam in the sea every morning before breakfast.",
      },
      {
        sentence: "The sun was shine bright and water was warm.",
        translation: "Солнце ярко светило, и вода была теплой.",
        mistakes: [{ type: "Continuous Form", mistake: "В Past Continuous требуется 'was shining brightly'" }],
        correctedSentence: "The sun was shining brightly and the water was warm.",
      },
      {
        sentence: "In evening we walked along the beach and watched beautiful sunset.",
        translation: "Вечером мы гуляли по пляжу и смотрели красивый закат.",
        mistakes: [{ type: "Articles", mistake: "Требуется 'In the evening' и 'a beautiful sunset'" }],
        correctedSentence: "In the evening we walked along the beach and watched a beautiful sunset.",
      },
      {
        sentence: "It was best vacation.",
        translation: "Это был лучший отпуск.",
        mistakes: [{ type: "Superlative", mistake: "Перед превосходной степенью необходим артикль 'the': 'the best vacation'" }],
        correctedSentence: "It was the best vacation.",
      },
    ],
  },
  {
    id: 5,
    text: "I like morning coffee because it wake me up. I always drink it without sugar with little milk. Then I go to work by bus and read book. Work day is usually busy but interesting. In evening I like cooking dinner for myself.",
    date: hoursAgo(5),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 4.2 },
    numOfMistakes: 4,
    numOfSentencesWithMistakes: 3,
    numOfWords: 42,
    analyzedSentences: [
      {
        sentence: "I like morning coffee because it wake me up.",
        translation: "Я люблю утренний кофе, потому что он меня будит.",
        mistakes: [{ type: "Subject-Verb Agreement", mistake: "Нужно окончание -s: 'it wakes me up'" }],
        correctedSentence: "I like morning coffee because it wakes me up.",
      },
      {
        sentence: "I always drink it without sugar with little milk.",
        translation: "Я всегда пью его без сахара с небольшим количеством молока.",
        mistakes: [{ type: "Determiner", mistake: "Для значения 'немного' используется 'a little milk'" }],
        correctedSentence: "I always drink it without sugar and with a little milk.",
      },
      {
        sentence: "Then I go to work by bus and read book.",
        translation: "Затем я еду на работу на автобусе и читаю книгу.",
        mistakes: [{ type: "Article", mistake: "Пропущен артикль: 'read a book'" }],
        correctedSentence: "Then I go to work by bus and read a book.",
      },
      {
        sentence: "Work day is usually busy but interesting.",
        translation: "Рабочий день обычно насыщенный, но интересный.",
        mistakes: [{ type: "Article", mistake: "Нужен артикль: 'The working day is...'" }],
        correctedSentence: "The working day is usually busy but interesting.",
      },
      {
        sentence: "In evening I like cooking dinner for myself.",
        translation: "Вечером мне нравится готовить ужин для себя.",
        mistakes: [],
        correctedSentence: "In the evening I like cooking dinner for myself.",
      },
    ],
  },
];

const beginnerDict = [
  { word: "supermarket", pronunciation: "[ˈsuːpəmɑːkɪt]", translation: "супермаркет", currentLanguage: "ru", targetLanguage: "en" },
  { word: "village", pronunciation: "[ˈvɪlɪdʒ]", translation: "деревня", currentLanguage: "ru", targetLanguage: "en" },
  { word: "delicious", pronunciation: "[dɪˈlɪʃəs]", translation: "очень вкусный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "guitar", pronunciation: "[ɡɪˈtɑːr]", translation: "гитара", currentLanguage: "ru", targetLanguage: "en" },
  { word: "childhood", pronunciation: "[ˈtʃaɪldhʊd]", translation: "детство", currentLanguage: "ru", targetLanguage: "en" },
  { word: "sunset", pronunciation: "[ˈsʌnset]", translation: "закат", currentLanguage: "ru", targetLanguage: "en" },
  { word: "vacation", pronunciation: "[vəˈkeɪʃn]", translation: "отпуск", currentLanguage: "ru", targetLanguage: "en" },
  { word: "hospital", pronunciation: "[ˈhɒspɪtl]", translation: "больница", currentLanguage: "ru", targetLanguage: "en" },
  { word: "quickly", pronunciation: "[ˈkwɪkli]", translation: "быстро", currentLanguage: "ru", targetLanguage: "en" },
  { word: "busy", pronunciation: "[ˈbɪzi]", translation: "занятой, насыщенный", currentLanguage: "ru", targetLanguage: "en" },
];

// -------------------------------------------------------------
// PROFILE 2: translator-assisted-5.llea (5 essays, 100% translator)
// -------------------------------------------------------------
const translatorEssays = [
  {
    id: 1,
    text: "Artificial intelligence has become an integral component of contemporary society. Modern algorithms assist professionals in healthcare, finance, and engineering with remarkable accuracy. Furthermore, machine learning models streamline repetitive workflows and enhance human decision-making. As this technological revolution unfolds, ethical considerations surrounding algorithmic transparency must remain a top priority.",
    date: daysAgo(4, 2),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 9.2 },
    numOfMistakes: 0,
    numOfSentencesWithMistakes: 0,
    numOfWords: 48,
    analyzedSentences: [
      {
        sentence: "Artificial intelligence has become an integral component of contemporary society.",
        translation: "Искусственный интеллект стал неотъемлемой частью современного общества.",
        mistakes: [],
        correctedSentence: "Artificial intelligence has become an integral component of contemporary society.",
      },
      {
        sentence: "Modern algorithms assist professionals in healthcare, finance, and engineering with remarkable accuracy.",
        translation: "Современные алгоритмы помогают специалистам в здравоохранении, финансах и инженерии с поразительной точностью.",
        mistakes: [],
        correctedSentence: "Modern algorithms assist professionals in healthcare, finance, and engineering with remarkable accuracy.",
      },
      {
        sentence: "Furthermore, machine learning models streamline repetitive workflows and enhance human decision-making.",
        translation: "Кроме того, модели машинного обучения оптимизируют рутинные процессы и улучшают принятие решений человеком.",
        mistakes: [],
        correctedSentence: "Furthermore, machine learning models streamline repetitive workflows and enhance human decision-making.",
      },
      {
        sentence: "As this technological revolution unfolds, ethical considerations surrounding algorithmic transparency must remain a top priority.",
        translation: "По мере развития этой технологической революции этические вопросы, связанные с прозрачностью алгоритмов, должны оставаться главным приоритетом.",
        mistakes: [],
        correctedSentence: "As this technological revolution unfolds, ethical considerations surrounding algorithmic transparency must remain a top priority.",
      },
    ],
  },
  {
    id: 2,
    text: "Urban architecture profoundly influences psychological well-being and social interaction. Thoughtfully designed public plazas foster community cohesion and encourage civic engagement. In contrast, monotonous concrete environments often exacerbate feelings of alienation among metropolitan residents. Incorporating green spaces into urban master plans creates vital sanctuaries for relaxation and mental rejuvenation.",
    date: daysAgo(3, 1),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 9.4 },
    numOfMistakes: 0,
    numOfSentencesWithMistakes: 0,
    numOfWords: 48,
    analyzedSentences: [
      {
        sentence: "Urban architecture profoundly influences psychological well-being and social interaction.",
        translation: "Городская архитектура оказывает глубокое влияние на психологическое благополучие и социальное взаимодействие.",
        mistakes: [],
        correctedSentence: "Urban architecture profoundly influences psychological well-being and social interaction.",
      },
      {
        sentence: "Thoughtfully designed public plazas foster community cohesion and encourage civic engagement.",
        translation: "Продуманно спроектированные общественные площади способствуют сплоченности сообщества и гражданской активности.",
        mistakes: [],
        correctedSentence: "Thoughtfully designed public plazas foster community cohesion and encourage civic engagement.",
      },
      {
        sentence: "In contrast, monotonous concrete environments often exacerbate feelings of alienation among metropolitan residents.",
        translation: "Напротив, монотонная бетонная среда часто усугубляет чувство отчуждения среди жителей мегаполисов.",
        mistakes: [],
        correctedSentence: "In contrast, monotonous concrete environments often exacerbate feelings of alienation among metropolitan residents.",
      },
      {
        sentence: "Incorporating green spaces into urban master plans creates vital sanctuaries for relaxation and mental rejuvenation.",
        translation: "Включение зеленых зон в генеральные планы городов создает жизненно важные убежища для отдыха и ментального восстановления.",
        mistakes: [],
        correctedSentence: "Incorporating green spaces into urban master plans creates vital sanctuaries for relaxation and mental rejuvenation.",
      },
    ],
  },
  {
    id: 3,
    text: "Renewable energy adoption represents an indispensable milestone in mitigating global climate change. Solar photovoltaic installations and offshore wind farms are expanding exponentially across industrialized nations. Although initial capital investments remain substantial, long-term operational expenditures continue to diminish steadily. Consequently, clean energy transitions generate sustainable economic growth while preserving fragile planetary ecosystems.",
    date: daysAgo(2, 6),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 9.0 },
    numOfMistakes: 0,
    numOfSentencesWithMistakes: 0,
    numOfWords: 49,
    analyzedSentences: [
      {
        sentence: "Renewable energy adoption represents an indispensable milestone in mitigating global climate change.",
        translation: "Внедрение возобновляемых источников энергии представляет собой незаменимую веху в смягчении последствий глобального изменения климата.",
        mistakes: [],
        correctedSentence: "Renewable energy adoption represents an indispensable milestone in mitigating global climate change.",
      },
      {
        sentence: "Solar photovoltaic installations and offshore wind farms are expanding exponentially across industrialized nations.",
        translation: "Солнечные фотоэлектрические установки и морские ветровые электростанции экспоненциально расширяются в промышленно развитых странах.",
        mistakes: [],
        correctedSentence: "Solar photovoltaic installations and offshore wind farms are expanding exponentially across industrialized nations.",
      },
      {
        sentence: "Although initial capital investments remain substantial, long-term operational expenditures continue to diminish steadily.",
        translation: "Хотя первоначальные капитальные инвестиции остаются значительными, долгосрочные операционные расходы продолжают неуклонно снижаться.",
        mistakes: [],
        correctedSentence: "Although initial capital investments remain substantial, long-term operational expenditures continue to diminish steadily.",
      },
      {
        sentence: "Consequently, clean energy transitions generate sustainable economic growth while preserving fragile planetary ecosystems.",
        translation: "Следовательно, переход на экологически чистую энергию способствует устойчивому экономическому росту, сохраняя при этом хрупкие экосистемы планеты.",
        mistakes: [],
        correctedSentence: "Consequently, clean energy transitions generate sustainable economic growth while preserving fragile planetary ecosystems.",
      },
    ],
  },
  {
    id: 4,
    text: "Literary fiction cultivates cognitive empathy by inviting readers into diverse cultural viewpoints. Engaging with complex narrative arcs encourages reflection on profound philosophical inquiries and human vulnerabilities. Through eloquent prose, authors illuminate subtle nuances of the human condition that empirical research frequently overlooks. Ultimately, literature enriches our internal lives and deepens mutual comprehension.",
    date: daysAgo(1, 4),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 9.3 },
    numOfMistakes: 0,
    numOfSentencesWithMistakes: 0,
    numOfWords: 48,
    analyzedSentences: [
      {
        sentence: "Literary fiction cultivates cognitive empathy by inviting readers into diverse cultural viewpoints.",
        translation: "Художественная литература развивает когнитивную эмпатию, приглашая читателей к разнообразным культурным взглядам.",
        mistakes: [],
        correctedSentence: "Literary fiction cultivates cognitive empathy by inviting readers into diverse cultural viewpoints.",
      },
      {
        sentence: "Engaging with complex narrative arcs encourages reflection on profound philosophical inquiries and human vulnerabilities.",
        translation: "Погружение в сложные сюжетные линии побуждает к размышлению о глубоких философских вопросах и человеческих уязвимостях.",
        mistakes: [],
        correctedSentence: "Engaging with complex narrative arcs encourages reflection on profound philosophical inquiries and human vulnerabilities.",
      },
      {
        sentence: "Through eloquent prose, authors illuminate subtle nuances of the human condition that empirical research frequently overlooks.",
        translation: "С помощью выразительной прозы авторы освещают тонкие нюансы человеческого бытия, которые часто упускаются эмпирическими исследованиями.",
        mistakes: [],
        correctedSentence: "Through eloquent prose, authors illuminate subtle nuances of the human condition that empirical research frequently overlooks.",
      },
      {
        sentence: "Ultimately, literature enriches our internal lives and deepens mutual comprehension.",
        translation: "В конечном счете литература обогащает наш внутренний мир и углубляет взаимопонимание.",
        mistakes: [],
        correctedSentence: "Ultimately, literature enriches our internal lives and deepens mutual comprehension.",
      },
    ],
  },
  {
    id: 5,
    text: "The global proliferation of remote work models has fundamentally altered traditional workplace dynamics. Geographic boundaries no longer constrain collaborative enterprises from assembling international talent. However, cultivating spontaneous camaraderie through virtual platforms presents notable logistical hurdles. Leaders must therefore establish deliberate rituals that support mental wellness and maintain corporate culture.",
    date: hoursAgo(3),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 9.1 },
    numOfMistakes: 0,
    numOfSentencesWithMistakes: 0,
    numOfWords: 48,
    analyzedSentences: [
      {
        sentence: "The global proliferation of remote work models has fundamentally altered traditional workplace dynamics.",
        translation: "Глобальное распространение моделей удаленной работы коренным образом изменило традиционную динамику рабочего места.",
        mistakes: [],
        correctedSentence: "The global proliferation of remote work models has fundamentally altered traditional workplace dynamics.",
      },
      {
        sentence: "Geographic boundaries no longer constrain collaborative enterprises from assembling international talent.",
        translation: "Географические границы больше не мешают совместным предприятиям объединять международные таланты.",
        mistakes: [],
        correctedSentence: "Geographic boundaries no longer constrain collaborative enterprises from assembling international talent.",
      },
      {
        sentence: "However, cultivating spontaneous camaraderie through virtual platforms presents notable logistical hurdles.",
        translation: "Однако поддержание спонтанного товарищества через виртуальные платформы сопряжено с заметными логистическими трудностями.",
        mistakes: [],
        correctedSentence: "However, cultivating spontaneous camaraderie through virtual platforms presents notable logistical hurdles.",
      },
      {
        sentence: "Leaders must therefore establish deliberate rituals that support mental wellness and maintain corporate culture.",
        translation: "Поэтому лидеры должны внедрять осознанные ритуалы, поддерживающие душевное благополучие и корпоративную культуру.",
        mistakes: [],
        correctedSentence: "Leaders must therefore establish deliberate rituals that support mental wellness and maintain corporate culture.",
      },
    ],
  },
];

const translatorDict = [
  { word: "proliferation", pronunciation: "[prəˌlɪf.əˈreɪ.ʃən]", translation: "быстрое распространение", currentLanguage: "ru", targetLanguage: "en" },
  { word: "camaraderie", pronunciation: "[ˌkæm.əˈrɑː.dər.i]", translation: "товарищество, взаимовыручка", currentLanguage: "ru", targetLanguage: "en" },
  { word: "sanctuary", pronunciation: "[ˈsæŋk.tʃʊə.ri]", translation: "убежище, тихий уголок", currentLanguage: "ru", targetLanguage: "en" },
  { word: "exacerbate", pronunciation: "[ɪɡˈzæs.ə.beɪt]", translation: "усугублять, обострять", currentLanguage: "ru", targetLanguage: "en" },
  { word: "indispensable", pronunciation: "[ˌɪn.dɪˈspen.sə.bəl]", translation: "незаменимый, обязательный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "eloquent", pronunciation: "[ˈel.ə.kwənt]", translation: "красноречивый, выразительный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "mitigate", pronunciation: "[ˈmɪt.ɪ.ɡeɪt]", translation: "смягчать, уменьшать", currentLanguage: "ru", targetLanguage: "en" },
];

// Helper to generate essays array
function createEssaysData() {
  const topics = [
    {
      title: "My favorite books",
      text: "Reading books has always been an essential pastime for me. Whenever I open an intriguing novel, I immerse myself completely into imaginary universes. Last month I finished reading a science fiction masterpiece about interstellar voyages. It provoked deep thoughts regarding our place in the cosmos and humanity's shared destiny.",
      estimation: 8.8,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Morning Routine",
      text: "Starting the day with clarity sets the tone for subsequent productivity. I typically awaken at sunrise and dedicate fifteen minutes to gentle meditation. Following that, I prepare nutritious oatmeal topped with fresh blueberries and sliced almonds. A brisk walk in the crisp morning air clears my head before work.",
      estimation: 8.6,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Traveling to Mountains",
      text: "Hiking in alpine regions offers unparalleled serenity and physical rejuvenation. The breathtaking panoramas reward hours of strenuous ascending along rocky paths. Standing on a summit surrounded by clouds instills a profound sense of humility. Clean mountain air invigorates both body and mind after months in bustling cities.",
      estimation: 8.7,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Learning Foreign Languages",
      text: "Mastering a foreign language requires consistent dedication and immense patience. Everyday practice helps memorize grammatical nuances and idiomatic colloquial expressions. Conversing with native speakers might feel intimidating initially, but it accelerates fluency exponentially. Each newly discovered word reveals fascinating cultural perspectives.",
      estimation: 8.9,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "The Power of Habits",
      text: "Small daily routines yield monumental transformations over prolonged periods. By reading ten pages every evening, one finishes dozens of literary works annually. Similarly, regular physical exercise bolsters long-term health and emotional stability. Discipline eventually transforms strenuous efforts into effortless automatic habits.",
      estimation: 8.5,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Culinary Experiments",
      text: "Cooking allows creative experimentation with diverse culinary traditions from around the globe. Combining aromatic spices like turmeric, cumin, and cardamom transforms humble ingredients into culinary feasts. Sharing a freshly prepared meal with beloved friends fosters intimate heartfelt conversations. Food truly connects people across cultural boundaries.",
      estimation: 8.4,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Urban Architecture",
      text: "Modern metropolitan skylines reflect architectural innovation and engineering prowess. Towering skyscrapers built from reinforced glass and steel dominate contemporary urban centers. However, historical districts with cobblestone lanes retain timeless romantic charm. Balancing modern development with architectural preservation is crucial for future generations.",
      estimation: 8.7,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Photography as Art",
      text: "Capturing transient fleeting moments through camera lenses teaches mindfulness and keen observation. Natural lighting plays a decisive role in defining emotional atmosphere and depth. Photographers often wander through quiet streets seeking authentic human expressions and geometric patterns. A single well-composed snapshot can evoke poignant memories for decades.",
      estimation: 8.9,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "Environmental Responsibility",
      text: "Protecting natural ecosystems requires collective responsibility and conscious individual choices. Reducing single-use plastic waste significantly alleviates environmental degradation in our oceans. Conserving water resources and supporting localized organic farming also contribute meaningfully. Sustainable living is not merely a modern trend, but an absolute necessity.",
      estimation: 8.8,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
    {
      title: "The Joy of Music",
      text: "Listening to orchestral symphonies evokes profound feelings beyond verbal communication. Harmonic interplay between string sections and resonant brass creates majestic auditory tapestries. Whether studying complex equations or relaxing after exhaustion, music provides emotional refuge. Artistic melodies possess universal resonance that transcends geographic divisions.",
      estimation: 9.1,
      isTrans: false,
      mistakesCount: 0,
      errorIdx: [],
    },
  ];
  return topics;
}

// -------------------------------------------------------------
// PROFILE 3: intermediate-10.llea (10 essays, medium/yellow zone)
// -------------------------------------------------------------
const intermediateEssays = [
  // 5 older essays (some translator, lower grammar)
  {
    id: 1,
    text: "I want describe my hometown today. It is small town located near beautiful river and green forests. Many people work in local factories and small shops. On weekends families gather in central park for picnic. I really like quiet atmosphere of this place.",
    date: daysAgo(12, 3),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 5.5 },
    numOfMistakes: 3,
    numOfSentencesWithMistakes: 3,
    numOfWords: 43,
    analyzedSentences: [
      {
        sentence: "I want describe my hometown today.",
        translation: "Сегодня я хочу описать свой родной город.",
        mistakes: [{ type: "Infinitive", mistake: "Пропущена частица 'to': 'I want to describe...'" }],
        correctedSentence: "I want to describe my hometown today.",
      },
      {
        sentence: "It is small town located near beautiful river and green forests.",
        translation: "Это небольшой город, расположенный рядом с красивой рекой и зелеными лесами.",
        mistakes: [{ type: "Article", mistake: "Пропущены артикли: 'a small town', 'a beautiful river'" }],
        correctedSentence: "It is a small town located near a beautiful river and green forests.",
      },
      {
        sentence: "Many people work in local factories and small shops.",
        translation: "Многие люди работают на местных фабриках и в небольших магазинах.",
        mistakes: [],
        correctedSentence: "Many people work in local factories and small shops.",
      },
      {
        sentence: "On weekends families gather in central park for picnic.",
        translation: "По выходным семьи собираются в центральном парке на пикник.",
        mistakes: [{ type: "Article", mistake: "Правильно: 'in the central park for a picnic'" }],
        correctedSentence: "On weekends families gather in the central park for a picnic.",
      },
      {
        sentence: "I really like quiet atmosphere of this place.",
        translation: "Мне очень нравится спокойная атмосфера этого места.",
        mistakes: [],
        correctedSentence: "I really like the quiet atmosphere of this place.",
      },
    ],
  },
  {
    id: 2,
    text: "Coffee culture became very popular in our society recently. Young people meet in cozy cafeterias to drink cappuccino and discuss project ideas. Baristas make creative patterns with milk foam on top. In my opinion, good cup of coffee can improve whole morning.",
    date: daysAgo(10, 4),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 6.0 },
    numOfMistakes: 2,
    numOfSentencesWithMistakes: 2,
    numOfWords: 43,
    analyzedSentences: [
      {
        sentence: "Coffee culture became very popular in our society recently.",
        translation: "Кофейная культура недавно стала очень популярной в нашем обществе.",
        mistakes: [{ type: "Present Perfect", mistake: "С 'recently' предпочтительнее Present Perfect: 'has become very popular'" }],
        correctedSentence: "Coffee culture has become very popular in our society recently.",
      },
      {
        sentence: "Young people meet in cozy cafeterias to drink cappuccino and discuss project ideas.",
        translation: "Молодые люди встречаются в уютных кафе, чтобы выпить капучино и обсудить идеи проектов.",
        mistakes: [],
        correctedSentence: "Young people meet in cozy cafeterias to drink cappuccino and discuss project ideas.",
      },
      {
        sentence: "Baristas make creative patterns with milk foam on top.",
        translation: "Бариста создают креативные узоры из молочной пены сверху.",
        mistakes: [],
        correctedSentence: "Baristas make creative patterns with milk foam on top.",
      },
      {
        sentence: "In my opinion, good cup of coffee can improve whole morning.",
        translation: "По моему мнению, хорошая чашка кофе может улучшить все утро.",
        mistakes: [{ type: "Article", mistake: "Пропущены артикли: 'a good cup of coffee', 'the whole morning'" }],
        correctedSentence: "In my opinion, a good cup of coffee can improve the whole morning.",
      },
    ],
  },
  {
    id: 3,
    text: "Yesterday I watched fascinating documentary movie about wildlife in Africa. Majestic lions were hunting across vast savannah during sunset. Elephant families walked slowly toward fresh waterhole to drink. Nature documentaries remind us how magnificent and fragile our planet is.",
    date: daysAgo(8, 2),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 6.8 },
    numOfMistakes: 2,
    numOfSentencesWithMistakes: 2,
    numOfWords: 40,
    analyzedSentences: [
      {
        sentence: "Yesterday I watched fascinating documentary movie about wildlife in Africa.",
        translation: "Вчера я посмотрел увлекательный документальный фильм о дикой природе в Африке.",
        mistakes: [{ type: "Article", mistake: "Пропущен неопределенный артикль: 'a fascinating documentary film'" }],
        correctedSentence: "Yesterday I watched a fascinating documentary film about wildlife in Africa.",
      },
      {
        sentence: "Majestic lions were hunting across vast savannah during sunset.",
        translation: "Величественные львы охотились по бескрайней саванне на закате.",
        mistakes: [{ type: "Article", mistake: "Нужен артикль 'the vast savannah'" }],
        correctedSentence: "Majestic lions were hunting across the vast savannah during sunset.",
      },
      {
        sentence: "Elephant families walked slowly toward fresh waterhole to drink.",
        translation: "Слоновьи семьи медленно шли к свежему водопою, чтобы напиться.",
        mistakes: [],
        correctedSentence: "Elephant families walked slowly toward a fresh waterhole to drink.",
      },
      {
        sentence: "Nature documentaries remind us how magnificent and fragile our planet is.",
        translation: "Документальные фильмы о природе напоминают нам, насколько великолепна и хрупка наша планета.",
        mistakes: [],
        correctedSentence: "Nature documentaries remind us how magnificent and fragile our planet is.",
      },
    ],
  },
  {
    id: 4,
    text: "Cycling to work became my new daily routine since last month. Not only it helps me save money on public transport, but also keeps me fit. Morning air gives energy for whole working day ahead. Sometimes rain causes inconvenience, but waterproof jacket solves this problem.",
    date: daysAgo(7, 5),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 6.5 },
    numOfMistakes: 2,
    numOfSentencesWithMistakes: 2,
    numOfWords: 43,
    analyzedSentences: [
      {
        sentence: "Cycling to work became my new daily routine since last month.",
        translation: "Поездки на работу на велосипеде стали моей новой рутиной с прошлого месяца.",
        mistakes: [{ type: "Tense with 'since'", mistake: "С 'since' требуется Present Perfect: 'has become my new daily routine'" }],
        correctedSentence: "Cycling to work has become my new daily routine since last month.",
      },
      {
        sentence: "Not only it helps me save money on public transport, but also keeps me fit.",
        translation: "Это не только помогает мне экономить на транспорте, но и держит в форме.",
        mistakes: [{ type: "Inversion", mistake: "После отрицательного наречия 'Not only' нужна инверсия: 'Not only does it help me...'" }],
        correctedSentence: "Not only does it help me save money on public transport, but it also keeps me fit.",
      },
      {
        sentence: "Morning air gives energy for whole working day ahead.",
        translation: "Утренний воздух дает энергию на весь предстоящий рабочий день.",
        mistakes: [],
        correctedSentence: "The morning air gives energy for the whole working day ahead.",
      },
      {
        sentence: "Sometimes rain causes inconvenience, but waterproof jacket solves this problem.",
        translation: "Иногда дождь доставляет неудобства, но непромокаемая куртка решает эту проблему.",
        mistakes: [],
        correctedSentence: "Sometimes rain causes inconvenience, but a waterproof jacket solves this problem.",
      },
    ],
  },
  {
    id: 5,
    text: "Cooking healthy dinner after exhausting day is great way to relax. I usually slice fresh vegetables and roast chicken with rosemary in oven. Delicious aromas fill entire apartment while I listen relaxing jazz music. Home cooked food tastes significantly better than fast food.",
    date: daysAgo(6, 1),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 6.8 },
    numOfMistakes: 2,
    numOfSentencesWithMistakes: 2,
    numOfWords: 44,
    analyzedSentences: [
      {
        sentence: "Cooking healthy dinner after exhausting day is great way to relax.",
        translation: "Приготовление полезного ужина после утомительного дня — отличный способ расслабиться.",
        mistakes: [{ type: "Article", mistake: "Пропущены артикли: 'a healthy dinner', 'an exhausting day', 'a great way'" }],
        correctedSentence: "Cooking a healthy dinner after an exhausting day is a great way to relax.",
      },
      {
        sentence: "I usually slice fresh vegetables and roast chicken with rosemary in oven.",
        translation: "Я обычно нарезаю свежие овощи и запекаю курицу с розмарином в духовке.",
        mistakes: [{ type: "Article", mistake: "Нужно: 'in the oven'" }],
        correctedSentence: "I usually slice fresh vegetables and roast chicken with rosemary in the oven.",
      },
      {
        sentence: "Delicious aromas fill entire apartment while I listen relaxing jazz music.",
        translation: "Восхитительные ароматы наполняют всю квартиру, пока я слушаю расслабляющий джаз.",
        mistakes: [],
        correctedSentence: "Delicious aromas fill the entire apartment while I listen to relaxing jazz music.",
      },
      {
        sentence: "Home cooked food tastes significantly better than fast food.",
        translation: "Домашняя еда значительно вкуснее фастфуда.",
        mistakes: [],
        correctedSentence: "Home-cooked food tastes significantly better than fast food.",
      },
    ],
  },
  // 5 newer essays
  {
    id: 6,
    text: "Visiting modern art galleries always provokes diverse emotional reactions. Contemporary installations challenge established perceptions through unusual materials and abstract forms. Although some exhibits appear confusing initially, reading artist statements clarifies their deeper intent. Art stimulates creative imagination and makes us question societal norms.",
    date: daysAgo(4, 3),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 7.2 },
    numOfMistakes: 1,
    numOfSentencesWithMistakes: 1,
    numOfWords: 43,
    analyzedSentences: [
      {
        sentence: "Visiting modern art galleries always provokes diverse emotional reactions.",
        translation: "Посещение галерей современного искусства всегда вызывает разнообразные эмоциональные реакции.",
        mistakes: [],
        correctedSentence: "Visiting modern art galleries always provokes diverse emotional reactions.",
      },
      {
        sentence: "Contemporary installations challenge established perceptions through unusual materials and abstract forms.",
        translation: "Современные инсталляции бросают вызов устоявшимся представлениям через необычные материалы и абстрактные формы.",
        mistakes: [],
        correctedSentence: "Contemporary installations challenge established perceptions through unusual materials and abstract forms.",
      },
      {
        sentence: "Although some exhibits appear confusing initially, reading artist statements clarifies their deeper intent.",
        translation: "Хотя некоторые экспонаты поначалу кажутся непонятными, чтение заявлений художников проясняет их глубокий замысел.",
        mistakes: [{ type: "Punctuation/Article", mistake: "Лучше 'the artists' statements'" }],
        correctedSentence: "Although some exhibits appear confusing initially, reading the artists' statements clarifies their deeper intent.",
      },
      {
        sentence: "Art stimulates creative imagination and makes us question societal norms.",
        translation: "Искусство стимулирует творческое воображение и заставляет нас подвергать сомнению общественные нормы.",
        mistakes: [],
        correctedSentence: "Art stimulates creative imagination and makes us question societal norms.",
      },
    ],
  },
  {
    id: 7,
    text: "Time management is essential skill for achieving balance between career and personal life. Prioritizing tasks according to urgency prevents unnecessary stress and mental exhaustion. Using digital calendar helps keep track of upcoming deadlines and meetings. Taking regular breaks during work hours maintains high concentration levels.",
    date: daysAgo(3, 4),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 7.0 },
    numOfMistakes: 2,
    numOfSentencesWithMistakes: 2,
    numOfWords: 45,
    analyzedSentences: [
      {
        sentence: "Time management is essential skill for achieving balance between career and personal life.",
        translation: "Тайм-менеджмент — важный навык для достижения баланса между карьерой и личной жизнью.",
        mistakes: [{ type: "Article", mistake: "Пропущен артикль 'an essential skill'" }],
        correctedSentence: "Time management is an essential skill for achieving balance between career and personal life.",
      },
      {
        sentence: "Prioritizing tasks according to urgency prevents unnecessary stress and mental exhaustion.",
        translation: "Расстановка приоритетов в задачах по срочности предотвращает лишний стресс и душевное истощение.",
        mistakes: [],
        correctedSentence: "Prioritizing tasks according to urgency prevents unnecessary stress and mental exhaustion.",
      },
      {
        sentence: "Using digital calendar helps keep track of upcoming deadlines and meetings.",
        translation: "Использование электронного календаря помогает следить за приближающимися дедлайнами и встречами.",
        mistakes: [{ type: "Article", mistake: "Нужно: 'Using a digital calendar'" }],
        correctedSentence: "Using a digital calendar helps keep track of upcoming deadlines and meetings.",
      },
      {
        sentence: "Taking regular breaks during work hours maintains high concentration levels.",
        translation: "Регулярные перерывы в рабочее время поддерживают высокий уровень концентрации.",
        mistakes: [],
        correctedSentence: "Taking regular breaks during work hours maintains high concentration levels.",
      },
    ],
  },
  {
    id: 8,
    text: "Learning how to play chess taught me valuable strategic thinking principles. Each move requires calculating multiple potential counteractions from your opponent. Impulsive decisions often lead to quick defeat, whereas patience brings victory. The game exemplifies that foresight and adaptability are key attributes in any competition.",
    date: daysAgo(2, 2),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: true,
    grammarQuality: { estimation: 6.8 },
    numOfMistakes: 1,
    numOfSentencesWithMistakes: 1,
    numOfWords: 45,
    analyzedSentences: [
      {
        sentence: "Learning how to play chess taught me valuable strategic thinking principles.",
        translation: "Обучение игре в шахматы научило меня ценным принципам стратегического мышления.",
        mistakes: [],
        correctedSentence: "Learning how to play chess taught me valuable strategic thinking principles.",
      },
      {
        sentence: "Each move requires calculating multiple potential counteractions from your opponent.",
        translation: "Каждый ход требует просчета множества возможных ответных действий соперника.",
        mistakes: [],
        correctedSentence: "Each move requires calculating multiple potential counteractions from your opponent.",
      },
      {
        sentence: "Impulsive decisions often lead to quick defeat, whereas patience brings victory.",
        translation: "Импульсивные решения часто приводят к быстрому поражению, тогда как терпение приносит победу.",
        mistakes: [{ type: "Article", mistake: "Лучше: 'to a quick defeat'" }],
        correctedSentence: "Impulsive decisions often lead to a quick defeat, whereas patience brings victory.",
      },
      {
        sentence: "The game exemplifies that foresight and adaptability are key attributes in any competition.",
        translation: "Игра наглядно показывает, что предусмотрительность и адаптивность — ключевые качества в любом соревновании.",
        mistakes: [],
        correctedSentence: "The game exemplifies that foresight and adaptability are key attributes in any competition.",
      },
    ],
  },
  {
    id: 9,
    text: "Public libraries are evolving into dynamic multimedia hubs for modern communities. Besides borrowing classic literature, visitors access online databases and attend public workshops. Quiet study rooms provide productive sanctuary away from noisy domestic environments. Preserving communal educational spaces remains vital in our increasingly digitalized world.",
    date: daysAgo(1, 1),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 7.4 },
    numOfMistakes: 1,
    numOfSentencesWithMistakes: 1,
    numOfWords: 44,
    analyzedSentences: [
      {
        sentence: "Public libraries are evolving into dynamic multimedia hubs for modern communities.",
        translation: "Публичные библиотеки превращаются в динамичные мультимедийные центры для современных сообществ.",
        mistakes: [],
        correctedSentence: "Public libraries are evolving into dynamic multimedia hubs for modern communities.",
      },
      {
        sentence: "Besides borrowing classic literature, visitors access online databases and attend public workshops.",
        translation: "Помимо классической литературы, посетители получают доступ к базам данных и посещают семинары.",
        mistakes: [],
        correctedSentence: "Besides borrowing classic literature, visitors access online databases and attend public workshops.",
      },
      {
        sentence: "Quiet study rooms provide productive sanctuary away from noisy domestic environments.",
        translation: "Тихие комнаты для занятий служат продуктивным убежищем от шумной домашней обстановки.",
        mistakes: [{ type: "Article", mistake: "Пропущен артикль 'a productive sanctuary'" }],
        correctedSentence: "Quiet study rooms provide a productive sanctuary away from noisy domestic environments.",
      },
      {
        sentence: "Preserving communal educational spaces remains vital in our increasingly digitalized world.",
        translation: "Сохранение общественных образовательных пространств жизненно важно в цифровизованном мире.",
        mistakes: [],
        correctedSentence: "Preserving communal educational spaces remains vital in our increasingly digitalized world.",
      },
    ],
  },
  {
    id: 10,
    text: "Volunteering at animal shelter gave me memorable and heartwarming experiences. Walking energetic dogs and socializing shy rescued cats brings immense emotional fulfillment. Dedicated shelter staff work tirelessly despite limited resources and funding. Small acts of compassion make tangible difference in lives of vulnerable creatures.",
    date: hoursAgo(4),
    currentLanguage: "ru",
    targetLanguage: "en",
    isTranslatorUsed: false,
    grammarQuality: { estimation: 7.2 },
    numOfMistakes: 2,
    numOfSentencesWithMistakes: 2,
    numOfWords: 43,
    analyzedSentences: [
      {
        sentence: "Volunteering at animal shelter gave me memorable and heartwarming experiences.",
        translation: "Волонтерство в приюте для животных подарило мне незабываемые и душевные впечатления.",
        mistakes: [{ type: "Article", mistake: "Пропущен артикль: 'at an animal shelter'" }],
        correctedSentence: "Volunteering at an animal shelter gave me memorable and heartwarming experiences.",
      },
      {
        sentence: "Walking energetic dogs and socializing shy rescued cats brings immense emotional fulfillment.",
        translation: "Прогулки с собаками и общение с кошками приносят огромное эмоциональное удовлетворение.",
        mistakes: [],
        correctedSentence: "Walking energetic dogs and socializing shy rescued cats brings immense emotional fulfillment.",
      },
      {
        sentence: "Dedicated shelter staff work tirelessly despite limited resources and funding.",
        translation: "Преданные сотрудники приюта неустанно трудятся, несмотря на ограниченные ресурсы.",
        mistakes: [],
        correctedSentence: "Dedicated shelter staff work tirelessly despite limited resources and funding.",
      },
      {
        sentence: "Small acts of compassion make tangible difference in lives of vulnerable creatures.",
        translation: "Маленькие проявления сострадания имеют ощутимое значение в жизни беззащитных существ.",
        mistakes: [{ type: "Article", mistake: "Нужно: 'make a tangible difference in the lives of...'" }],
        correctedSentence: "Small acts of compassion make a tangible difference in the lives of vulnerable creatures.",
      },
    ],
  },
];

const intermediateDict = [
  { word: "inconvenience", pronunciation: "[ˌɪnkənˈviːniəns]", translation: "неудобство, беспокойство", currentLanguage: "ru", targetLanguage: "en" },
  { word: "waterproof", pronunciation: "[ˈwɔːtəpruːf]", translation: "водонепроницаемый", currentLanguage: "ru", targetLanguage: "en" },
  { word: "exhausting", pronunciation: "[ɪɡˈzɔːstɪŋ]", translation: "изнурительный, утомительный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "prioritize", pronunciation: "[praɪˈɒrətaɪz]", translation: "расставлять приоритеты", currentLanguage: "ru", targetLanguage: "en" },
  { word: "foresight", pronunciation: "[ˈfɔːsaɪt]", translation: "предусмотрительность", currentLanguage: "ru", targetLanguage: "en" },
  { word: "adaptability", pronunciation: "[əˌdæptəˈbɪləti]", translation: "адаптивность, приспособляемость", currentLanguage: "ru", targetLanguage: "en" },
  { word: "compassion", pronunciation: "[kəmˈpæʃn]", translation: "сострадание, сочувствие", currentLanguage: "ru", targetLanguage: "en" },
  { word: "vulnerable", pronunciation: "[ˈvʌlnərəbl]", translation: "уязвимый, беззащитный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "fulfillment", pronunciation: "[fʊlˈfɪlmənt]", translation: "удовлетворение, реализация", currentLanguage: "ru", targetLanguage: "en" },
  { word: "tangible", pronunciation: "[ˈtændʒəbl]", translation: "ощутимый, осязаемый", currentLanguage: "ru", targetLanguage: "en" },
];

// -------------------------------------------------------------
// PROFILE 4: advanced-15.llea (15 essays, green/high accuracy zone)
// -------------------------------------------------------------
const advancedEssaysRaw = createEssaysData();
const advancedEssays = [
  ...intermediateEssays.slice(5).map((e, idx) => ({ ...e, id: idx + 1, date: daysAgo(14 - idx, 2) })),
  ...advancedEssaysRaw.map((t, idx) => {
    const sentences = t.text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    return {
      id: idx + 6,
      text: t.text,
      date: daysAgo(9 - Math.floor(idx * 0.9), (idx * 3) % 24),
      currentLanguage: "ru",
      targetLanguage: "en",
      isTranslatorUsed: idx === 1 || idx === 7 ? true : false,
      grammarQuality: { estimation: t.estimation },
      numOfMistakes: idx % 3 === 0 ? 1 : 0,
      numOfSentencesWithMistakes: idx % 3 === 0 ? 1 : 0,
      numOfWords: t.text.split(/\s+/).length,
      analyzedSentences: sentences.map((s, sIdx) => ({
        sentence: s,
        translation: `Перевод предложения: "${s}"`,
        mistakes: (idx % 3 === 0 && sIdx === 0) ? [{ type: "Style", mistake: "Minor stylistic nuance in preposition placement." }] : [],
        correctedSentence: s,
      })),
    };
  }),
];

const advancedDict = [
  ...intermediateDict,
  { word: "serenity", pronunciation: "[səˈrenəti]", translation: "безмятежность, умиротворение", currentLanguage: "ru", targetLanguage: "en" },
  { word: "rejuvenation", pronunciation: "[rɪˌdʒuːvəˈneɪʃn]", translation: "омоложение, восстановление сил", currentLanguage: "ru", targetLanguage: "en" },
  { word: "invigorate", pronunciation: "[ɪnˈvɪɡəreɪt]", translation: "бодрить, вдохновлять", currentLanguage: "ru", targetLanguage: "en" },
  { word: "monumental", pronunciation: "[ˌmɒnjuˈmentl]", translation: "колоссальный, грандиозный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "colloquial", pronunciation: "[kəˈləʊkwiəl]", translation: "разговорный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "culinary", pronunciation: "[ˈkʌlɪnəri]", translation: "кулинарный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "transient", pronunciation: "[ˈtrænziənt]", translation: "мимолетный, преходящий", currentLanguage: "ru", targetLanguage: "en" },
  { word: "poignant", pronunciation: "[ˈpɔɪnjənt]", translation: "пронзительный, трогательный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "alleviate", pronunciation: "[əˈliːvieɪt]", translation: "облегчать, смягчать", currentLanguage: "ru", targetLanguage: "en" },
  { word: "resilient", pronunciation: "[rɪˈzɪliənt]", translation: "устойчивый, жизнестойкий", currentLanguage: "ru", targetLanguage: "en" },
];

// -------------------------------------------------------------
// PROFILE 5: mastery-20.llea (20 essays, 100/100 points, perfect zone)
// -------------------------------------------------------------
const masteryEssays = [
  ...advancedEssays.slice(0, 10).map((e, idx) => ({ ...e, id: idx + 1, date: daysAgo(20 - idx, 2) })),
  ...advancedEssaysRaw.map((t, idx) => {
    const sentences = t.text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    return {
      id: idx + 11,
      text: t.text,
      date: daysAgo(9 - Math.floor(idx * 0.9), (idx * 2) % 24),
      currentLanguage: "ru",
      targetLanguage: "en",
      isTranslatorUsed: false,
      grammarQuality: { estimation: Math.min(10, t.estimation + 0.6) },
      numOfMistakes: idx === 3 ? 1 : 0,
      numOfSentencesWithMistakes: idx === 3 ? 1 : 0,
      numOfWords: t.text.split(/\s+/).length,
      analyzedSentences: sentences.map((s, sIdx) => ({
        sentence: s,
        translation: `Перевод предложения: "${s}"`,
        mistakes: (idx === 3 && sIdx === 0) ? [{ type: "Punctuation", mistake: "Optional comma before introductory phrase." }] : [],
        correctedSentence: s,
      })),
    };
  }),
];

const masteryDict = [
  ...advancedDict,
  { word: "serendipity", pronunciation: "[ˌserənˈdɪpəti]", translation: "счастливая случайность", currentLanguage: "ru", targetLanguage: "en" },
  { word: "ubiquitous", pronunciation: "[juːˈbɪkwɪtəs]", translation: "вездесущий, повсеместный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "ephemeral", pronunciation: "[ɪˈfemərəl]", translation: "эфемерный, недолговечный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "magnanimous", pronunciation: "[mæɡˈnænɪməs]", translation: "великодушный, благородный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "meticulous", pronunciation: "[məˈtɪkjələs]", translation: "скрупулезный, дотошный", currentLanguage: "ru", targetLanguage: "en" },
  { word: "eloquence", pronunciation: "[ˈeləkwəns]", translation: "красноречие, выразительность", currentLanguage: "ru", targetLanguage: "en" },
];

// -------------------------------------------------------------
// PROFILE 6: student-journey-20.llea (20 essays: 5 A1 -> 5 A2 -> 5 B1 -> 5 B2)
// -------------------------------------------------------------
const journeyEssays = [
  // 1-5: A1 with mistakes and translator
  ...beginnerEssays.map((e, idx) => ({ ...e, id: idx + 1, date: daysAgo(25 - idx * 2, 4) })),
  // 6-10: A2 intermediate
  ...intermediateEssays.slice(0, 5).map((e, idx) => ({ ...e, id: idx + 6, date: daysAgo(15 - idx * 2, 3) })),
  // 11-15: B1 developing
  ...intermediateEssays.slice(5).map((e, idx) => ({ ...e, id: idx + 11, date: daysAgo(7 - idx, 2) })),
  // 16-20: B2/C1 mastery
  ...advancedEssaysRaw.slice(0, 5).map((t, idx) => {
    const sentences = t.text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    return {
      id: idx + 16,
      text: t.text,
      date: daysAgo(2, idx * 5),
      currentLanguage: "ru",
      targetLanguage: "en",
      isTranslatorUsed: false,
      grammarQuality: { estimation: t.estimation },
      numOfMistakes: 0,
      numOfSentencesWithMistakes: 0,
      numOfWords: t.text.split(/\s+/).length,
      analyzedSentences: sentences.map(s => ({
        sentence: s,
        translation: `Перевод предложения: "${s}"`,
        mistakes: [],
        correctedSentence: s,
      })),
    };
  }),
];

const journeyDict = [
  ...beginnerDict,
  ...intermediateDict,
  ...masteryDict.slice(10, 20),
];

// Generate files
const profiles = [
  {
    filename: "beginner-5.llea",
    data: buildProfile({
      essays: beginnerEssays,
      dictionaryEntries: beginnerDict,
    }),
  },
  {
    filename: "translator-assisted-5.llea",
    data: buildProfile({
      essays: translatorEssays,
      dictionaryEntries: translatorDict,
    }),
  },
  {
    filename: "intermediate-10.llea",
    data: buildProfile({
      essays: intermediateEssays,
      dictionaryEntries: intermediateDict,
    }),
  },
  {
    filename: "advanced-15.llea",
    data: buildProfile({
      essays: advancedEssays,
      dictionaryEntries: advancedDict,
    }),
  },
  {
    filename: "mastery-20.llea",
    data: buildProfile({
      essays: masteryEssays,
      dictionaryEntries: masteryDict,
    }),
  },
  {
    filename: "student-journey-20.llea",
    data: buildProfile({
      essays: journeyEssays,
      dictionaryEntries: journeyDict,
    }),
  },
];

for (const profile of profiles) {
  const filePath = path.join(demosDir, profile.filename);
  fs.writeFileSync(filePath, JSON.stringify(profile.data, null, 2), "utf-8");
  const stats = fs.statSync(filePath);
  const totalPts = Math.min(100, profile.data.essays.reduce((s, e) => s + e.earnedPoints, 0));
  console.log(`Created ${profile.filename} (${(stats.size / 1024).toFixed(1)} KB, ${profile.data.essays.length} essays, ${totalPts} pts)`);
}

console.log("All showcase demo files generated successfully in public/demos/!");
