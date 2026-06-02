import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from server import create_app
from backend.database import db
from backend.models import Studio, Genre, Badge, Anime, Episode

app = create_app()

GENRE_MAP = {
    'Екшн':         ('action',       'Action'),
    'Пригоди':      ('adventure',    'Adventure'),
    'Комедія':      ('comedy',       'Comedy'),
    'Драма':        ('drama',        'Drama'),
    'Фентезі':      ('fantasy',      'Fantasy'),
    'Романтика':    ('romance',      'Romance'),
    'Жахи':         ('horror',       'Horror'),
    'Містерія':     ('mystery',      'Mystery'),
    'Психологія':   ('psychological','Psychological'),
    'Школа':        ('school',       'School'),
    'Спорт':        ('sport',        'Sport'),
    'Надприродне':  ('supernatural', 'Supernatural'),
    'Темне фентезі':('dark-fantasy', 'Dark Fantasy'),
    'Меха':         ('mecha',        'Mecha'),
    'Ісекай':       ('isekai',       'Isekai'),
    'Сейнен':       ('seinen',       'Seinen'),
    'Сьонен':       ('shonen',       'Shonen'),
    'Слайс-оф-лайф':('slice-of-life','Slice of Life'),
    'Шоу-біз':      ('showbiz',      'Show Biz'),
    'Сімейне':      ('family',       'Family'),
    'Супергерої':   ('superheroes',  'Superheroes'),
    'Історичне':    ('historical',   'Historical'),
}

SEASON_EN = {
    'Зима 2026':  'Winter 2026',
    'Зима 2025':  'Winter 2025',
    'Зима 2024':  'Winter 2024',
    'Зима 2023':  'Winter 2023',
    'Весна 2024': 'Spring 2024',
    'Весна 2023': 'Spring 2023',
    'Літо 2024':  'Summer 2024',
    'Літо 2023':  'Summer 2023',
    'Осінь 2024': 'Autumn 2024',
    'Осінь 2023': 'Autumn 2023',
    'Осінь 2022': 'Autumn 2022',
}

