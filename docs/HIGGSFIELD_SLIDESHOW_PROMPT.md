# פרומפט ל־Claude Code: שורת הכלבים עם ספוט לייט (Higgsfield)

> **איך משתמשים:** פותחים Claude Code בתיקייה `D:\IndieVerse\dog-match`, מריצים `git pull`, ומדביקים את כל מה שמתחת לקו.

---

## מה uriel רוצה (קרא פעמיים)

**כל הכלבים עומדים בשורה אחת, אחד ליד השני, על במה חשוכה. מעל כל כלב יש ספוט לייט משלו.** כשעוברים לכלב הבא (בחץ, בהחלקה או בגלגלת), הספוט של הכלב הקודם כבה, והספוט של הכלב הבא נדלק. הכלב שעליו עומדים מואר במלואו. כל השאר נשארים בחושך, ורואים מהם רק קו אור דק סביב הפרווה.

זה בדיוק כמו בסצנה הראשונה של סרטון הדוגמה: הפחיות עומדות בשורה, ורק האמצעית מוארת. הפריימים נמצאים ב־`docs/reference/showcase-frame-01.jpg` וב־`showcase-contact-sheet.jpg`. **תסתכל עליהם לפני שמתחילים.**

**זה לא סרטון סיבוב של כלב אחד, ולא דף של זן.** זו התצוגה של כל הכלבים יחד. היא מחליפה את הקרוסלה שבדף "ספריית הכלבים" (`src/pages/Library.tsx`), ואפשר להשתמש בה גם בדף הבית.

**מה מייצרים:**
1. **באתר, וזה העיקר:** שורה אינטראקטיבית. התמונות של הכלבים מגיעות מ־Higgsfield, והאור והמעבר בין הכלבים נבנים בקוד.
2. **סרטון לרשתות, רק אחרי שהאתר מוכן ובאישור:** המצלמה עוברת לאורך השורה, והספוטים נדלקים אחד אחד.

## כללים שאסור לשבור

1. **לא מוציאים קרדיטים בלי אישור של uriel.**
   - לפני כל ייצור: `balance` והערכת מחיר.
   - מציגים לו בעברית: כמה תמונות, איזה מודל, וכמה קרדיטים בערך.
   - מחכים ל"כן".
2. **פיילוט קודם:** 3 זנים בלבד (בורדר קולי, לברדור, פאג), שורה עובדת באתר וצילום מסך ל־uriel. רק אחרי אישור ממשיכים לכל 21 הזנים.
3. **כל הכלבים בדיוק באותה זווית, באותו גובה מצלמה ובאותה תאורה.** אחרת השורה תיראה כמו קולאז' ולא כמו במה אחת. זה הדבר הכי חשוב.
4. **הגדלים אמיתיים:** צ'יוואווה קטן, ורועה גרמני גדול. כל הכלבים עומדים על אותו קו רצפה.
5. **בלי טקסט, לוגו, קולר או אביזרים בתמונות.** כל כלב צריך להיות נכון לזן.
6. **לא מעתיקים את המותג מהרפרנס,** רק את התאורה והקומפוזיציה.
7. **לא משנים את נוסחת ההתאמה ולא ממציאים מידע.** כל הטקסט באתר בעברית.

## שלב 0: היכרות עם Higgsfield

1. **`get_workflow_instructions`** בלי ארגומנט.
2. **`models_explore`** עם `action: "recommend"`: מודל לתמונות סטודיו פוטוריאליסטיות של כלבים, שתומך ב־**image reference** (כדי לשמור על אותה זווית ואותה תאורה בכל הזנים) וב־**edit** (כדי להחשיך תמונה קיימת בלי לשנות את הכלב).
3. **`get_preset_instructions`** עם `{ preset: "/3d-jutsu" }`, ובדיקה של `scene_builder_3d_*`. זה לשלב הסרטון. כרגע רק בודקים מה אפשר.
4. **`balance`.**

