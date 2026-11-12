# פרומפט ל־Claude Code: סלייד שואו של הכלבים עם Higgsfield

> **איך משתמשים:** פותחים Claude Code בתיקייה `D:\IndieVerse\dog-match`, ומדביקים את כל מה שמתחת לקו.
> Higgsfield כבר מחובר ל־Claude Code. הפרומפט מסביר לו בדיוק מה לייצר, איך, ואיך להכניס את זה לאתר.

---

## המשימה

אתה עובד על האתר "איזה כלב מתאים לי" (Vite + React + TypeScript + Tailwind v4, RTL, עברית). התיקייה היא `D:\IndieVerse\dog-match`. **לפני הכל:** `git pull`.

המטרה היא להחליף את כלבי הצעצוע בתלת־ממד בכלבים שנראים אמיתיים, בסגנון סרטון הדוגמה ששלח uriel. פריימים ממנו נמצאים ב־`docs/reference/`. מדובר בהקלטה של אתר מוצרים בתלת־ממד: פחיות שמרחפות בקרוסלה, ובלחיצה על אחת המסך הופך לכהה וקולנועי. המוצר מסתובב, המצלמה מתקרבת לחלקים שונים בגוף בזמן הגלילה, ובסוף מופיעה טיפוגרפיה ענקית ומטושטשת מאחוריו.

את המדיה מייצרים עם **Higgsfield** (כלי ה־MCP שמתחילים ב־`mcp__Higgsfield__`), ומכניסים אותה לאתר דרך המנגנון שכבר קיים.

**קרא קודם את הקבצים האלה:**

- **`docs/DOG_LIBRARY_SPEC.md`:** המפרט המלא של הספרייה (4 סצנות, תזמונים, צבעים לכל זן). התסריט של הסרטון מפורט שם שנייה אחרי שנייה.
- **`docs/reference/showcase-contact-sheet.jpg`** וששת הפריימים: איך נראה סרטון הדוגמה. **תסתכל עליהם.**
- **`src/lib/dogAssets.ts`:**
  - כל הנכסים של הכלבים עוברים דרכו.
  - יש בו `turntables`, סרטוני סיבוב שהאתר מריץ קדימה ואחורה לפי הגלילה.
  - כרגע יש סרטוני סיבוב לשלושה זנים: בורדר קולי, גולדן וכנעני.
- **`src/components/TurntableStage.tsx`:** הבמה שמריצה את הסרטון קדימה ואחורה לפי `currentTime`, ועושה זום לנקודה בכל עצירה.
- **`src/pages/Library.tsx` ו־`src/pages/Breed.tsx`:** הקרוסלה ודף הזן.
- **`src/data/breeds.json`:** 21 זנים. מכאן לוקחים את שמות הזנים ואת הסדר.

## כללים שאסור לשבור

1. **לא קונים כלום ולא מוציאים קרדיטים בלי אישור של uriel.**
   - לפני כל ייצור, בודקים יתרה עם `balance` ומחיר משוער עם quote, או לפי מה ש־`models_explore` מחזיר.
   - מציגים לו בעברית: כמה פריטים, איזה מודל, וכמה קרדיטים בערך.
   - מחכים ל"כן".
2. **מתחילים מפיילוט של זן אחד בלבד, בורדר קולי.** מייצרים את כל הסט שלו, מכניסים לאתר ומראים ל־uriel. רק אחרי שהוא מאשר, ממשיכים לשאר הזנים.
3. **לא מעתיקים את הרפרנס:** לא את הלוגו, לא את שמות המוצרים, לא את הסלוגן ולא את הפונט. לוקחים רק את שפת התנועה, התאורה והקומפוזיציה.
4. **אין טקסט, לוגו או סימן מים בתוך הסרטונים והתמונות.** את הטקסט מוסיף האתר.
5. **הכלב צריך להיות נכון לזן:** מבנה גוף, אוזניים, זנב, אורך וצבע הפרווה. בלי קולר, בלי בגדים ובלי אביזרים.
6. **לא משנים את נוסחת ההתאמה, ולא ממציאים מידע על זנים.**
7. **כל הטקסט באתר בעברית.**