ANIME_DATA = [
    {
        'slug': 'frieren',
        'title_uk': 'Фрірен: За межею подорожі',
        'title_en': 'Frieren: Beyond Journey\'s End',
        'title_jp': '葬送のフリーレン',
        'year': 2023, 'ep': 28, 'rating': 9.4, 'status': 'completed',
        'genres_uk': ['Фентезі', 'Драма', 'Пригоди'],
        'studio': 'Madhouse',
        'age': '12+', 'source': 'manga',
        'palette': ['#e8d4b8', '#b8a4d8', '#3a2e5c'], 'accent': '#d4b8ff',
        'synopsis_uk': 'Безсмертна ельфійка-маг Фрірен подорожує світом після перемоги над Демонічним Королем — і вчиться розуміти короткі людські життя.',
        'synopsis_en': 'Immortal elven mage Frieren travels the world after defeating the Demon King — and learns to understand the brevity of human lives.',
        'badges': ['hot', 'dub'], 'runtime': '24 min', 'season_uk': 'Зима 2024',
    },
    {
        'slug': 'solo-leveling',
        'title_uk': 'Соло-левелінг',
        'title_en': 'Solo Leveling',
        'title_jp': '俺だけレベルアップな件',
        'year': 2024, 'ep': 25, 'rating': 9.1, 'status': 'airing',
        'genres_uk': ['Екшн', 'Фентезі', 'Темне фентезі'],
        'studio': 'A-1 Pictures',
        'age': '16+', 'source': 'manhwa',
        'palette': ['#1a0a3f', '#6b4dff', '#00f0ff'], 'accent': '#6b4dff',
        'synopsis_uk': 'Найслабший мисливець E-рангу отримує загадкову систему, яка дозволяє йому ставати сильнішим без меж.',
        'synopsis_en': 'The weakest E-rank hunter receives a mysterious system that lets him grow stronger without limits.',
        'badges': ['hot', 'new'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'dandadan',
        'title_uk': 'Данданан',
        'title_en': 'Dandadan',
        'title_jp': 'ダンダダン',
        'year': 2024, 'ep': 12, 'rating': 8.9, 'status': 'airing',
        'genres_uk': ['Надприродне', 'Комедія', 'Романтика'],
        'studio': 'Science SARU',
        'age': '16+', 'source': 'manga',
        'palette': ['#ff2d95', '#ffce4a', '#000000'], 'accent': '#ff2d95',
        'synopsis_uk': 'Дівчина, яка вірить у привидів, і хлопець, який вірить в інопланетян, доводять один одному, хто правий — і потрапляють у халепу.',
        'synopsis_en': 'A girl who believes in ghosts and a boy who believes in aliens set out to prove each other wrong — and end up in serious trouble.',
        'badges': ['hot', 'new', 'dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2024',
    },
    {
        'slug': 'jjk',
        'title_uk': 'Магічна битва',
        'title_en': 'Jujutsu Kaisen',
        'title_jp': '呪術廻戦',
        'year': 2023, 'ep': 47, 'rating': 8.7, 'status': 'airing',
        'genres_uk': ['Екшн', 'Надприродне', 'Школа'],
        'studio': 'MAPPA',
        'age': '16+', 'source': 'manga',
        'palette': ['#0a0a14', '#7928ca', '#ff007a'], 'accent': '#7928ca',
        'synopsis_uk': 'Юджі Ітадорі ковтає палець могутнього прокляття і опиняється у світі магічних війн.',
        'synopsis_en': 'Yuji Itadori swallows the finger of a powerful curse and finds himself thrust into a world of magical warfare.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'chainsaw',
        'title_uk': 'Людина-бензопила',
        'title_en': 'Chainsaw Man',
        'title_jp': 'チェンソーマン',
        'year': 2022, 'ep': 12, 'rating': 8.6, 'status': 'completed',
        'genres_uk': ['Екшн', 'Темне фентезі', 'Жахи'],
        'studio': 'MAPPA',
        'age': '18+', 'source': 'manga',
        'palette': ['#1a0000', '#ff0000', '#ffd700'], 'accent': '#ff3344',
        'synopsis_uk': 'Дензі зливається з демоном-бензопилою і починає полювати на демонів за гроші, любов і нормальне життя.',
        'synopsis_en': 'Denji merges with his chainsaw devil and hunts demons for money, love, and the chance at a normal life.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2022',
    },
    {
        'slug': 'apothecary',
        'title_uk': 'Монологи аптекарки',
        'title_en': 'The Apothecary Diaries',
        'title_jp': '薬屋のひとりごと',
        'year': 2024, 'ep': 24, 'rating': 9.0, 'status': 'airing',
        'genres_uk': ['Містерія', 'Історичне', 'Драма'],
        'studio': 'OLM',
        'age': '12+', 'source': 'light_novel',
        'palette': ['#2a1810', '#c97d50', '#f4d4a8'], 'accent': '#ff8a4c',
        'synopsis_uk': 'Молода аптекарка розгадує отрути та інтриги задньої палати імператора.',
        'synopsis_en': 'A young apothecary unravels poisons and conspiracies in the rear palace of the emperor.',
        'badges': ['new'], 'runtime': '24 min', 'season_uk': 'Зима 2024',
    },
    {
        'slug': 'oshi',
        'title_uk': 'Зірка, яку люблю',
        'title_en': 'Oshi no Ko',
        'title_jp': '推しの子',
        'year': 2024, 'ep': 24, 'rating': 8.8, 'status': 'airing',
        'genres_uk': ['Драма', 'Надприродне', 'Шоу-біз'],
        'studio': 'Doga Kobo',
        'age': '16+', 'source': 'manga',
        'palette': ['#100828', '#ff2d95', '#ffe066'], 'accent': '#ff2d95',
        'synopsis_uk': 'Лікар і його пацієнтка перевтілюються у двійнят улюбленої айдол-співачки.',
        'synopsis_en': 'A doctor and his patient are reincarnated as the twin children of their favourite idol.',
        'badges': ['new'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'vinland',
        'title_uk': 'Сага про Вінланд',
        'title_en': 'Vinland Saga',
        'title_jp': 'ヴィンランド・サガ',
        'year': 2023, 'ep': 48, 'rating': 9.2, 'status': 'completed',
        'genres_uk': ['Історичне', 'Драма', 'Екшн'],
        'studio': 'MAPPA',
        'age': '18+', 'source': 'manga',
        'palette': ['#0a1a2a', '#4a6f8c', '#b8d4e8'], 'accent': '#4a9fff',
        'synopsis_uk': 'Епічна історія вікінга, який шукає сенс життя після помсти, у далеких землях Вінланду.',
        'synopsis_en': 'An epic tale of a Viking who seeks the meaning of life after vengeance, in the distant lands of Vinland.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'demon-slayer',
        'title_uk': 'Винищувач демонів',
        'title_en': 'Demon Slayer',
        'title_jp': '鬼滅の刃',
        'year': 2024, 'ep': 55, 'rating': 8.9, 'status': 'airing',
        'genres_uk': ['Екшн', 'Надприродне', 'Історичне'],
        'studio': 'ufotable',
        'age': '16+', 'source': 'manga',
        'palette': ['#0a0014', '#00d4aa', '#ff007a'], 'accent': '#00d4aa',
        'synopsis_uk': 'Тандзіро стає мисливцем на демонів, щоб повернути сестру до людської подоби.',
        'synopsis_en': 'Tanjiro becomes a demon slayer to restore his sister back to her human form.',
        'badges': ['hot', 'dub'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'spy',
        'title_uk': 'Шпигун × Сім\'я',
        'title_en': 'Spy x Family',
        'title_jp': 'SPY×FAMILY',
        'year': 2024, 'ep': 37, 'rating': 8.5, 'status': 'airing',
        'genres_uk': ['Екшн', 'Комедія', 'Сімейне'],
        'studio': 'Wit Studio',
        'age': '12+', 'source': 'manga',
        'palette': ['#1a0a2a', '#ff007a', '#00d4aa'], 'accent': '#ff66aa',
        'synopsis_uk': 'Шпигун збирає фейкову сім\'ю — і не знає, що дружина — найманка, а донька — телепатка.',
        'synopsis_en': 'A spy assembles a fake family — unaware that his wife is an assassin and his daughter a telepath.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'aot',
        'title_uk': 'Атака титанів',
        'title_en': 'Attack on Titan',
        'title_jp': '進撃の巨人',
        'year': 2023, 'ep': 87, 'rating': 9.5, 'status': 'completed',
        'genres_uk': ['Екшн', 'Драма', 'Темне фентезі'],
        'studio': 'MAPPA',
        'age': '18+', 'source': 'manga',
        'palette': ['#0a0606', '#8b1e1e', '#d4a574'], 'accent': '#c44',
        'synopsis_uk': 'Людство ховається за стінами від велетенських титанів — поки одного дня стіни не падають.',
        'synopsis_en': 'Humanity hides behind enormous walls from giant titans — until one day the walls come crashing down.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'mha',
        'title_uk': 'Моя геройська академія',
        'title_en': 'My Hero Academia',
        'title_jp': '僕のヒーローアカデミア',
        'year': 2024, 'ep': 159, 'rating': 8.1, 'status': 'airing',
        'genres_uk': ['Екшн', 'Школа', 'Супергерої'],
        'studio': 'Bones',
        'age': '12+', 'source': 'manga',
        'palette': ['#0a1a3a', '#00aaff', '#ff3344'], 'accent': '#00aaff',
        'synopsis_uk': 'У світі, де майже всі мають надсили, хлопчик без них мріє стати найбільшим героєм.',
        'synopsis_en': 'In a world where nearly everyone has superpowers, a boy born without any dreams of becoming the greatest hero.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'blue-lock',
        'title_uk': 'Блакитна в\'язниця',
        'title_en': 'Blue Lock',
        'title_jp': 'ブルーロック',
        'year': 2023, 'ep': 24, 'rating': 8.6, 'status': 'airing',
        'genres_uk': ['Спорт', 'Драма', 'Психологія'],
        'studio': '8bit',
        'age': '12+', 'source': 'manga',
        'palette': ['#00003a', '#0044ff', '#ffee00'], 'accent': '#0044ff',
        'synopsis_uk': '300 найкращих юних футболістів Японії замкнено в таємному об\'єкті, де тільки один стане найкращим страйкером у світі.',
        'synopsis_en': '300 of Japan\'s top young footballers are locked in a secret facility where only one will emerge as the world\'s greatest striker.',
        'badges': ['hot', 'new'], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'one-piece',
        'title_uk': 'Ван Піс',
        'title_en': 'One Piece',
        'title_jp': 'ワンピース',
        'year': 2023, 'ep': 1100, 'rating': 9.0, 'status': 'airing',
        'genres_uk': ['Екшн', 'Пригоди', 'Комедія'],
        'studio': 'Toei Animation',
        'age': '12+', 'source': 'manga',
        'palette': ['#0a1a3a', '#ff4400', '#ffcc00'], 'accent': '#ff4400',
        'synopsis_uk': 'Монкі Д. Луффі і його команда піратів мандрують Великим морем у пошуках легендарного скарбу — Ван Піс.',
        'synopsis_en': 'Monkey D. Luffy and his pirate crew sail the Grand Line in search of the legendary treasure known as the One Piece.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'naruto-shippuden',
        'title_uk': 'Наруто: Шіппуден',
        'title_en': 'Naruto Shippuden',
        'title_jp': 'ナルト 疾風伝',
        'year': 2023, 'ep': 500, 'rating': 8.7, 'status': 'completed',
        'genres_uk': ['Екшн', 'Пригоди', 'Надприродне'],
        'studio': 'Pierrot',
        'age': '16+', 'source': 'manga',
        'palette': ['#1a0a00', '#ff6600', '#ffcc00'], 'accent': '#ff6600',
        'synopsis_uk': 'Наруто повертається після трирічного навчання, щоб протистояти організації Акацукі та врятувати свого друга Саске.',
        'synopsis_en': 'Naruto returns after three years of training to face the Akatsuki organization and save his friend Sasuke.',
        'badges': ['dub'], 'runtime': '23 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'dragon-ball-super',
        'title_uk': 'Драгон Болл Супер',
        'title_en': 'Dragon Ball Super',
        'title_jp': 'ドラゴンボール超',
        'year': 2023, 'ep': 131, 'rating': 7.9, 'status': 'completed',
        'genres_uk': ['Екшн', 'Пригоди', 'Комедія'],
        'studio': 'Toei Animation',
        'age': '12+', 'source': 'manga',
        'palette': ['#000a3a', '#ff8800', '#0044ff'], 'accent': '#ff8800',
        'synopsis_uk': 'Після перемоги над Маджин Бу Гоку продовжує тренування і зустрічає нові загрози — богів руйнування і воїнів з паралельних всесвітів.',
        'synopsis_en': 'After defeating Majin Buu, Goku continues training and faces new threats — gods of destruction and warriors from parallel universes.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'fullmetal-alchemist',
        'title_uk': 'Сталевий алхімік: Братерство',
        'title_en': 'Fullmetal Alchemist: Brotherhood',
        'title_jp': '鋼の錬金術師 BROTHERHOOD',
        'year': 2023, 'ep': 64, 'rating': 9.1, 'status': 'completed',
        'genres_uk': ['Екшн', 'Пригоди', 'Драма'],
        'studio': 'Bones',
        'age': '16+', 'source': 'manga',
        'palette': ['#1a0800', '#cc4400', '#ffd700'], 'accent': '#cc4400',
        'synopsis_uk': 'Двоє братів-алхіміків шукають Філософський камінь, щоб повернути тіла, втрачені під час забороненого ритуалу.',
        'synopsis_en': 'Two alchemist brothers search for the Philosopher\'s Stone to restore their bodies lost in a forbidden ritual.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'steins-gate',
        'title_uk': 'Штейнс;Гейт',
        'title_en': 'Steins;Gate',
        'title_jp': 'シュタインズ・ゲート',
        'year': 2023, 'ep': 24, 'rating': 9.1, 'status': 'completed',
        'genres_uk': ['Психологія', 'Містерія', 'Драма'],
        'studio': 'White Fox',
        'age': '16+', 'source': 'game',
        'palette': ['#0a1a0a', '#00cc44', '#ffcc00'], 'accent': '#00cc44',
        'synopsis_uk': 'Ексцентричний науковець випадково винаходить машину часу та зіштовхується з жахливими наслідками маніпуляцій з часовою лінією.',
        'synopsis_en': 'An eccentric scientist accidentally invents a time machine and faces terrifying consequences from meddling with the timeline.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'hunter-x-hunter',
        'title_uk': 'Мисливець × Мисливець',
        'title_en': 'Hunter x Hunter',
        'title_jp': 'HUNTER×HUNTER',
        'year': 2023, 'ep': 148, 'rating': 9.1, 'status': 'completed',
        'genres_uk': ['Екшн', 'Пригоди', 'Фентезі'],
        'studio': 'Madhouse',
        'age': '16+', 'source': 'manga',
        'palette': ['#0a1a0a', '#44aa00', '#ffcc00'], 'accent': '#44aa00',
        'synopsis_uk': 'Хлопчик Гон мріє стати Мисливцем, як його батько. Він вирушає на небезпечний іспит, де знаходить друзів і смертельних ворогів.',
        'synopsis_en': 'Young Gon dreams of becoming a Hunter like his father. He sets out on the dangerous Hunter Exam, finding allies and deadly enemies.',
        'badges': ['dub'], 'runtime': '23 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'death-note',
        'title_uk': 'Зошит смерті',
        'title_en': 'Death Note',
        'title_jp': 'デスノート',
        'year': 2023, 'ep': 37, 'rating': 9.0, 'status': 'completed',
        'genres_uk': ['Психологія', 'Містерія', 'Надприродне'],
        'studio': 'Madhouse',
        'age': '16+', 'source': 'manga',
        'palette': ['#0a0a0a', '#cc0000', '#ffffff'], 'accent': '#cc0000',
        'synopsis_uk': 'Старшокласник знаходить зошит, який вбиває будь-кого, чиє ім\'я вписано — і вирішує стати богом нового світу.',
        'synopsis_en': 'A high school student finds a notebook that kills anyone whose name is written in it — and decides to become the god of a new world.',
        'badges': ['dub'], 'runtime': '23 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'code-geass',
        'title_uk': 'Код Гіас: Бунтівник Лелуш',
        'title_en': 'Code Geass: Lelouch of the Rebellion',
        'title_jp': 'コードギアス 反逆のルルーシュ',
        'year': 2023, 'ep': 50, 'rating': 8.8, 'status': 'completed',
        'genres_uk': ['Меха', 'Екшн', 'Психологія'],
        'studio': 'Sunrise',
        'age': '16+', 'source': 'original',
        'palette': ['#0a001a', '#cc0066', '#ffd700'], 'accent': '#cc0066',
        'synopsis_uk': 'Вигнаний принц отримує силу Гіас — здатність наказувати будь-кому — і очолює революцію проти Священної Британської Імперії.',
        'synopsis_en': 'An exiled prince gains the power of Geass — the ability to command anyone — and leads a revolution against the Holy Britannian Empire.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'neon-genesis',
        'title_uk': 'Євангеліон нового покоління',
        'title_en': 'Neon Genesis Evangelion',
        'title_jp': '新世紀エヴァンゲリオン',
        'year': 2023, 'ep': 26, 'rating': 8.5, 'status': 'completed',
        'genres_uk': ['Меха', 'Психологія', 'Драма'],
        'studio': 'Gainax',
        'age': '18+', 'source': 'original',
        'palette': ['#0a0a14', '#6600cc', '#00cc44'], 'accent': '#6600cc',
        'synopsis_uk': 'Підліток керує гігантським роботом, щоб захистити Землю від ангелів — і поступово усвідомлює жахливу правду про своє існування.',
        'synopsis_en': 'A teenager pilots a giant mecha to protect Earth from Angels — and gradually uncovers the horrifying truth about his existence.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'cowboy-bebop',
        'title_uk': 'Ковбой Бібоп',
        'title_en': 'Cowboy Bebop',
        'title_jp': 'カウボーイビバップ',
        'year': 2023, 'ep': 26, 'rating': 8.9, 'status': 'completed',
        'genres_uk': ['Екшн', 'Пригоди', 'Драма'],
        'studio': 'Sunrise',
        'age': '18+', 'source': 'original',
        'palette': ['#0a0a0a', '#ff8800', '#4444ff'], 'accent': '#ff8800',
        'synopsis_uk': 'Команда мисливців за головами подорожує по Сонячній системі 2071 року, переслідуючи злочинців та власне минуле.',
        'synopsis_en': 'A crew of bounty hunters travels the Solar System in 2071, chasing criminals and their own troubled pasts.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 're-zero',
        'title_uk': 'Re:Zero — Початок у паралельному світі',
        'title_en': 'Re:Zero - Starting Life in Another World',
        'title_jp': 'Re:ゼロから始める異世界生活',
        'year': 2023, 'ep': 50, 'rating': 8.4, 'status': 'completed',
        'genres_uk': ['Ісекай', 'Психологія', 'Фентезі'],
        'studio': 'White Fox',
        'age': '16+', 'source': 'light_novel',
        'palette': ['#0a001a', '#8844ff', '#ff4488'], 'accent': '#8844ff',
        'synopsis_uk': 'Хлопець потрапляє в паралельний світ і отримує здатність повертатися в часі після смерті — але ціна цієї сили виявляється жахливою.',
        'synopsis_en': 'A boy transported to another world gains the ability to return to a checkpoint upon death — but the cost of this power is terrible.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'overlord',
        'title_uk': 'Повелитель',
        'title_en': 'Overlord',
        'title_jp': 'オーバーロード',
        'year': 2024, 'ep': 52, 'rating': 7.9, 'status': 'completed',
        'genres_uk': ['Ісекай', 'Фентезі', 'Екшн'],
        'studio': 'Madhouse',
        'age': '16+', 'source': 'light_novel',
        'palette': ['#0a0a14', '#4400aa', '#ffd700'], 'accent': '#4400aa',
        'synopsis_uk': 'Геймер застряє у VRMMORPG в образі могутнього темного мага і вирішує завоювати новий світ.',
        'synopsis_en': 'A gamer gets trapped in a VRMMORPG as a powerful undead overlord and decides to conquer this new world.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'sword-art-online',
        'title_uk': 'Майстер меча онлайн',
        'title_en': 'Sword Art Online',
        'title_jp': 'ソードアート・オンライン',
        'year': 2023, 'ep': 96, 'rating': 7.7, 'status': 'completed',
        'genres_uk': ['Ісекай', 'Екшн', 'Романтика'],
        'studio': 'A-1 Pictures',
        'age': '16+', 'source': 'light_novel',
        'palette': ['#001a0a', '#00aa66', '#4488ff'], 'accent': '#00aa66',
        'synopsis_uk': '10 000 гравців опиняються в пастці у VR-грі, де смерть у грі = смерть у реальності.',
        'synopsis_en': '10,000 players become trapped in a VR game where dying in-game means dying in real life.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'tokyo-ghoul',
        'title_uk': 'Токійський гуль',
        'title_en': 'Tokyo Ghoul',
        'title_jp': '東京喰種',
        'year': 2023, 'ep': 48, 'rating': 7.8, 'status': 'completed',
        'genres_uk': ['Екшн', 'Темне фентезі', 'Жахи'],
        'studio': 'Pierrot',
        'age': '18+', 'source': 'manga',
        'palette': ['#0a0a0a', '#cc0000', '#440088'], 'accent': '#cc0000',
        'synopsis_uk': 'Студент після нападу гулі сам перетворюється на напівгуля і намагається зберегти людяність у жорстокому підземному світі.',
        'synopsis_en': 'A college student attacked by a ghoul becomes half-ghoul himself and struggles to retain his humanity in a brutal underground world.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'tower-of-god',
        'title_uk': 'Вежа Бога',
        'title_en': 'Tower of God',
        'title_jp': '神之塔',
        'year': 2024, 'ep': 26, 'rating': 8.0, 'status': 'airing',
        'genres_uk': ['Екшн', 'Пригоди', 'Фентезі'],
        'studio': 'Crunchyroll Originals',
        'age': '16+', 'source': 'manhwa',
        'palette': ['#0a0a1a', '#0066ff', '#ff6600'], 'accent': '#0066ff',
        'synopsis_uk': 'Хлопець піднімається по загадковій вежі, де кожен поверх — нове смертельне випробування, а нагорода — будь-яке бажання.',
        'synopsis_en': 'A boy climbs a mysterious tower where each floor brings a new deadly trial and the reward at the top grants any wish.',
        'badges': ['new'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'mushoku-tensei',
        'title_uk': 'Безробітне перевтілення',
        'title_en': 'Mushoku Tensei: Jobless Reincarnation',
        'title_jp': '無職転生',
        'year': 2024, 'ep': 23, 'rating': 8.5, 'status': 'airing',
        'genres_uk': ['Ісекай', 'Пригоди', 'Фентезі'],
        'studio': 'Studio Bind',
        'age': '18+', 'source': 'light_novel',
        'palette': ['#1a1a0a', '#44aa00', '#ff8844'], 'accent': '#44aa00',
        'synopsis_uk': 'Невдаха, що прожив марне життя, перероджується у фентезійному світі та вирішує цього разу проживи своє життя на повну.',
        'synopsis_en': 'A failure who wasted his life is reincarnated in a fantasy world and vows to live it to the fullest this time.',
        'badges': ['new'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
    {
        'slug': 'black-clover',
        'title_uk': 'Чорний конюшина',
        'title_en': 'Black Clover',
        'title_jp': 'ブラッククローバー',
        'year': 2023, 'ep': 170, 'rating': 8.2, 'status': 'airing',
        'genres_uk': ['Екшн', 'Фентезі', 'Сьонен'],
        'studio': 'Pierrot',
        'age': '12+', 'source': 'manga',
        'palette': ['#0a0a0a', '#44cc44', '#000000'], 'accent': '#44cc44',
        'synopsis_uk': 'Хлопчик без магії мріє стати Магічним Імператором у світі, де магія вирішує все.',
        'synopsis_en': 'A boy born without magic dreams of becoming the Wizard King in a world where magic determines everything.',
        'badges': ['dub'], 'runtime': '23 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'your-name',
        'title_uk': 'Твоє ім\'я',
        'title_en': 'Your Name',
        'title_jp': '君の名は。',
        'year': 2023, 'ep': 1, 'rating': 9.0, 'status': 'completed',
        'genres_uk': ['Романтика', 'Драма', 'Надприродне'],
        'studio': 'CoMix Wave Films',
        'age': '12+', 'source': 'original',
        'palette': ['#1a0a3a', '#ff88aa', '#88aaff'], 'accent': '#ff88aa',
        'synopsis_uk': 'Хлопець і дівчина з різних міст починають мінятися тілами уві сні — і закохуються, ніколи не зустрівшись.',
        'synopsis_en': 'A boy and a girl from different towns start swapping bodies in their dreams — and fall in love without ever meeting.',
        'badges': [], 'runtime': '112 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'spirited-away',
        'title_uk': 'Сенрікіна мандрівка у країну духів',
        'title_en': 'Spirited Away',
        'title_jp': '千と千尋の神隠し',
        'year': 2023, 'ep': 1, 'rating': 9.3, 'status': 'completed',
        'genres_uk': ['Пригоди', 'Фентезі', 'Сімейне'],
        'studio': 'Studio Ghibli',
        'age': '12+', 'source': 'original',
        'palette': ['#1a3a1a', '#88cc44', '#ffaa00'], 'accent': '#88cc44',
        'synopsis_uk': 'Дівчинка Тіхіро потрапляє у світ духів і має працювати в чарівних лазнях, щоб врятувати батьків.',
        'synopsis_en': 'A girl named Chihiro is trapped in a spirit world and must work in a magical bathhouse to save her parents.',
        'badges': [], 'runtime': '125 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'mob-psycho',
        'title_uk': 'Моб Психо 100',
        'title_en': 'Mob Psycho 100',
        'title_jp': 'モブサイコ100',
        'year': 2023, 'ep': 37, 'rating': 8.9, 'status': 'completed',
        'genres_uk': ['Екшн', 'Комедія', 'Надприродне'],
        'studio': 'Bones',
        'age': '12+', 'source': 'manga',
        'palette': ['#0a0a14', '#aa00ff', '#ff8800'], 'accent': '#aa00ff',
        'synopsis_uk': 'Наддоступний школяр з неймовірними екстрасенсорними силами намагається жити звичайним життям.',
        'synopsis_en': 'An overpowered middle schooler with incredible psychic abilities tries to live a normal life.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'jojo',
        'title_uk': 'Незвичайна пригода ДжоДжо',
        'title_en': 'JoJo\'s Bizarre Adventure',
        'title_jp': 'ジョジョの奇妙な冒険',
        'year': 2023, 'ep': 190, 'rating': 8.6, 'status': 'airing',
        'genres_uk': ['Екшн', 'Пригоди', 'Надприродне'],
        'studio': 'David Production',
        'age': '16+', 'source': 'manga',
        'palette': ['#1a0a0a', '#aa4400', '#ffd700'], 'accent': '#aa4400',
        'synopsis_uk': 'Епічна сага про родину Джостар і їхню вічну боротьбу зі злом крізь покоління та континенти.',
        'synopsis_en': 'An epic saga following the Joestar family and their eternal battle against evil across generations and continents.',
        'badges': ['dub'], 'runtime': '24 min', 'season_uk': 'Осінь 2023',
    },
    {
        'slug': 'toradora',
        'title_uk': 'Торадора!',
        'title_en': 'Toradora!',
        'title_jp': 'とらドラ!',
        'year': 2023, 'ep': 25, 'rating': 8.4, 'status': 'completed',
        'genres_uk': ['Романтика', 'Комедія', 'Слайс-оф-лайф'],
        'studio': 'J.C. Staff',
        'age': '12+', 'source': 'light_novel',
        'palette': ['#1a0a00', '#ff6644', '#44aaff'], 'accent': '#ff6644',
        'synopsis_uk': 'Хлопець з суворим виглядом і дівчина з характером хижака вирішують допомогти одне одному завоювати кохання — і несподівано закохуються самі.',
        'synopsis_en': 'A boy with a scary face and a girl with the ferocity of a tiger team up to win their respective crushes — and unexpectedly fall for each other.',
        'badges': [], 'runtime': '24 min', 'season_uk': 'Зима 2023',
    },
    {
        'slug': 'bleach-tybw',
        'title_uk': 'Блич: Тисячолітня кривава війна',
        'title_en': 'Bleach: Thousand-Year Blood War',
        'title_jp': 'BLEACH 千年血戦篇',
        'year': 2024, 'ep': 52, 'rating': 9.0, 'status': 'airing',
        'genres_uk': ['Екшн', 'Надприродне', 'Сьонен'],
        'studio': 'Pierrot',
        'age': '16+', 'source': 'manga',
        'palette': ['#0a0a0a', '#cc2200', '#888888'], 'accent': '#cc2200',
        'synopsis_uk': 'Ічіго і Загін Смерті зіштовхуються зі своїм найбільшим ворогом — армією Квінсі під проводом таємничого Yhwach.',
        'synopsis_en': 'Ichigo and the Soul Reapers face their greatest enemy — a Quincy army led by the mysterious Yhwach.',
        'badges': ['hot', 'new', 'dub'], 'runtime': '24 min', 'season_uk': 'Літо 2024',
    },
]

SOLO_EPISODES = [
    (1, 'Пробудження',         'Awakening',         'Сон-у прокидається після смертельного підземелля.', 'Sung Jin-Woo awakens after a near-death dungeon.'),
    (2, 'Іспит',               'The Test',           'Таємнича система дає перший квест.', 'The mysterious system issues its first quest.'),
    (3, 'Червоне підземелля',  'Red Dungeon',        'Перше небезпечне підземелля після пробудження.', 'The first dangerous dungeon after awakening.'),
    (4, 'Пастка',              'The Trap',           'Сон-у потрапляє в пастку разом з гільдією.', 'Jin-Woo is trapped in a dungeon with fellow hunters.'),
    (5, 'Подвійне підземелля', 'Double Dungeon',     'Секрет подвійного підземелля розкрито.', 'The secret of the double dungeon is revealed.'),
    (6, 'Виклик',              'The Challenge',      'Нова ціль — рейд на найнебезпечніше підземелля.', 'A new target — a raid on the most dangerous dungeon.'),
    (7, 'Ще не пізно',         'Not Too Late',       'Союзники опиняються під загрозою.', 'Allies find themselves under threat.'),
    (8, 'Шанс',                'The Chance',         'Сон-у отримує шанс піднятися на новий рівень.', 'Jin-Woo gets a chance to reach the next level.'),
    (9, 'Розкол',              'The Rift',           'Гільдія розкололась після конфлікту.', 'The guild splits apart after a conflict.'),
    (10,'Тіньовий монарх',     'Shadow Monarch',     'Справжня сила системи починає проявлятись.', 'The true power of the system begins to manifest.'),
]

def seed():
    with app.app_context():
        db.create_all()
        print('Tables created.')

        studio_names = {d['studio'] for d in ANIME_DATA}
        studio_map   = {}
        for name in studio_names:
            slug = name.lower().replace(' ', '-').replace('/', '-')
            s = Studio.query.filter_by(slug=slug).first()
            if not s:
                s = Studio(slug=slug, name=name)
                db.session.add(s)
            studio_map[name] = s
        db.session.flush()

        genre_map = {}
        for uk_name, (slug, en_name) in GENRE_MAP.items():
            g = Genre.query.filter_by(slug=slug).first()
            if not g:
                g = Genre(slug=slug, name_uk=uk_name, name_en=en_name)
                db.session.add(g)
            genre_map[uk_name] = g
        db.session.flush()

        badge_map = {}
        for slug in ['hot', 'new', 'dub', 'simulcast']:
            b = Badge.query.filter_by(slug=slug).first()
            if not b:
                b = Badge(slug=slug)
                db.session.add(b)
            badge_map[slug] = b
        db.session.flush()

        for d in ANIME_DATA:
            a = Anime.query.filter_by(slug=d['slug']).first()
            if not a:
                a = Anime(slug=d['slug'])
                db.session.add(a)

            a.title_uk      = d['title_uk']
            a.title_en      = d['title_en']
            a.title_jp      = d.get('title_jp')
            a.year          = d['year']
            a.episodes_count= d['ep']
            a.rating        = d['rating']
            a.status        = d['status']
            a.age_rating    = d.get('age')
            a.source        = d.get('source', 'manga')
            a.runtime       = d.get('runtime', '24 min')
            a.season_uk     = d.get('season_uk')
            a.season_en     = SEASON_EN.get(d.get('season_uk', ''), d.get('season_uk', ''))
            a.synopsis_uk   = d.get('synopsis_uk')
            a.synopsis_en   = d.get('synopsis_en')
            a.palette       = d.get('palette', [])
            a.accent        = d.get('accent')
            a.studio        = studio_map.get(d['studio'])
            a.genres        = [genre_map[g] for g in d['genres_uk'] if g in genre_map]
            a.badges        = [badge_map[b] for b in d.get('badges', []) if b in badge_map]

        db.session.flush()

        solo = Anime.query.filter_by(slug='solo-leveling').first()
        if solo and solo.episodes.count() == 0:
            for num, title_uk, title_en, desc_uk, desc_en in SOLO_EPISODES:
                ep = Episode(
                    anime_id       = solo.id,
                    season_number  = 2,
                    episode_number = num,
                    title_uk       = title_uk,
                    title_en       = title_en,
                    description_uk = desc_uk,
                    description_en = desc_en,
                    duration_min   = 24,
                )
                db.session.add(ep)

        db.session.commit()
        print(f'Seeded {len(ANIME_DATA)} anime, {len(GENRE_MAP)} genres, {len(studio_names)} studios.')

if __name__ == '__main__':
    seed()