סכם ל־uriel בהודעה אחת: איזה מודל, כמה עולה הפיילוט (3 זנים), וכמה יעלו 21 זנים. **חכה לאישור.**

## חלק 1: תמונות הכלבים מ־Higgsfield

### 1א. תמונת "מאסטר" לפי זווית ותאורה

קודם מייצרים כלב אחד, בורדר קולי, עד שהזווית והתאורה מושלמות. התמונה הזו היא ה־reference לכל שאר הזנים.

```
Photorealistic studio photo of a single {BREED_EN}, {COAT}, full body from nose to tail and all four paws visible,
standing calmly, body in three-quarter view facing left, head turned slightly toward the camera,
camera at the dog's chest height, 70mm lens, dog centered with empty space above it.
Pure black seamless stage, one hard spotlight straight from above creating a soft pool of light on the floor under the dog,
thin warm rim light from behind outlining the fur, subtle glossy black floor with a faint reflection of the paws.
Realistic fur, accurate breed anatomy, friendly calm expression. No collar, no props, no text, no watermark.
```

**negative:**

```
cartoon, 3d render, toy, plastic, extra legs, cropped paws, collar, harness, text, logo, colored background, multiple dogs
```

**4 גרסאות לכל זן.** בוחרים לפי:
1. אנטומיה נכונה: 4 רגליים וכפות שלמות.
2. זווית זהה למאסטר.
3. הכלב נראה כמו הזן.

### 1ב. שאר הזנים

אותו פרומפט, **עם תמונת המאסטר כ־image reference** לזווית, לתאורה ולקומפוזיציה, בחוזק בינוני. מחליפים רק את `{BREED_EN}` ואת `{COAT}` לפי הטבלה בסוף הקובץ.

### 1ג. שני מצבים לכל כלב: מואר וכבוי

- **מואר (`on`):** התמונה שנבחרה.
- **כבוי (`off`):** **עריכה של אותה תמונה** (edit או image-to-image, ולא ייצור חדש), כדי שהכלב יישאר זהה בדיוק:

```
Same photo, same dog, same pose and framing. The overhead spotlight is switched off:
the dog is almost a silhouette in darkness, only a thin rim of light along the back, ears and tail edges,
no light pool on the floor. Do not change the dog, the pose or the framing.
```

אם העריכה משנה את הכלב, מוותרים על תמונת `off`, ומחשיכים בקוד את תמונת ה־`on` (ראה חלק 2).

### 1ד. הסרת רקע

על שתי התמונות מריצים `remove_background`, ושומרים כ־PNG שקוף. **את השתקפות הרצפה מוותרים.** האתר יוסיף צל והשתקפות בעצמו.

### 1ה. עיבוד ושמירה

```bash
# גובה אחיד 1000 פיקסלים, WebP שקוף
ffmpeg -i {file}_on.png  -vf "scale=-2:1000" -c:v libwebp -quality 86 public/dogs/lineup/{file}_on.webp
ffmpeg -i {file}_off.png -vf "scale=-2:1000" -c:v libwebp -quality 80 public/dogs/lineup/{file}_off.webp
```

**יישור:** חותכים כל תמונה כך שהכפות נוגעות בתחתית הפריים, עם 2% שוליים בלבד. ככה כולם עומדים על אותו קו רצפה. שמות הקבצים לפי עמודת "קובץ" בטבלה.

## חלק 2: השורה באתר (`src/pages/Library.tsx`)

הקרוסלה הקיימת מציגה קשתות שחורות על רקע בלאש. **מחליפים אותה בבמה חשוכה עם ספוטים:**

### הבמה

- **רקע:** `#0B0809`, עם גרדיאנט רדיאלי עדין `#1A1013` במרכז התחתון. **זה החלק היחיד באתר שכהה כבר בכניסה.** הכותרת והחיצים לבנים (`#F6E4E2`).
- **רצפה:** פס כהה בתחתית. מתחת לכל כלב יש צל אליפטי מטושטש, ובכלב המואר גם השתקפות חלשה: אותה תמונה הפוכה, opacity של 0.12 ומסכה של גרדיאנט.

