export const LESSONS = [
  {
    id: 'lesson-1',
    number: 1,
    titleNo: 'Leksjon 1: Hilsener & De første tallene (1–5)',
    themeNo: 'Hilsener og tall',
    level: 'beginner',
    summaryNo: 'Lær å si hei, snakke om deg selv, og telle fra 1 til 5. Grunnlaget for all kinesisk samtale.',
    characterIds: ['char-ni', 'char-hao', 'char-wo', 'char-ta1', 'char-ta2', 'char-yi', 'char-er', 'char-san', 'char-si', 'char-wu']
  },
  {
    id: 'lesson-2',
    number: 2,
    titleNo: 'Leksjon 2: Tall (6–10), "Ja/Nei" & Spørsmål',
    themeNo: 'Tall og enkle setninger',
    level: 'beginner',
    summaryNo: 'Fullfør tallene opp til 10, lær å bekrefte med 是 (å være), benekte med 不, og stille spørsmål med 吗.',
    characterIds: ['char-liu', 'char-qi', 'char-ba', 'char-jiu', 'char-shi', 'char-shi4', 'char-bu', 'char-ma', 'char-ne']
  },
  {
    id: 'lesson-3',
    number: 3,
    titleNo: 'Leksjon 3: Mennesker & Størrelse',
    themeNo: 'Mennesker og familie',
    level: 'beginner',
    summaryNo: 'Lær tegn for menneske, flertall (mennesker/vi), foreldre og de enkle motsetningene stor og liten.',
    characterIds: ['char-ren', 'char-men', 'char-ba4', 'char-ma1', 'char-peng', 'char-you', 'char-da', 'char-xiao']
  },
  {
    id: 'lesson-4',
    number: 4,
    titleNo: 'Leksjon 4: Mat & Drikke i hverdagen',
    themeNo: 'Måltider og smak',
    level: 'hsk1',
    summaryNo: 'Grunnleggende ord for å spise, drikke, te, vann og ris. Uunnværlig når du besøker en kinesisk restaurant.',
    characterIds: ['char-chi', 'char-he', 'char-cha', 'char-shui', 'char-mi', 'char-fan', 'char-guo']
  },
  {
    id: 'lesson-5',
    number: 5,
    titleNo: 'Leksjon 5: Tid, Dager & År',
    themeNo: 'Kalender og tid',
    level: 'hsk1',
    summaryNo: 'Lær hvordan kinesisk bygger opp datoer og tid: dag, sol, måned, år, i dag og i morgen.',
    characterIds: ['char-tian', 'char-ri', 'char-yue', 'char-nian', 'char-jin', 'char-ming', 'char-zuo']
  },
  {
    id: 'lesson-6',
    number: 6,
    titleNo: 'Leksjon 6: Hverdagsverb: Sanse & Gjøre',
    themeNo: 'Viktige handlingsverb',
    level: 'hsk1',
    summaryNo: 'Verbene du bruker hele tiden: å se, å høre, å snakke, å skrive, å gå og å komme.',
    characterIds: ['char-kan', 'char-ting', 'char-shuo', 'char-xie', 'char-qu', 'char-lai', 'char-xiang']
  },
  {
    id: 'lesson-7',
    number: 7,
    titleNo: 'Leksjon 7: Spørreord & Småord',
    themeNo: 'Spørsmål og forsterkere',
    level: 'hsk1',
    summaryNo: 'Hvordan spørre "hva" og "hvem", samt bruke ord som "veldig" (很) og "også" (也).',
    characterIds: ['char-shen', 'char-me', 'char-shei', 'char-na3', 'char-er2', 'char-hen', 'char-ye']
  },
  {
    id: 'lesson-8',
    number: 8,
    titleNo: 'Leksjon 8: Steder, Posisjon & Land',
    themeNo: 'Hvor ting befinner seg',
    level: 'hsk1',
    summaryNo: 'Snakk om å være et sted (在), hjemme (家), skolen, Kina, samt over (上) og under (下).',
    characterIds: ['char-zai', 'char-jia', 'char-xue', 'char-xiao4', 'char-zhong', 'char-guo2', 'char-shang', 'char-xia']
  }
];