## שלב 0: היכרות עם Higgsfield (חובה, לפני כל ייצור)

1. **`get_workflow_instructions`** בלי ארגומנט, כדי לקבל את ההנחיות לסרטונים מרובי שלבים.
2. **`models_explore`** עם `action: "recommend"`, פעמיים:
   - פעם ל"תמונת סטודיו פוטוריאליסטית של כלב".
   - פעם ל"image-to-video, מצלמה שמקיפה את הנושא 360°, הנושא נשאר במקום".

   בחר מודל שתומך ב־**start frame** (ואם אפשר, גם ב־end frame), ב־**camera orbit** וב־**1080p**.
3. **`get_presets`** עם `category: "motion"`: חפש תנועות מצלמה מוכנות מסוג orbit, turntable, dolly in ו־push in. **פתיחת הקטלוג לא מאשרת ייצור.**
4. **`manage_reference_elements` או `show_reference_elements`:** אם יש אפשרות לשמור את הכלב כ"אלמנט" או "דמות" שחוזרת, השתמש בה. ככה אותו כלב בדיוק יופיע בכל הקליפים של הזן.
5. **`balance`:** כמה קרדיטים יש.

סכם ל־uriel בהודעה אחת קצרה: איזה מודל בחרת לתמונה ולווידאו, ולמה, כמה עולה הפיילוט, וכמה יעלו כל 21 הזנים. **חכה לאישור.**

## מה מייצרים לכל זן (5 נכסים)

| # | נכס | יחס | אורך | משמש ב־ |
| --- | --- | --- | --- | --- |
| A | **תמונת גיבור:** הכלב עומד בזווית 3/4, צד שמאל של הכלב לכיוון המצלמה, על רקע סטודיו שחור חלק | 4:5, ‏1600×2000 ומעלה | – | המקור לכל השאר |
| B | **תמונת קרוסלה בלי רקע:** אותה תמונה, אחרי `remove_background` | ‏PNG שקוף | – | הקרוסלה הבהירה ו"הכלב המלווה" |
| C | **סרטון סיבוב:** המצלמה מקיפה את הכלב 360° במהירות קבועה, והכלב עומד במקום ונושם | 1:1 או 4:3 | 6–8 שניות | הבמה הכהה בדף הזן (גלילה) |
| D | **סרטון כניסה:** dolly in מהיר מרחוק לקרוב, עם סיבוב קל | 16:9 | 2–3 שניות | המעבר מהקרוסלה לדף הזן |
| E | **סרטון סיום:** הכלב יושב מול המצלמה ומכשכש, והמצלמה מתרחקת לאט | 16:9 | 3–4 שניות | הסצנה האחרונה (סיום) |

### פרומפט לתמונת הגיבור (A)

באנגלית, כי המודלים מבינים אנגלית טוב יותר. מחליפים את מה שבסוגריים מסולסלים לפי הטבלה למטה.

```
Photorealistic studio portrait of a single {BREED_EN}, {COAT}, full body visible from nose to tail,
standing calmly in a natural stance, three-quarter view facing left, eye level camera, 85mm lens.
Seamless pure black studio backdrop, no floor line. One soft key light from above,
a thin colored rim light outlining the fur in {ACCENT_HEX} from behind,
subtle {GLOW_HEX} glow behind the dog fading to black at the edges.
Sharp fur detail, accurate breed anatomy, healthy adult dog, calm friendly expression.
No collar, no harness, no clothing, no props, no text, no watermark, no logo. Centered with generous margin.
```

**negative prompt** (אם המודל תומך):

```
cartoon, 3d render, plastic, toy, deformed legs, extra limbs, wrong breed, collar, text, watermark, cropped paws
```

**מייצרים 4 גרסאות לכל זן** (batch), ובוחרים את הטובה ביותר לפי הסדר הזה:

1. האנטומיה נכונה: 4 רגליים, כפות שלמות, זנב אחד.
2. הכלב נראה כמו הזן.
3. כל הגוף בפריים.

שומרים את ה־seed ואת ה־media id של התמונה שנבחרה.

### פרומפט לסרטון הסיבוב (C), שהוא החשוב ביותר

**image-to-video**, עם תמונת הגיבור כ־start frame:

```
Smooth 360 degree orbit of the camera around the dog at constant speed and constant distance,
the dog stays perfectly in place and keeps standing, only gentle breathing and a slow tail movement.
Same black studio backdrop and the same {ACCENT_HEX} rim light for the whole shot.
No cuts, no zoom, no camera shake, no change of lighting, no new objects. Ends at the starting angle so it loops.
```

**דרישות שבודקים בסרטון שיוצא:**

- **המצלמה מקיפה, הכלב לא זז.** אם הכלב הולך, מתיישב או משנה צורה, מייצרים מחדש.
- **הסרטון מסתיים קרוב לזווית ההתחלה:** בודקים שהפריים הראשון והאחרון דומים. אם המודל תומך ב־end frame, נותנים לו את אותה תמונה כ־end frame.
- **אין קפיצות בתאורה ואין "ריצוד" בפרווה.**

אם מודל אחד לא מצליח לעשות 360° שלמים, עושים **שני קליפים של 180°** (הסוף של הראשון הוא ההתחלה של השני) ומחברים ב־ffmpeg.

### פרומפט לסרטון הכניסה (D)

```
Fast cinematic dolly in from a wide shot to a close three-quarter view of the dog, slight orbit to the left,
black backdrop with {GLOW_HEX} glow blooming in from the center, floating dust particles catching the {ACCENT_HEX} light.
Dog stays standing, looks toward camera at the end. No text.
```

### פרומפט לסרטון הסיום (E)

```
The dog sits down facing the camera and wags its tail gently, the camera slowly pulls back,
warm hazy bloom of {GLOW_HEX} behind the dog, soft focus background, black edges. No text.
```

### צבעים ותיאור פרווה לכל זן

הצבעים מ־`docs/DOG_LIBRARY_SPEC.md`. למעורבים ה־ACCENT הוא הבלאש של האתר. השם באנגלית ותיאור הפרווה הם לפרומפט בלבד. בודקים מול תמונות של הזן, ואם משהו לא נכון, מתקנים.

| id | קובץ | BREED_EN | COAT | GLOW | ACCENT |
| --- | --- | --- | --- | --- | --- |
| border-collie | border_collie | Border Collie | black and white medium-length double coat, white blaze and chest | #3B4A63 | #9FB7E0 |
| labrador | labrador | Labrador Retriever | short dense yellow coat | #B8742A | #F2B25C |
| golden | golden | Golden Retriever | long wavy golden coat with feathering | #C9822F | #FFC46B |
| gsd | gsd | German Shepherd | black and tan saddle coat, medium length | #8A4B1E | #E39A55 |
| husky | husky | Siberian Husky | grey and white thick coat, light blue eyes | #4F6A8A | #BFD8FF |
| poodle | poodle | Toy Poodle | apricot curly coat, neat natural trim | #8E7F86 | #F1E3EA |
| maltese | maltese | Maltese | long silky pure white coat | #8E7F86 | #F1E3EA |
| shih-tzu | shih_tzu | Shih Tzu | long gold and white coat, short muzzle | #8E7F86 | #F1E3EA |
| french-bulldog | french_bulldog | French Bulldog | short fawn coat, bat ears | #7D6650 | #E8C9A4 |
| pug | pug | Pug | short fawn coat with black mask, curled tail | #7D6650 | #E8C9A4 |
| english-bulldog | english_bulldog | English Bulldog | short white and brindle coat, stocky body | #7D6650 | #E8C9A4 |
| beagle | beagle | Beagle | tricolor short coat, long floppy ears | #9A5426 | #F09A5B |
| boxer | boxer | Boxer | short fawn coat with white chest, black mask | #9A5426 | #F09A5B |
| dachshund | dachshund | Dachshund | smooth short red coat, long low body | #9A5426 | #F09A5B |
| chihuahua | chihuahua | Chihuahua | smooth short cream coat, large upright ears | #7D6650 | #E8C9A4 |
| yorkshire | yorkshire | Yorkshire Terrier | long silky steel blue and tan coat | #8E7F86 | #F1E3EA |
| aussie | aussie | Australian Shepherd | blue merle medium-length coat with copper points | #3B4A63 | #9FB7E0 |
| canaan | canaan | Canaan Dog | short sandy cream coat, upright ears, curled tail | #A88B5C | #F3D9A6 |
| mixed-small | mixed | small mixed-breed dog | short brown and white coat | #2A2D33 | #E7A9A0 |
| mixed-medium | mixed | medium mixed-breed dog | short tan coat | #2A2D33 | #E7A9A0 |
| mixed-large | mixed | large mixed-breed dog | short black coat with white chest | #2A2D33 | #E7A9A0 |