### השורה

- כל 21 הכלבים בשורה אופקית אחת, ממוינים לפי הסדר ב־`breeds.json`.
- הכלב הפעיל במרכז המסך.
- **גובה כל כלב לפי המשקל האמיתי** (`breed.care.weightKg`): מנרמלים בין 45% ל־100% מגובה הבמה.
- **רווח קבוע בין הכלבים:** הכלב הפעיל לא "קופץ" בגודל. הוא רק נדלק.
- **מעבר לכלב הבא:** השורה כולה מחליקה עד שהוא במרכז. 650ms ב־`cubic-bezier(.22,1,.36,1)`.

### הספוט לייט (לב העניין)

- **אלומה:** מעל כל כלב יש `div` עם `background: conic-gradient(...)` או משולש עם `linear-gradient`, מטושטש, עם `mix-blend-mode: screen`.
  - האלומה יורדת מנקודה בראש הבמה ונפתחת לרוחב הכלב.
  - הצבע לבן־חמים, `rgba(255,240,225,.22)`, עם נגיעה של `accent` של הזן מ־`breedTheme.ts`.
- **כתם אור על הרצפה:** אליפסה בהירה מתחת לכלב הפעיל.
- **מעבר בין כלבים:**
  1. הספוט הנוכחי כבה ב־180ms.
  2. השורה מחליקה.
  3. הספוט החדש נדלק ב־350ms: **הבהוב קצר אחד** (opacity 0, ‏0.6, ‏0.3, ‏1) כמו פנס אמיתי שנדלק.
  4. תמונת `on` עושה cross-fade מעל תמונת `off`.
- **בלי תמונת `off`:** מחשיכים בקוד את תמונת ה־`on` עם `filter: brightness(.18) contrast(1.1)`, ומוסיפים rim דק עם `drop-shadow(0 0 1px accent)`.
- **אבק באלומה:** 10–14 חלקיקים זעירים שמרחפים לאט רק בתוך האלומה הפעילה. **בלי canvas כבד:** מספיק CSS עם `transform`.
- **מתחת לכלב הפעיל:**
  - שם הזן בגופן הכותרות של האתר (Frank Ruhl Libre 900).
  - אם המשתמש עשה את השאלון: אחוז ההתאמה.
  - כפתור "לכל הפרטים", שפותח את דף הזן עם מעבר ה־iris הקיים.

### שליטה ונגישות

- **שליטה:** חיצים ‹ ›, החלקה בטלפון, גלגלת אופקית, ומקלדת (חיצים, Enter, Esc). **RTL:** הכלב הבא משמאל.
- **הכרזה לקורא מסך:** `aria-live="polite"` מכריז "{שם הזן}, {X} מתוך 21".
- **כל כלב הוא `<button>`** עם `aria-label` של שם הזן. לחיצה על כלב לא פעיל מביאה אותו למרכז.
- **`prefers-reduced-motion`:** בלי החלקה, בלי הבהוב ובלי חלקיקים. רק cross-fade של 200ms.
- **ביצועים:**
  - טוענים רק את 7 הכלבים הקרובים (`loading="lazy"` לשאר).
  - מאנימציה רק `transform` ו־`opacity`, בלי לאנימציה `filter`.
  - היעד: 60fps בטלפון.
- **בטלפון (390×844):** רואים את הכלב הפעיל ועוד כלב חלקי מכל צד.

### בדיקות

1. `npm run build`, `npx vitest run`, `npx playwright test --trace off`. **הכל צריך לעבור,** כולל axe במצב יום ובמצב לילה.
2. **צילומי מסך:** השורה עם בורדר קולי מואר, ואחרי מעבר אחד עם לברדור מואר, בדסקטופ ובטלפון.
3. `npm run build:single`, ואז commit ו־push ל־`main`.