export const CHARACTERS = {
  // --- LEKSJON 1 ---
  'char-ni': {
    id: 'char-ni',
    char: '你',
    pinyin: 'nǐ',
    tone: 3,
    meaningNo: 'du / deg',
    grammarNoteNo: 'Det vanligste personlige pronomenet for "du" i uformell eller normal tale.',
    explanationNo: 'Sammensatt av person-radikalet 亻 til venstre og 尔 til høyre. Betyr enkelt og greit "du".',
    exampleSentence: {
      hanzi: '你好！',
      pinyin: 'Nǐ hǎo!',
      meaningNo: 'Hei! (Bokstavelig: "Du har det bra!")'
    },
    strokesCount: 7,
    strokeSteps: ['丿 (skråstrek venstre)', '丨 (loddrett)', '丿 (skråstrek)', '㇇ (bøyd vannrett)', '亅 (krok)', 'ノ (liten skrå)', '丶 (prikk)'],
    radical: '亻 (person)',
    radicalMeaningNo: 'Viser at tegnet har med mennesker å gjøre',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-hao': {
    id: 'char-hao',
    char: '好',
    pinyin: 'hǎo',
    tone: 3,
    meaningNo: 'god / bra / fin',
    grammarNoteNo: 'Brukes både som adjektiv ("god") og som bekreftelse ("greit!", "OK!").',
    explanationNo: 'Kombinerer tegnet for kvinne (女) og barn (子). En mor med sitt barn symboliserer godhet og harmoni.',
    exampleSentence: {
      hanzi: '很好。',
      pinyin: 'Hěn hǎo.',
      meaningNo: 'Veldig bra.'
    },
    strokesCount: 6,
    strokeSteps: ['ㄑ (knekket strek)', '丿 (skråstrek)', '一 (vannrett)', '㇇ (kroket strek)', '亅 (loddrett krok)', '一 (vannrett gjennom)'],
    radical: '女 (kvinne)',
    radicalMeaningNo: 'Relatert til kvinne eller familie',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-wo': {
    id: 'char-wo',
    char: '我',
    pinyin: 'wǒ',
    tone: 3,
    meaningNo: 'jeg / meg',
    grammarNoteNo: 'Kinesisk bøyer ikke pronomen etter kasus: 我 betyr både "jeg" og "meg".',
    explanationNo: 'Historisk representerte tegnet et våpen (hånd som holder et spyd), symboliserte ens forsvar og selv.',
    exampleSentence: {
      hanzi: '我是挪威人。',
      pinyin: 'Wǒ shì nuówēirén.',
      meaningNo: 'Jeg er nordmann.'
    },
    strokesCount: 7,
    strokeSteps: ['丿 (skrå)', '一 (vannrett)', '亅 (loddrett med krok)', '提 (oppoverstrek)', '斜钩 (skråbue med krok)', '丿 (skrå)', '丶 (prikk)'],
    radical: '戈 (spyd / våpen)',
    radicalMeaningNo: 'Gammelt våpensymbol',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-ta1': {
    id: 'char-ta1',
    char: '他',
    pinyin: 'tā',
    tone: 1,
    meaningNo: 'han / ham',
    grammarNoteNo: 'Uttales helt likt som 她 (hun), men skrives med person-radikalet 亻.',
    explanationNo: 'Person (亻) + 也 (også). Betyr han eller ham.',
    exampleSentence: {
      hanzi: '他是老师。',
      pinyin: 'Tā shì lǎoshī.',
      meaningNo: 'Han er lærer.'
    },
    strokesCount: 5,
    strokeSteps: ['丿 (skrå venstre)', '丨 (loddrett)', '𠃌 (knekk)', '丨 (loddrett)', '乚 (bøyd strek)'],
    radical: '亻 (person)',
    radicalMeaningNo: 'Viser menneskelig tilknytning',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-ta2': {
    id: 'char-ta2',
    char: '她',
    pinyin: 'tā',
    tone: 1,
    meaningNo: 'hun / henne',
    grammarNoteNo: 'Har kvinne-radikalet 女 til venstre. Uttales tā med 1. tone (høy, jevn tone).',
    explanationNo: 'Kvinne (女) + 也. Betyr hun eller henne.',
    exampleSentence: {
      hanzi: '她很好。',
      pinyin: 'Tā hěn hǎo.',
      meaningNo: 'Hun har det veldig bra.'
    },
    strokesCount: 6,
    strokeSteps: ['ㄑ (knekk)', '丿 (skrå)', '一 (vannrett)', '𠃌 (vannrett knekk)', '丨 (loddrett)', '乚 (bøyd strek)'],
    radical: '女 (kvinne)',
    radicalMeaningNo: 'Tegn relatert til kvinner',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-yi': {
    id: 'char-yi',
    char: '一',
    pinyin: 'yī',
    tone: 1,
    meaningNo: 'én / 1',
    grammarNoteNo: 'Skifter tone naturlig i tale: 1. tone alene, 4. tone foran 1., 2. og 3. tone, 2. tone foran 4. tone.',
    explanationNo: 'Verdens enkleste tegn: én enkelt vannrett strek fra venstre mot høyre.',
    exampleSentence: {
      hanzi: '一个人。',
      pinyin: 'Yí ge rén.',
      meaningNo: 'Ett menneske / én person.'
    },
    strokesCount: 1,
    strokeSteps: ['一 (vannrett fra venstre til høyre)'],
    radical: '一 (en)',
    radicalMeaningNo: 'Enkel vannrett strek',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-er': {
    id: 'char-er',
    char: '二',
    pinyin: 'èr',
    tone: 4,
    meaningNo: 'to / 2',
    grammarNoteNo: 'Brukes ved telling. (Når man teller konkrete gjenstander med telleord, brukes ofte 两 liǎng).',
    explanationNo: 'To parallelle vannrette streker. Den øverste er litt kortere enn den nederste.',
    exampleSentence: {
      hanzi: '一，二，三。',
      pinyin: 'Yī, èr, sān.',
      meaningNo: 'En, to, tre.'
    },
    strokesCount: 2,
    strokeSteps: ['一 (kort vannrett øverst)', '一 (lengre vannrett nederst)'],
    radical: '二 (to)',
    radicalMeaningNo: 'To streker',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-san': {
    id: 'char-san',
    char: '三',
    pinyin: 'sān',
    tone: 1,
    meaningNo: 'tre / 3',
    grammarNoteNo: '1. tone – hold tonen høyt og flatt, som en lang sangtone.',
    explanationNo: 'Tre vannrette streker over hverandre. Den midterste er kortest, den nederste lengst.',
    exampleSentence: {
      hanzi: '三天。',
      pinyin: 'Sān tiān.',
      meaningNo: 'Tre dager.'
    },
    strokesCount: 3,
    strokeSteps: ['一 (øverste strek)', '一 (midtre kortere strek)', '一 (nederste lengste strek)'],
    radical: '一 (en)',
    radicalMeaningNo: 'Telle-strek',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-si': {
    id: 'char-si',
    char: '四',
    pinyin: 'sì',
    tone: 4,
    meaningNo: 'fire / 4',
    grammarNoteNo: '4. tone – fallende, kontant som når du sier et bestemt "Nei!".',
    explanationNo: 'En ramme (boks) med to gardiner inni.',
    exampleSentence: {
      hanzi: '四个月。',
      pinyin: 'Sì ge yuè.',
      meaningNo: 'Fire måneder.'
    },
    strokesCount: 5,
    strokeSteps: ['丨 (venstre kant)', '𠃍 (topp og høyre kant)', '丿 (bue inni)', '乚 (knekk inni)', '一 (lukk bunnen)'],
    radical: '囗 (omsluttende ramme)',
    radicalMeaningNo: 'En lukket ramme',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },
  'char-wu': {
    id: 'char-wu',
    char: '五',
    pinyin: 'wǔ',
    tone: 3,
    meaningNo: 'fem / 5',
    grammarNoteNo: '3. tone – stemmen synker dypt før den stiger lett igjen.',
    explanationNo: 'Tegn for tallet fem. Kan minne om en person i bevegelse eller en stabil femmer.',
    exampleSentence: {
      hanzi: '星期五。',
      pinyin: 'Xīngqīwǔ.',
      meaningNo: 'Fredag (Ukedag 5).'
    },
    strokesCount: 4,
    strokeSteps: ['一 (toppstrek)', '丨 (skrå/loddrett midtstrek)', '𠃍 (høyre knekk)', '一 (bunnstrek)'],
    radical: '二 (to)',
    radicalMeaningNo: 'Vannrette linjer',
    hskLevel: 1,
    lessonId: 'lesson-1'
  },

  // --- LEKSJON 2 ---
  'char-liu': {
    id: 'char-liu',
    char: '六',
    pinyin: 'liù',
    tone: 4,
    meaningNo: 'seks / 6',
    grammarNoteNo: 'I kinesisk kultur er 6 et veldig lykketall som symboliserer at alt går glatt!',
    explanationNo: 'En prikk og vannrett strek på toppen, og to "ben" under.',
    exampleSentence: {
      hanzi: '六点。',
      pinyin: 'Liù diǎn.',
      meaningNo: 'Klokken seks.'
    },
    strokesCount: 4,
    strokeSteps: ['丶 (toppprikk)', '一 (vannrett)', '丿 (venstre ben)', '丶 (høyre prikk)'],
    radical: '八 (åtte/dele)',
    radicalMeaningNo: 'Spredte streker',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-qi': {
    id: 'char-qi',
    char: '七',
    pinyin: 'qī',
    tone: 1,
    meaningNo: 'syv / 7',
    grammarNoteNo: 'Uttales litt som "tji" med høy 1. tone.',
    explanationNo: 'En vannrett strek krysset av en loddrett krok som bøyer seg opp mot høyre.',
    exampleSentence: {
      hanzi: '七天。',
      pinyin: 'Qī tiān.',
      meaningNo: 'Syv dager (en uke).'
    },
    strokesCount: 2,
    strokeSteps: ['一 (skrå vannrett)', '乚 (loddrett med bue/krok til høyre)'],
    radical: '一 (en)',
    radicalMeaningNo: 'Enkelt tegn',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-ba': {
    id: 'char-ba',
    char: '八',
    pinyin: 'bā',
    tone: 1,
    meaningNo: 'åtte / 8',
    grammarNoteNo: 'Det aller største lykketallet i Kina fordi det rimer på 發 fā (velstand og rikdom).',
    explanationNo: 'To streker som åpner seg nedover, nesten som et telt eller en vulkan.',
    exampleSentence: {
      hanzi: '八月。',
      pinyin: 'Bā yuè.',
      meaningNo: 'August (måned 8).'
    },
    strokesCount: 2,
    strokeSteps: ['丿 (skråstrek mot venstre)', '乀 (skråstrek mot høyre)'],
    radical: '八 (åtte)',
    radicalMeaningNo: 'Dele eller spre',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-jiu': {
    id: 'char-jiu',
    char: '九',
    pinyin: 'jiǔ',
    tone: 3,
    meaningNo: 'ni / 9',
    grammarNoteNo: 'Assosieres med keiseren og evighet (lyder likt som 久 jiǔ, "lang tid").',
    explanationNo: 'Starter med en buet skråstrek til venstre, etterfulgt av en knekk-krok.',
    exampleSentence: {
      hanzi: '九个人。',
      pinyin: 'Jiǔ ge rén.',
      meaningNo: 'Ni personer.'
    },
    strokesCount: 2,
    strokeSteps: ['丿 (skråstrek ned mot venstre)', '横折弯钩 (vannrett med bøy og oppoverkrok)'],
    radical: '丿 (skråstrek)',
    radicalMeaningNo: 'Enkelt tegn',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-shi': {
    id: 'char-shi',
    char: '十',
    pinyin: 'shí',
    tone: 2,
    meaningNo: 'ti / 10',
    grammarNoteNo: '2. tone – stigende tone, som når du undrer "hæ?" på norsk.',
    explanationNo: 'Et enkelt pluss-tegn. Symboliserer fullstendighet i alle fire himmelretninger.',
    exampleSentence: {
      hanzi: '十分好。',
      pinyin: 'Shífēn hǎo.',
      meaningNo: 'Helt utmerket / ti av ti.'
    },
    strokesCount: 2,
    strokeSteps: ['一 (vannrett)', '丨 (loddrett gjennom midten)'],
    radical: '十 (ti)',
    radicalMeaningNo: 'Kors/ti',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-shi4': {
    id: 'char-shi4',
    char: '是',
    pinyin: 'shì',
    tone: 4,
    meaningNo: 'er / å være / ja (bekreftende)',
    grammarNoteNo: 'Knytter sammen to substantiv: "A 是 B" (A er B). Bøyes aldri i tid eller person!',
    explanationNo: 'Sol (日) øverst og rett/stødig (疋) nederst. Betyr "det som er rett og sant".',
    exampleSentence: {
      hanzi: '我是学生。',
      pinyin: 'Wǒ shì xuésheng.',
      meaningNo: 'Jeg er student.'
    },
    strokesCount: 9,
    strokeSteps: ['丨 (ramme)', '𠃍 (knekk)', '一 (innmat)', '一 (lukk sol)', '一 (vannrett)', '丨 (loddrett)', '一 (kort vannrett)', '丿 (skrå venstre)', '乀 (lang støtte høyre)'],
    radical: '日 (sol/dag)',
    radicalMeaningNo: 'Knyttet til sannhet og lys',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-bu': {
    id: 'char-bu',
    char: '不',
    pinyin: 'bù',
    tone: 4,
    meaningNo: 'ikke / nei (benektelse)',
    grammarNoteNo: 'Settes rett foran verbet: 不去 (går ikke), 不是 (er ikke). Skifter til 2. tone (bú) foran en annen 4. tone.',
    explanationNo: 'Ligner en fugl som flyr opp mot himmelen og forsvinner.',
    exampleSentence: {
      hanzi: '我不去。',
      pinyin: 'Wǒ bú qù.',
      meaningNo: 'Jeg drar ikke.'
    },
    strokesCount: 4,
    strokeSteps: ['一 (vannrett topp)', '丿 (skrå venstre)', '丨 (loddrett)', '丶 (prikk til høyre)'],
    radical: '一 (en)',
    radicalMeaningNo: 'Benektelsespartikkel',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-ma': {
    id: 'char-ma',
    char: '吗',
    pinyin: 'ma',
    tone: 5,
    meaningNo: 'spørrepartikkel (gjør påstand til ja/nei-spørsmål)',
    grammarNoteNo: 'Nøytral tone (lett og kort). Sett det i slutten av enhver setning for å lage et spørsmål!',
    explanationNo: 'Munn (口) + hest (马). Du bruker munnen til å spørre.',
    exampleSentence: {
      hanzi: '你好吗？',
      pinyin: 'Nǐ hǎo ma?',
      meaningNo: 'Hvordan har du det? (Har du det bra?)'
    },
    strokesCount: 6,
    strokeSteps: ['丨 (munn)', '𠃍 (munnknekk)', '一 (lukk munn)', '𠃌 (hestens nakke)', '一 (hestens rygg)', '一 (hestens base)'],
    radical: '口 (munn)',
    radicalMeaningNo: 'Relatert til tale og lyd',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },
  'char-ne': {
    id: 'char-ne',
    char: '呢',
    pinyin: 'ne',
    tone: 5,
    meaningNo: 'hva med...? (oppfølgingsspørsmål)',
    grammarNoteNo: 'Kort og nøytral tone. "我很好，你呢？" = "Jeg har det bra, hva med deg?"',
    explanationNo: 'Munn (口) + 尼. Brukes for lette, naturlige motspørsmål.',
    exampleSentence: {
      hanzi: '你呢？',
      pinyin: 'Nǐ ne?',
      meaningNo: 'Hva med deg?'
    },
    strokesCount: 8,
    strokeSteps: ['丨 (munn)', '𠃍', '一', '尸-topp', '丿', '匕-deler'],
    radical: '口 (munn)',
    radicalMeaningNo: 'Tale og utbrudd',
    hskLevel: 1,
    lessonId: 'lesson-2'
  },

  // --- LEKSJON 3 ---
  'char-ren': {
    id: 'char-ren',
    char: '人',
    pinyin: 'rén',
    tone: 2,
    meaningNo: 'menneske / person / folk',
    grammarNoteNo: 'Sett land foran for å angi nasjonalitet: 挪威人 (nordmann), 中国人 (kineser).',
    explanationNo: 'Avbilder et menneske sett fra siden med to gående ben.',
    exampleSentence: {
      hanzi: '中国人。',
      pinyin: 'Zhōngguórén.',
      meaningNo: 'En kineser / kinesisk person.'
    },
    strokesCount: 2,
    strokeSteps: ['丿 (første ben mot venstre)', '乀 (støtteben mot høyre)'],
    radical: '人 (menneske)',
    radicalMeaningNo: 'Menneske',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-men': {
    id: 'char-men',
    char: '们',
    pinyin: 'men',
    tone: 5,
    meaningNo: 'flertallsending for personer',
    grammarNoteNo: 'Vi: 我们 (wǒmen), Dere: 你们 (nǐmen), De: 他们 (tāmen).',
    explanationNo: 'Person (亻) foran en port (门). Mange personer samlet ved døren.',
    exampleSentence: {
      hanzi: '我们是朋友。',
      pinyin: 'Wǒmen shì péngyou.',
      meaningNo: 'Vi er venner.'
    },
    strokesCount: 5,
    strokeSteps: ['丿 (person)', '丨 (loddrett)', '丶 (dørprikk)', '丨 (dørstolpe)', '𠃌 (portramme)'],
    radical: '亻 (person)',
    radicalMeaningNo: 'Menneskegruppe',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-ba4': {
    id: 'char-ba4',
    char: '爸',
    pinyin: 'bà',
    tone: 4,
    meaningNo: 'pappa / far',
    grammarNoteNo: 'Gjentas ofte som 爸爸 (bàba) i dagligtale.',
    explanationNo: 'Far-tegnet (父) på toppen, og fonetisk 巴 under.',
    exampleSentence: {
      hanzi: '我爸爸很好。',
      pinyin: 'Wǒ bàba hěn hǎo.',
      meaningNo: 'Pappaen min har det veldig bra.'
    },
    strokesCount: 8,
    strokeSteps: ['丿 (far topp)', '丶', '丿', '乀', '𠃍 (ba del)', '丨', '一', '乚'],
    radical: '父 (far)',
    radicalMeaningNo: 'Patriark eller far',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-ma1': {
    id: 'char-ma1',
    char: '妈',
    pinyin: 'mā',
    tone: 1,
    meaningNo: 'mamma / mor',
    grammarNoteNo: 'Gjentas til 妈妈 (māma). 1. tone (høy og jevn).',
    explanationNo: 'Kvinne (女) som betyr mor, og hest (马) som gir lyden "ma".',
    exampleSentence: {
      hanzi: '这是我妈妈。',
      pinyin: 'Zhè shì wǒ māma.',
      meaningNo: 'Dette er mammaen min.'
    },
    strokesCount: 6,
    strokeSteps: ['ㄑ (kvinne-bue)', '丿', '一', '𠃌 (hest)', '一', '一'],
    radical: '女 (kvinne)',
    radicalMeaningNo: 'Kvinnelig slektning',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-peng': {
    id: 'char-peng',
    char: '朋',
    pinyin: 'péng',
    tone: 2,
    meaningNo: 'venn (første tegn i "venn")',
    grammarNoteNo: 'Brukes nesten alltid sammen med 友 i ordet 朋友 (péngyou).',
    explanationNo: 'To måner (月) side om side. To venner som følger hverandre som måner på himmelen.',
    exampleSentence: {
      hanzi: '好朋友。',
      pinyin: 'Hǎo péngyou.',
      meaningNo: 'God venn.'
    },
    strokesCount: 8,
    strokeSteps: ['丿 (første måne)', '𠃌', '一', '一', '丿 (andre måne)', '𠃌', '一', '一'],
    radical: '月 (måne)',
    radicalMeaningNo: 'Måne eller kjøtt/kropp',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-you': {
    id: 'char-you',
    char: '友',
    pinyin: 'yǒu',
    tone: 3,
    meaningNo: 'vennskap / venn',
    grammarNoteNo: 'Sammen med 朋 danner det 朋友 (péngyou).',
    explanationNo: 'Opprinnelig to hender som strekker seg mot hverandre i vennskap.',
    exampleSentence: {
      hanzi: '他们是朋友。',
      pinyin: 'Tāmen shì péngyou.',
      meaningNo: 'De er venner.'
    },
    strokesCount: 4,
    strokeSteps: ['一 (vannrett)', '丿 (lang skrå)', '㇇ (knekk)', '乀 (skråstøtte)'],
    radical: '又 (hånd/igjen)',
    radicalMeaningNo: 'Håndbevegelse',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-da': {
    id: 'char-da',
    char: '大',
    pinyin: 'dà',
    tone: 4,
    meaningNo: 'stor',
    grammarNoteNo: 'Motsatsen til 小 (xiǎo). Stor person: 大人 (voksen).',
    explanationNo: 'Et menneske (人) som strekker armene helt ut til siden for å vise hvor STOR noe er.',
    exampleSentence: {
      hanzi: '很大。',
      pinyin: 'Hěn dà.',
      meaningNo: 'Veldig stor.'
    },
    strokesCount: 3,
    strokeSteps: ['一 (utstrakte armer)', '丿 (venstre ben)', '乀 (høyre ben)'],
    radical: '大 (stor)',
    radicalMeaningNo: 'Stort / menneske med armer ut',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },
  'char-xiao': {
    id: 'char-xiao',
    char: '小',
    pinyin: 'xiǎo',
    tone: 3,
    meaningNo: 'liten',
    grammarNoteNo: 'Motsatsen til 大 (dà). Brukes også kjærlig foran navn (f.eks. 小王).',
    explanationNo: 'En strek i midten delt i to bittesmå deler på hver side.',
    exampleSentence: {
      hanzi: '很小。',
      pinyin: 'Hěn xiǎo.',
      meaningNo: 'Veldig liten.'
    },
    strokesCount: 3,
    strokeSteps: ['亅 (krok i midten)', '丿 (liten prikk venstre)', '丶 (liten prikk høyre)'],
    radical: '小 (liten)',
    radicalMeaningNo: 'Liten',
    hskLevel: 1,
    lessonId: 'lesson-3'
  },

  // --- LEKSJON 4 ---
  'char-chi': {
    id: 'char-chi',
    char: '吃',
    pinyin: 'chī',
    tone: 1,
    meaningNo: 'å spise',
    grammarNoteNo: 'Settes rett foran maten: 吃饭 (spise mat/ris), 吃苹果 (spise eple).',
    explanationNo: 'Munn-radikalet (口) til venstre. Du spiser med munnen!',
    exampleSentence: {
      hanzi: '你吃什么？',
      pinyin: 'Nǐ chī shénme?',
      meaningNo: 'Hva spiser du?'
    },
    strokesCount: 6,
    strokeSteps: ['丨 (munn)', '𠃍', '一', '丿', '一', '乙 (krok)'],
    radical: '口 (munn)',
    radicalMeaningNo: 'Spise/munn',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },
  'char-he': {
    id: 'char-he',
    char: '喝',
    pinyin: 'hē',
    tone: 1,
    meaningNo: 'å drikke',
    grammarNoteNo: 'Kombineres med væsker: 喝茶 (drikke te), 喝水 (drikke vann).',
    explanationNo: 'Har også munn (口) til venstre, for du drikker med munnen.',
    exampleSentence: {
      hanzi: '我想喝茶。',
      pinyin: 'Wǒ xiǎng hē chá.',
      meaningNo: 'Jeg har lyst til å drikke te.'
    },
    strokesCount: 12,
    strokeSteps: ['口-radikal til venstre', 'Sol (日) øverst', 'Solen kaster lys over en person som tørster'],
    radical: '口 (munn)',
    radicalMeaningNo: 'Drikke',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },
  'char-cha': {
    id: 'char-cha',
    char: '茶',
    pinyin: 'chá',
    tone: 2,
    meaningNo: 'te',
    grammarNoteNo: 'Ordet "te" i nesten alle verdens språk stammer enten fra dette tegnet (chá) eller fra kystdialekten i Fujian (tê).',
    explanationNo: 'Gress-radikalet (艹) på toppen, et tak (人) og tre (木) under. Te vokser som planter i naturen.',
    exampleSentence: {
      hanzi: '中国茶很好喝。',
      pinyin: 'Zhōngguó chá hěn hǎohē.',
      meaningNo: 'Kinesisk te smaker kjempegodt.'
    },
    strokesCount: 9,
    strokeSteps: ['艹 (gress/plante-topp)', '人 (tak/menneske)', '木 (treverk/greiner)'],
    radical: '艹 (gress/planter)',
    radicalMeaningNo: 'Botanisk plante',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },
  'char-shui': {
    id: 'char-shui',
    char: '水',
    pinyin: 'shuǐ',
    tone: 3,
    meaningNo: 'vann',
    grammarNoteNo: '3. tone – synker og stiger. Varmt vann: 热水 (rèshuǐ).',
    explanationNo: 'Piktogram av en strømmende elv med krusninger i vannet på begge sider.',
    exampleSentence: {
      hanzi: '请喝水。',
      pinyin: 'Qǐng hē shuǐ.',
      meaningNo: 'Vær så god, drikk litt vann.'
    },
    strokesCount: 4,
    strokeSteps: ['亅 (midtstrøm med krok)', '㇇ (venstre bølge)', '丿 (høyre skråbølge)', '乀 (høyre bunnbølge)'],
    radical: '水 (vann)',
    radicalMeaningNo: 'Væske',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },
  'char-mi': {
    id: 'char-mi',
    char: '米',
    pinyin: 'mǐ',
    tone: 3,
    meaningNo: 'ris (ukokte korn) / meter',
    grammarNoteNo: 'Kombineres med 饭 til 米饭 (kokt ris).',
    explanationNo: 'Avbilder riskorn som spres rundt en stilk i krysset.',
    exampleSentence: {
      hanzi: '我买米。',
      pinyin: 'Wǒ mǎi mǐ.',
      meaningNo: 'Jeg kjøper ris.'
    },
    strokesCount: 6,
    strokeSteps: ['丶 (prikk venstre)', '丿 (skrå høyre)', '一 (vannrett)', '丨 (loddrett)', '丿 (ben venstre)', '乀 (ben høyre)'],
    radical: '米 (ris)',
    radicalMeaningNo: 'Korn og matvarer',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },
  'char-fan': {
    id: 'char-fan',
    char: '饭',
    pinyin: 'fàn',
    tone: 4,
    meaningNo: 'kokt ris / måltid / mat',
    grammarNoteNo: '吃饭 (chī fàn) betyr både "å spise ris" og mer generelt "å spise et måltid".',
    explanationNo: 'Mat-radikalet (饣) til venstre viser at det er spiselige saker.',
    exampleSentence: {
      hanzi: '吃饭了吗？',
      pinyin: 'Chī fàn le ma?',
      meaningNo: 'Har du spist? (Klassisk kinesisk hilsen som betyr "hvordan står det til?")'
    },
    strokesCount: 7,
    strokeSteps: ['饣 (mat-radikal venstre)', '丿 (skrå)', '㇇', '乀 (bunn)'],
    radical: '饣 (mat)',
    radicalMeaningNo: 'Ernæring og matvarer',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },
  'char-guo': {
    id: 'char-guo',
    char: '果',
    pinyin: 'guǒ',
    tone: 3,
    meaningNo: 'frukt / resultat',
    grammarNoteNo: 'Frukt generelt: 水果 (shuǐguǒ). Eple: 苹果 (píngguǒ).',
    explanationNo: 'Et tre (木) med rund frukt (日/田) som henger på toppen.',
    exampleSentence: {
      hanzi: '吃水果。',
      pinyin: 'Chī shuǐguǒ.',
      meaningNo: 'Spise frukt.'
    },
    strokesCount: 8,
    strokeSteps: ['Boks øverst (frukten)', 'Gjennomgående loddrett', 'Tre-greiner (木) nederst'],
    radical: '木 (tre)',
    radicalMeaningNo: 'Trær og vekster',
    hskLevel: 1,
    lessonId: 'lesson-4'
  },

  // --- LEKSJON 5 ---
  'char-tian': {
    id: 'char-tian',
    char: '天',
    pinyin: 'tiān',
    tone: 1,
    meaningNo: 'himmel / dag / vær',
    grammarNoteNo: '1. tone – høy tone. "Himmelen over oss". 天气 (tiānqì) = vær.',
    explanationNo: 'Tegnet for stor (大) med en ekstra himmelhvelving øverst: Himmelen er større enn alt.',
    exampleSentence: {
      hanzi: '今天很好。',
      pinyin: 'Jīntiān hěn hǎo.',
      meaningNo: 'I dag er en fin dag.'
    },
    strokesCount: 4,
    strokeSteps: ['一 (øvre himmellinje)', '一 (nedre linje)', '丿 (venstre strekk)', '乀 (høyre strekk)'],
    radical: '大 (stor)',
    radicalMeaningNo: 'Himmelen',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },
  'char-ri': {
    id: 'char-ri',
    char: '日',
    pinyin: 'rì',
    tone: 4,
    meaningNo: 'sol / dag / dato',
    grammarNoteNo: 'Brukt i datoer: 5. mai skrives 5月5日 (mai 5, dag 5).',
    explanationNo: 'Opprinnelig en rund sirkel med en solflekk i midten. Blev firkantet med pensel.',
    exampleSentence: {
      hanzi: '今日。',
      pinyin: 'Jīnrì.',
      meaningNo: 'Denne dag / i dag (formelt).'
    },
    strokesCount: 4,
    strokeSteps: ['丨 (venstre kant)', '𠃍 (høyre hjørne)', '一 (midtre solflekk)', '一 (lukk bunnen)'],
    radical: '日 (sol)',
    radicalMeaningNo: 'Sol og lys',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },
  'char-yue': {
    id: 'char-yue',
    char: '月',
    pinyin: 'yuè',
    tone: 4,
    meaningNo: 'måne / måned',
    grammarNoteNo: 'Måneder lages superenkelt ved å sette tallet foran: 一月 (januar), 二月 (februar), 十二月 (desember)!',
    explanationNo: 'Avbilder en halvmåne med skyer over.',
    exampleSentence: {
      hanzi: '九月。',
      pinyin: 'Jiǔ yuè.',
      meaningNo: 'September (9. måned).'
    },
    strokesCount: 4,
    strokeSteps: ['丿 (venstre bue)', '𠃌 (høyre krok)', '一 (indre strek)', '一 (indre strek)'],
    radical: '月 (måne)',
    radicalMeaningNo: 'Måne',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },
  'char-nian': {
    id: 'char-nian',
    char: '年',
    pinyin: 'nián',
    tone: 2,
    meaningNo: 'år',
    grammarNoteNo: 'Godt nyttår: 新年好 (Xīnnián hǎo) eller 新年快乐 (Xīnnián kuàilè).',
    explanationNo: 'Historisk en person som bærer korn på ryggen etter årets innhøsting.',
    exampleSentence: {
      hanzi: '一年。',
      pinyin: 'Yì nián.',
      meaningNo: 'Ett år.'
    },
    strokesCount: 6,
    strokeSteps: ['丿 (toppskrå)', '一 (vannrett)', '丨 (loddrett kort)', '一 (vannrett)', '一 (lang vannrett)', '丨 (lang loddrett gjennom)'],
    radical: '干 (tørke/stamme)',
    radicalMeaningNo: 'Tidsenhet',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },
  'char-jin': {
    id: 'char-jin',
    char: '今',
    pinyin: 'jīn',
    tone: 1,
    meaningNo: 'nå / nåværende',
    grammarNoteNo: 'I dag: 今天 (jīntiān). Nå: 现在 (xiànzài).',
    explanationNo: 'Et tak (人) med en strek under som peker på nå-øyeblikket.',
    exampleSentence: {
      hanzi: '今天星期一。',
      pinyin: 'Jīntiān xīngqīyī.',
      meaningNo: 'I dag er det mandag.'
    },
    strokesCount: 4,
    strokeSteps: ['丿 (skrå venstre)', '乀 (skrå høyre)', '丶 (prikk)', '㇇ (knekk)'],
    radical: '人 (menneske)',
    radicalMeaningNo: 'Nåtid',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },
  'char-ming': {
    id: 'char-ming',
    char: '明',
    pinyin: 'míng',
    tone: 2,
    meaningNo: 'lys / klar / i morgen',
    grammarNoteNo: 'I morgen: 明天 (míngtiān). Solen og månen sammen bringer lys!',
    explanationNo: 'Sol (日) + Måne (月) side om side = Det klareste lyset på himmelen.',
    exampleSentence: {
      hanzi: '明天见！',
      pinyin: 'Míngtiān jiàn!',
      meaningNo: 'Sees i morgen!'
    },
    strokesCount: 8,
    strokeSteps: ['日 (sol til venstre)', '月 (måne til høyre)'],
    radical: '日 (sol)',
    radicalMeaningNo: 'Lys og klarhet',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },
  'char-zuo': {
    id: 'char-zuo',
    char: '昨',
    pinyin: 'zuó',
    tone: 2,
    meaningNo: 'i går / fortid',
    grammarNoteNo: 'I går: 昨天 (zuótiān).',
    explanationNo: 'Sol (日) til venstre + 乍 (plutselig). Gårsdagens sol som har passert.',
    exampleSentence: {
      hanzi: '昨天星期天。',
      pinyin: 'Zuótiān xīngqītiān.',
      meaningNo: 'I går var det søndag.'
    },
    strokesCount: 9,
    strokeSteps: ['日 (sol til venstre)', '丿', '一', '丨', '一', '一'],
    radical: '日 (sol)',
    radicalMeaningNo: 'Tidligere dager',
    hskLevel: 1,
    lessonId: 'lesson-5'
  },

  // --- LEKSJON 6 ---
  'char-kan': {
    id: 'char-kan',
    char: '看',
    pinyin: 'kàn',
    tone: 4,
    meaningNo: 'å se / se på / lese',
    grammarNoteNo: 'Brukes for å se på TV (看电视), lese bok (看书) eller besøke en venn.',
    explanationNo: 'En hånd (手/龵) holdt over et øye (目) for å skygge for solen og speide langt utover!',
    exampleSentence: {
      hanzi: '我看书。',
      pinyin: 'Wǒ kàn shū.',
      meaningNo: 'Jeg leser en bok.'
    },
    strokesCount: 9,
    strokeSteps: ['丿 (hånd-skrå)', '一', '一', '丿 (håndflate)', '丨 (øye)', '𠃍', '一', '一', '一'],
    radical: '目 (øye)',
    radicalMeaningNo: 'Syn og blikk',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },
  'char-ting': {
    id: 'char-ting',
    char: '听',
    pinyin: 'tīng',
    tone: 1,
    meaningNo: 'å høre / lytte til',
    grammarNoteNo: 'Høre på musikk: 听音乐 (tīng yīnyuè).',
    explanationNo: 'Munn (口) og øks/vekt (斤). Bruk sansene til å fange opp lyder.',
    exampleSentence: {
      hanzi: '你在听吗？',
      pinyin: 'Nǐ zài tīng ma?',
      meaningNo: 'Hører du etter?'
    },
    strokesCount: 7,
    strokeSteps: ['口 (munn)', '丿', '一', '丿', '丨'],
    radical: '口 (munn)',
    radicalMeaningNo: 'Lyd og hørsel',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },
  'char-shuo': {
    id: 'char-shuo',
    char: '说',
    pinyin: 'shuō',
    tone: 1,
    meaningNo: 'å snakke / si',
    grammarNoteNo: 'Snakke kinesisk: 说中文 (shuō Zhōngwén) eller 说汉语 (shuō Hànyǔ).',
    explanationNo: 'Tale-radikalet (讠) til venstre. Det handler om ordene som kommer ut av munnen.',
    exampleSentence: {
      hanzi: '我说汉语。',
      pinyin: 'Wǒ shuō Hànyǔ.',
      meaningNo: 'Jeg snakker kinesisk.'
    },
    strokesCount: 9,
    strokeSteps: ['讠 (tale)', '丶', '丿', '冂', '口'],
    radical: '讠 (tale/ord)',
    radicalMeaningNo: 'Språk og tale',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },
  'char-xie': {
    id: 'char-xie',
    char: '写',
    pinyin: 'xiě',
    tone: 3,
    meaningNo: 'å skrive',
    grammarNoteNo: 'Skrive tegn: 写汉字 (xiě Hànzì).',
    explanationNo: 'Et tak (冖) over en fugleform (与). Å feste tegn under tak.',
    exampleSentence: {
      hanzi: '我会写汉字。',
      pinyin: 'Wǒ huì xiě Hànzì.',
      meaningNo: 'Jeg kan skrive kinesiske tegn.'
    },
    strokesCount: 5,
    strokeSteps: ['丶 (prikk)', '冖 (tak-ramme)', '一 (vannrett)', '𠃍 (knekk)', '一 (bunnstrek)'],
    radical: '冖 (tak)',
    radicalMeaningNo: 'Skrivekunst',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },
  'char-qu': {
    id: 'char-qu',
    char: '去',
    pinyin: 'qù',
    tone: 4,
    meaningNo: 'å gå / dra til (bort fra her)',
    grammarNoteNo: 'Følges direkte av stedet: 去中国 (dra til Kina), 去学校 (gå til skolen).',
    explanationNo: 'Jord (土) øverst og en figur som forlater basen sin.',
    exampleSentence: {
      hanzi: '你去哪儿？',
      pinyin: 'Nǐ qù nǎr?',
      meaningNo: 'Hvor skal du?'
    },
    strokesCount: 5,
    strokeSteps: ['一 (vannrett)', '丨 (loddrett)', '一 (jord)', '厶 (knekk)', '丶 (prikk)'],
    radical: '厶 (privat)',
    radicalMeaningNo: 'Bevegelse bort',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },
  'char-lai': {
    id: 'char-lai',
    char: '来',
    pinyin: 'lái',
    tone: 2,
    meaningNo: 'å komme (hitover)',
    grammarNoteNo: 'Motsatt av 去. "Kom her": 过来 (guòlái).',
    explanationNo: 'Opprinnelig hvete som kom til Kina fra vest; nå betyr det å ankomme.',
    exampleSentence: {
      hanzi: '他来了。',
      pinyin: 'Tā lái le.',
      meaningNo: 'Han har kommet.'
    },
    strokesCount: 7,
    strokeSteps: ['一 (vannrett topp)', '丶 (prikk)', '丿 (skrå)', '一 (vannrett midt)', '丨 (loddrett)', '丿 (ben venstre)', '乀 (ben høyre)'],
    radical: '木 (tre)',
    radicalMeaningNo: 'Ankomst',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },
  'char-xiang': {
    id: 'char-xiang',
    char: '想',
    pinyin: 'xiǎng',
    tone: 3,
    meaningNo: 'å tenke / savne / ha lyst til',
    grammarNoteNo: 'Brukes foran et verb for å uttrykke ønske: 我想吃 (jeg har lyst til å spise).',
    explanationNo: 'Treet (木) + øyet (目) = 相 (undersøke), over et hjerte (心). Du tenker med hjertet.',
    exampleSentence: {
      hanzi: '我想你。',
      pinyin: 'Wǒ xiǎng nǐ.',
      meaningNo: 'Jeg savner deg.'
    },
    strokesCount: 13,
    strokeSteps: ['木 (tre)', '目 (øye)', '心 (hjerte nederst)'],
    radical: '心 (hjerte)',
    radicalMeaningNo: 'Følelser og tanker',
    hskLevel: 1,
    lessonId: 'lesson-6'
  },

  // --- LEKSJON 7 ---
  'char-shen': {
    id: 'char-shen',
    char: '什',
    pinyin: 'shén',
    tone: 2,
    meaningNo: 'hva (første del av 什么)',
    grammarNoteNo: 'Brukt i 什么 (shénme) som betyr "hva".',
    explanationNo: 'Person (亻) + tallet ti (十).',
    exampleSentence: {
      hanzi: '这是什么？',
      pinyin: 'Zhè shì shénme?',
      meaningNo: 'Hva er dette?'
    },
    strokesCount: 4,
    strokeSteps: ['丿 (person)', '丨', '一 (ti)', '丨'],
    radical: '亻 (person)',
    radicalMeaningNo: 'Spørrende',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },
  'char-me': {
    id: 'char-me',
    char: '么',
    pinyin: 'me',
    tone: 5,
    meaningNo: 'spørresuffiks (andre del av 什么)',
    grammarNoteNo: 'Nøytral tone (lett og kort). Sammen: 什么 = hva.',
    explanationNo: 'Enkel strekform som henger bak spørreord.',
    exampleSentence: {
      hanzi: '你说什么？',
      pinyin: 'Nǐ shuō shénme?',
      meaningNo: 'Hva sier du?'
    },
    strokesCount: 3,
    strokeSteps: ['丿 (skråstrek)', '厶 (trekantknekk)', '丶 (prikk)'],
    radical: '丿 (skrå)',
    radicalMeaningNo: 'Grammatisk partikkel',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },
  'char-shei': {
    id: 'char-shei',
    char: '谁',
    pinyin: 'shéi',
    tone: 2,
    meaningNo: 'hvem',
    grammarNoteNo: 'Kan også uttales shuí i eldre eller enkelte regionale former.',
    explanationNo: 'Tale (讠) + en fugl (隹). Hvem kvitrer der?',
    exampleSentence: {
      hanzi: '他是谁？',
      pinyin: 'Tā shì shéi?',
      meaningNo: 'Hvem er han?'
    },
    strokesCount: 10,
    strokeSteps: ['讠 (tale)', '隹 (liten fugl med fjær)'],
    radical: '讠 (tale)',
    radicalMeaningNo: 'Spørsmål om personer',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },
  'char-na3': {
    id: 'char-na3',
    char: '哪',
    pinyin: 'nǎ',
    tone: 3,
    meaningNo: 'hvilken / hvilket / hvor',
    grammarNoteNo: '哪国人 (fra hvilket land)? Med 儿 blir det 哪儿 (nǎr) = hvor?',
    explanationNo: 'Munn (口) foran 那 (den der). Når du åpner munnen for å spørre hvilken.',
    exampleSentence: {
      hanzi: '你是哪国人？',
      pinyin: 'Nǐ shì nǎ guó rén?',
      meaningNo: 'Hvilket land er du fra?'
    },
    strokesCount: 9,
    strokeSteps: ['口 (munn)', '那-elementet til høyre'],
    radical: '口 (munn)',
    radicalMeaningNo: 'Spørreord',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },
  'char-er2': {
    id: 'char-er2',
    char: '儿',
    pinyin: 'er',
    tone: 5,
    meaningNo: 'barn / r-lyd suffiks (erhua)',
    grammarNoteNo: 'I Beijing og nord-Kina festes 儿 til ord som 这儿 (her) og 哪儿 (hvor).',
    explanationNo: 'To små ben på et lite barn som tar sine første steg.',
    exampleSentence: {
      hanzi: '在哪儿？',
      pinyin: 'Zài nǎr?',
      meaningNo: 'Hvor er det?'
    },
    strokesCount: 2,
    strokeSteps: ['丿 (venstre strek)', '乚 (høyre bue med krok)'],
    radical: '儿 (menneskeson/barn)',
    radicalMeaningNo: 'Suffiks',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },
  'char-hen': {
    id: 'char-hen',
    char: '很',
    pinyin: 'hěn',
    tone: 3,
    meaningNo: 'veldig / bindeord for adjektiv',
    grammarNoteNo: 'Kinesisk bruker ikke "å være" (是) foran adjektiv! I stedet sier man "我很好" (jeg + veldig + god).',
    explanationNo: 'Å gå (彳) + stædig (艮). Forsterker adjektivet.',
    exampleSentence: {
      hanzi: '今天很冷。',
      pinyin: 'Jīntiān hěn lěng.',
      meaningNo: 'I dag er det veldig kaldt.'
    },
    strokesCount: 9,
    strokeSteps: ['彳 (dobbelt person/steg)', '艮 (ramme og streker)'],
    radical: '彳 (skritt/steg)',
    radicalMeaningNo: 'Grad og tilstand',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },
  'char-ye': {
    id: 'char-ye',
    char: '也',
    pinyin: 'yě',
    tone: 3,
    meaningNo: 'også / likeledes',
    grammarNoteNo: 'Plasseres alltid FØR verbet: 我也是 (jeg er også det). Aldri bakerst i setningen som på norsk!',
    explanationNo: 'Eldgammelt tegn, ligner en slange eller en vannskål.',
    exampleSentence: {
      hanzi: '我也是挪威人。',
      pinyin: 'Wǒ yě shì nuówēirén.',
      meaningNo: 'Jeg er også nordmann.'
    },
    strokesCount: 3,
    strokeSteps: ['𠃍 (bøyd vannrett)', '丨 (loddrett)', '乚 (bøyd støttestrek)'],
    radical: '乙 (andre)',
    radicalMeaningNo: 'Også / tilføyelse',
    hskLevel: 1,
    lessonId: 'lesson-7'
  },

  // --- LEKSJON 8 ---
  'char-zai': {
    id: 'char-zai',
    char: '在',
    pinyin: 'zài',
    tone: 4,
    meaningNo: 'i / på / ved / å befinne seg',
    grammarNoteNo: 'Brukes for å angi sted: "我在家" (Jeg er hjemme). Også for pågående handling: "我在吃" (Jeg holder på å spise).',
    explanationNo: 'Jord (土) under en hånd eller ramme. Å stå fast forankret på jorden.',
    exampleSentence: {
      hanzi: '你在哪儿？',
      pinyin: 'Nǐ zài nǎr?',
      meaningNo: 'Hvor er du?'
    },
    strokesCount: 6,
    strokeSteps: ['一 (vannrett)', '丿 (skrå)', '丨 (loddrett)', '一 (vannrett)', '丨 (loddrett)', '一 (lukk jord)'],
    radical: '土 (jord)',
    radicalMeaningNo: 'Plassering og jordsmonn',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-jia': {
    id: 'char-jia',
    char: '家',
    pinyin: 'jiā',
    tone: 1,
    meaningNo: 'hjem / familie / hus',
    grammarNoteNo: '回家 (huí jiā) = gå hjem. 大家 (dàjiā) = alle sammen (den store familien).',
    explanationNo: 'Et tak (宀) med en gris (豕) under! I det gamle Kina var en gris under taket tegnet på et velstående hjem.',
    exampleSentence: {
      hanzi: '我回家。',
      pinyin: 'Wǒ huí jiā.',
      meaningNo: 'Jeg drar hjem.'
    },
    strokesCount: 10,
    strokeSteps: ['宀 (tak-radikal med pipe)', '豕 (grisen: buede streker og ben under)'],
    radical: '宀 (tak med overbygg)',
    radicalMeaningNo: 'Hus og hjem',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-xue': {
    id: 'char-xue',
    char: '学',
    pinyin: 'xué',
    tone: 2,
    meaningNo: 'å lære / studere',
    grammarNoteNo: 'Student: 学生 (xuésheng). Lære kinesisk: 学习中文 (xuéxí Zhōngwén).',
    explanationNo: 'Kunnskapsgnister øverst, over et tak og et barn (子) som sitter og lærer.',
    exampleSentence: {
      hanzi: '我学汉语。',
      pinyin: 'Wǒ xué Hànyǔ.',
      meaningNo: 'Jeg lærer kinesisk.'
    },
    strokesCount: 8,
    strokeSteps: ['Prikker øverst (kunnskapsgnister)', '冖 (tak)', '子 (barn under taket)'],
    radical: '子 (barn)',
    radicalMeaningNo: 'Læring og vekst',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-xiao4': {
    id: 'char-xiao4',
    char: '校',
    pinyin: 'xiào',
    tone: 4,
    meaningNo: 'skole (del av 学校)',
    grammarNoteNo: '学校 (xuéxiào) = skole. 4. tone.',
    explanationNo: 'Tre (木) til venstre + 交 (samling/kryss). Bygningen der folk samles.',
    exampleSentence: {
      hanzi: '这是我的学校。',
      pinyin: 'Zhè shì wǒ de xuéxiào.',
      meaningNo: 'Dette er skolen min.'
    },
    strokesCount: 10,
    strokeSteps: ['木 (tre)', '亠', '父-kryss (交)'],
    radical: '木 (tre)',
    radicalMeaningNo: 'Trebygning',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-zhong': {
    id: 'char-zhong',
    char: '中',
    pinyin: 'zhōng',
    tone: 1,
    meaningNo: 'midt / i midten / Kina',
    grammarNoteNo: 'Kina kalles 中国 (Midtens Rike). Kinesisk språk: 中文 (Zhōngwén).',
    explanationNo: 'En firkant med en pil eller stolpe nøyaktig tvers igjennom midten.',
    exampleSentence: {
      hanzi: '中国很大。',
      pinyin: 'Zhōngguó hěn dà.',
      meaningNo: 'Kina er veldig stort.'
    },
    strokesCount: 4,
    strokeSteps: ['丨 (venstre boks)', '𠃍 (høyre boks)', '一 (lukk boks)', '丨 (rett linje gjennom sentrum)'],
    radical: '丨 (loddrett strek)',
    radicalMeaningNo: 'Senterlinje',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-guo2': {
    id: 'char-guo2',
    char: '国',
    pinyin: 'guó',
    tone: 2,
    meaningNo: 'land / nasjon / rike',
    grammarNoteNo: 'Kina: 中国. Norge: 挪威 (eller 挪威王国). Land generelt: 国家.',
    explanationNo: 'En mur/grense (囗) som beskytter en edelsten eller jade (玉) i sitt indre.',
    exampleSentence: {
      hanzi: '你去过哪个国家？',
      pinyin: 'Nǐ qùguo nǎge guójiā?',
      meaningNo: 'Hvilke land har du vært i?'
    },
    strokesCount: 8,
    strokeSteps: ['丨 (venstre mur)', '𠃍 (topp- og høyremur)', '玉 (jade-edelsten i midten)', '一 (lukk muren nederst)'],
    radical: '囗 (omsluttende grense)',
    radicalMeaningNo: 'Nasjon / avgrenset område',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-shang': {
    id: 'char-shang',
    char: '上',
    pinyin: 'shàng',
    tone: 4,
    meaningNo: 'opp / over / gå på',
    grammarNoteNo: 'Motsatsen til 下 (xià). 上课 (starte timen/gå på skolen).',
    explanationNo: 'En grunnlinje med en loddrett indikator som peker oppover over linjen.',
    exampleSentence: {
      hanzi: '桌子上。',
      pinyin: 'Zhuōzi shàng.',
      meaningNo: 'Oppå bordet.'
    },
    strokesCount: 3,
    strokeSteps: ['丨 (loddrett linje opp)', '一 (kort sideindikator)', '一 (lang grunnlinje nederst)'],
    radical: '一 (en)',
    radicalMeaningNo: 'Retning oppover',
    hskLevel: 1,
    lessonId: 'lesson-8'
  },
  'char-xia': {
    id: 'char-xia',
    char: '下',
    pinyin: 'xià',
    tone: 4,
    meaningNo: 'ned / under / neste',
    grammarNoteNo: 'Motsatsen til 上 (shàng). 下午 (ettermiddag), 下课 (avslutte timen).',
    explanationNo: 'En himmellinje øverst med en indikator og prikk som peker ned under linjen.',
    exampleSentence: {
      hanzi: '下午好。',
      pinyin: 'Xiàwǔ hǎo.',
      meaningNo: 'God ettermiddag.'
    },
    strokesCount: 3,
    strokeSteps: ['一 (lang linje på toppen)', '丨 (loddrett linje ned)', '丶 (prikk ned til høyre)'],
    radical: '一 (en)',
    radicalMeaningNo: 'Retning nedover',
    hskLevel: 1,
    lessonId: 'lesson-8'
  }
};