כל שלושת המעורבים משתמשים כרגע בקובץ אחד (`mixed`). אם רוצים כלב שונה לכל אחד, צריך להוסיף מיפוי ב־`file()` שב־`dogAssets.ts`.

## עיבוד הקבצים (ffmpeg) והכנסה לאתר

הגלילה בדף הזן מריצה את הסרטון קדימה ואחורה, ולכן **כל פריים חייב להיות keyframe**. אחרת הסרטון יקפוץ.

```bash
# סרטון סיבוב (C): חיתוך לריבוע סביב הכלב, 880 פיקסלים, כל פריים keyframe, בלי קול
ffmpeg -i turntable_raw.mp4 -vf "crop=ih:ih,scale=880:-2,fps=30" -c:v libx264 -preset slow -crf 26 \
  -g 1 -keyint_min 1 -pix_fmt yuv420p -movflags +faststart -an public/dogs/real/{file}.mp4

# פוסטר: הפריים של הזווית שבה הכלב הכי יפה (בדרך כלל השנייה הראשונה)
ffmpeg -ss 0.5 -i public/dogs/real/{file}.mp4 -frames:v 1 -q:v 3 public/dogs/real/{file}.jpg

# תמונת קרוסלה (B): PNG שקוף ל־WebP שקוף, גובה 900
ffmpeg -i hero_nobg.png -vf "scale=-2:900" -c:v libwebp -quality 85 -lossless 0 public/dogs/{file}.webp

# סרטוני כניסה וסיום (D, E): 1280 רוחב, keyframe כל חצי שנייה
ffmpeg -i intro_raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 24 -g 15 -an -movflags +faststart public/dogs/real/{file}_intro.mp4
ffmpeg -i finale_raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 24 -g 15 -an -movflags +faststart public/dogs/real/{file}_finale.mp4
```

**יעד גודל:** סרטון סיבוב עד 2MB, ותמונת קרוסלה עד 150KB. אם סרטון גדול מזה, מעלים את `crf` ל־28.

**שם הקובץ:** לפי עמודת "קובץ" בטבלה. ה־id עם קו תחתון במקום מקף.

### הכנסה לקוד

1. **`src/lib/dogAssets.ts`:** מוסיפים את הזן ל־`turntables` עם `turn('{file}', {...})`.
   - לכל אחת מהעצירות `intro`, `head`, `mouth`, `legs`, `coat`, `body`, `finale` קובעים `f(t, x, y, zoom)`.
   - `t` הוא השנייה בסרטון שבה רואים את החלק הזה הכי טוב:
     - ראש ופה: כשהפנים לכיוון המצלמה.
     - פרווה: מהצד או מלמעלה.
     - רגליים: מהצד.
   - `x` ו־`y` הם המרכז של החלק באחוזים מהפריים.
   - `zoom` הוא 1.8–2.6 לחלקים קרובים, ו־1 לפתיחה ולסיום.
   - **איך קובעים את הערכים:** מוציאים פריים כל חצי שנייה (`ffmpeg -i x.mp4 -vf fps=2 frames/%02d.jpg`), מסתכלים עליהם ובוחרים. לא מנחשים.