## חלק 3: סרטון לרשתות (אופציונלי, רק אחרי שהאתר מאושר ובאישור על המחיר)

**דרך א, עדיפה:** `scene_builder_3d`.
- מייבאים את תמונות ה־`on` כנכסים, או את ה־GLB מ־`generate_3d` אם uriel אישר.
- מסדרים בשורה על במה שחורה, עם ספוט מעל כל כלב.
- המצלמה זזה לאט לאורך השורה (truck), והספוטים נדלקים אחד אחד.
- 9:16 ו־16:9, ‏15–20 שניות.

**דרך ב:** image-to-video, כש־start frame הוא צילום מסך של השורה באתר:

```
Slow cinematic camera truck from right to left along a row of dogs standing on a dark stage,
each dog lights up under its own overhead spotlight as the camera reaches it while the previous spotlight fades,
dust floating in the light beams, glossy black floor reflections. Dogs stay in place, no text.
```

## הזנים: תיאור לפרומפט, קובץ וצבע

| id | קובץ | BREED_EN | COAT | ACCENT |
| --- | --- | --- | --- | --- |
| border-collie | border_collie | Border Collie | black and white medium-length coat, white blaze and chest | #9FB7E0 |
| labrador | labrador | Labrador Retriever | short dense yellow coat | #F2B25C |
| golden | golden | Golden Retriever | long wavy golden coat with feathering | #FFC46B |
| gsd | gsd | German Shepherd | black and tan saddle coat | #E39A55 |
| husky | husky | Siberian Husky | grey and white thick coat, light blue eyes | #BFD8FF |
| poodle | poodle | Toy Poodle | apricot curly coat, natural trim | #F1E3EA |
| maltese | maltese | Maltese | long silky white coat | #F1E3EA |
| shih-tzu | shih_tzu | Shih Tzu | long gold and white coat | #F1E3EA |
| french-bulldog | french_bulldog | French Bulldog | short fawn coat, bat ears | #E8C9A4 |
| pug | pug | Pug | short fawn coat with black mask | #E8C9A4 |
| english-bulldog | english_bulldog | English Bulldog | short white and brindle coat | #E8C9A4 |
| beagle | beagle | Beagle | tricolor short coat, long ears | #F09A5B |
| boxer | boxer | Boxer | short fawn coat, white chest, black mask | #F09A5B |
| dachshund | dachshund | Dachshund | smooth short red coat | #F09A5B |
| chihuahua | chihuahua | Chihuahua | smooth short cream coat, big upright ears | #E8C9A4 |
| yorkshire | yorkshire | Yorkshire Terrier | long silky steel blue and tan coat | #F1E3EA |
| aussie | aussie | Australian Shepherd | blue merle coat with copper points | #9FB7E0 |
| canaan | canaan | Canaan Dog | short sandy cream coat, upright ears, curled tail | #F3D9A6 |
| mixed-small | mixed_small | small mixed-breed dog | short brown and white coat | #E7A9A0 |
| mixed-medium | mixed_medium | medium mixed-breed dog | short tan coat | #E7A9A0 |
| mixed-large | mixed_large | large mixed-breed dog | short black coat with white chest | #E7A9A0 |

תיאורי הפרווה הם לפרומפט בלבד. בודקים שהתוצאה נראית כמו הזן. לשלושת המעורבים יש כאן קובץ נפרד לכל אחד, ולכן צריך לעדכן את `file()` ב־`src/lib/dogAssets.ts` (היום שלושתם הם `mixed`), או להוסיף פונקציה `dogLineup(id, state)`.

## מה מראים ל־uriel בסוף הפיילוט

הודעה קצרה בעברית, עם:

- צילומי המסך;
- כמה קרדיטים יצאו;
- מה עבד ומה לא;
- השאלה אם להמשיך לכל 21 הזנים, והמחיר המשוער.