2. **תמונת הקרוסלה החדשה מחליפה את `public/dogs/{file}.webp`.** הקרוסלה, הכלב המלווה, והקשתות השחורות בדף הבית ובתוצאות כבר משתמשים בקובץ הזה, אז הם יתעדכנו לבד.
   - כשיש לזן סרטון סיבוב, `Arch` משתמש בפוסטר `.jpg`. בודקים שהוא נראה טוב בתוך הקשת.
3. **סרטוני כניסה וסיום (D, E):** מוסיפים לטיפוס `Turntable` את השדות האופציונליים `intro?` ו־`finale?`.
   - **כניסה:** ב־`Breed.tsx` מנגנים אותו פעם אחת מעל הבמה בזמן מעבר ה־iris, ואז עושים fade לסרטון הסיבוב.
   - **סיום:** בעצירת `finale` מנגנים אותו במקום להריץ את סרטון הסיבוב.
   - **כבוד ל־`prefers-reduced-motion`:** במצב הזה מציגים את הפוסטר ולא מנגנים.
4. **הכלבים בקשת התוצאות ובקרוסלה** צריכים לעמוד באותו גודל ובאותו גובה רצפה. אם תמונה אחת יוצאת גדולה או נמוכה מהשאר, מיישרים אותה ב־CSS לפי זן, או חותכים מחדש ב־ffmpeg.

## בדיקות לפני שמראים ל־uriel

1. `npm run build`, ואז `npx vitest run`, ואז `npx playwright test --trace off`. **כל הבדיקות צריכות לעבור.** בדיקת הנגישות (axe) רצה על כל המסכים, במצב יום ובמצב לילה.
2. `npm run preview`, ואז בדפדפן:
   - **בגלילה בדף הזן:** הכלב מסתובב חלק, בלי קפיצות, וכל עצירה מראה את החלק הנכון בגוף.
   - **בטלפון (390×844):** הכלב בחלק העליון, והטקסט מתחת.
   - **מהירות:** הדף נטען מהר. אם לא, מקטינים את הסרטונים.
3. **צילומי מסך** של הקרוסלה, של שלוש עצירות בדף הזן ושל הסיום, בדסקטופ ובטלפון.
4. `npm run build:single` מייצר מחדש את קובץ ה־HTML היחיד ב־`dist-single/index.html`.
5. **commit ו־push** ל־`main`, עם הודעה ברורה באנגלית.

## מה מראים ל־uriel בסוף הפיילוט

הודעה קצרה בעברית, עם:

- הצילומים;
- כמה קרדיטים יצאו;
- מה עבד ומה לא (למשל: "הסיבוב קופץ בשנייה 4, ייצרתי מחדש");
- השאלה אם להמשיך לשאר 20 הזנים, והעלות המשוערת.

**אחרי אישור:** מייצרים בקבוצות של 4–5 זנים (batch, ואז `jobs_wait`), ומראים אחרי כל קבוצה.

## אופציה למתקדמים: מודל תלת־ממד אמיתי במקום סרטון

ל־Higgsfield יש `generate_3d`, שהופך תמונה למודל GLB. **נסה את זה רק אחרי שהפיילוט בסרטונים עובד, ורק באישור של uriel:**

- נותנים לו את תמונת הקרוסלה (B) של בורדר קולי.
- מקבלים GLB, ובודקים ב־`npm run dev` אם הוא נראה טוב יותר מסרטון הסיבוב. בודקים פרווה, רגליים וגודל קובץ: עד 5MB.
- אם כן, שמים אותו ב־`public/dogs/{file}.glb`, ומורידים את הזן מ־`turntables` כדי שהבמה התלת־ממדית (`DogStage`) תשתמש בו.
- **מודל כזה לא זז** (אין לו שלד ואנימציה), ולכן הכלב יעמוד קפוא. את ההחלטה משאירים ל־uriel.
