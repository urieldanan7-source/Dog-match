# פרומפט ל־Claude Code: הלברדור רץ לבעלים שלו (Higgsfield)

> **איך משתמשים:** שמים את קובץ הלברדור שלך בתיקייה `D:\IndieVerse\dog-match\assets-in\labrador\`. זה יכול להיות GLB, FBX או OBJ, תמונות או רנדרים של המודל, או סרטון סיבוב.
> אחר כך פותחים Claude Code בתיקייה `D:\IndieVerse\dog-match` ומדביקים את כל מה שמתחת לקו.

---

## המשימה

צור עם **Higgsfield** (כלי ה־MCP שמתחילים ב־`mcp__Higgsfield__`) סרטון קצר וקולנועי:

**לברדור צהוב רץ בשמחה אל הבעלים שלו, בעולם ירוק בסגנון קמפוס של אוניברסיטה. שניהם מחייכים, והחיים טובים.**

הכלב צריך להיות **הלברדור שבנוי בתלת־ממד שבתיקייה `assets-in/labrador/`**, ולא כלב אחר. הסרטון ישמש באתר "איזה כלב מתאים לי" בתור סרטון פתיחה בדף הבית, ובפוסטים ברשתות.

## כללים שאסור לשבור

1. **לא מוציאים קרדיטים בלי אישור של uriel.**
   - לפני כל ייצור: `balance` והערכת מחיר.
   - מציגים לו בעברית: כמה שוטים, איזה מודל, וכמה קרדיטים בערך.
   - מחכים ל"כן".
2. **קודם תמונה, אחר כך וידאו:**
   - מייצרים פריים מפתח (תמונה) לכל שוט ומראים ל־uriel.
   - רק אחרי אישור הופכים את הפריים לווידאו, כי וידאו יקר יותר.
3. **הכלב נשאר אותו כלב בכל השוטים:**
   - אותו מבנה גוף, אותו גוון צהוב ואותו קולר, אם יש למודל קולר.
   - הוא בנוי מהמודל של uriel, ולא מכלב שהמודל ממציא.
4. **הבעלים הוא דמות בדויה:**
   - לא אדם אמיתי ולא סלבריטי.
   - לא משתמשים בתמונה של אדם אמיתי כרפרנס, אלא אם uriel נותן תמונה שלו עצמו ומבקש.
5. **בלי טקסט, לוגו, שם של אוניברסיטה אמיתית או סימן מים בתוך הסרטון.** הקמפוס הוא קמפוס בדוי.
6. **הסגנון זהה לכלב שהביא uriel:**
   - אם המודל מסוגנן (תלת־ממד מעוצב, כמו סרט אנימציה), כל העולם והבעלים באותו סגנון.
   - אם המודל ריאליסטי, הכל ריאליסטי.
   - **לא מערבבים.**

## שלב 0: היכרות עם Higgsfield והכלב

1. **`get_workflow_instructions`** בלי ארגומנט: ההנחיות לסרטון מרובה שוטים.
2. **אם הכלב הוא קובץ תלת־ממד (GLB, FBX, OBJ):**
   - קרא את `get_preset_instructions` עם `{ preset: "/3d-jutsu" }`, ובדוק את כלי `scene_builder_3d_*`: אפשר לייבא את המודל (`scene_builder_3d_import_asset`) ולרנדר ממנו זוויות (`scene_builder_3d_generate_angles`).
   - **אם זה לא עובד**, רנדר בעצמך 6 תמונות של המודל ב־Blender (`pip install bpy`) או ב־three.js:
     - צד שמאל, צד ימין, 3/4 מקדימה, מקדימה, 3/4 מאחור, ומלמעלה בזווית.
     - רקע אפור ניטרלי ותאורה רכה, ברזולוציה של 1536px.
   - אם יש במודל אנימציית ריצה, רנדר גם 3 פריימים מתוך הריצה.
3. **אם הכלב הוא תמונות או סרטון:** משתמשים בהם ישירות.
4. **העלאה:** מעלים את התמונות עם `media_upload`, ואחר כך `media_confirm`.
5. **שמירת הכלב כאלמנט:**
   - שמור את הכלב כ"אלמנט רפרנס" או "דמות" עם `manage_reference_elements`, בשם `Labrador hero`, כדי שכל השוטים ישתמשו בו.
   - אם יש workflow של character sheet, השתמש בו לכלב: `get_workflow_instructions` עם `{ workflow: "character-sheet" }`.
6. **בחירת מודלים:** `models_explore` עם `action: "recommend"`, פעם לתמונה עם רפרנס של דמות ופעם ל־image-to-video עם תנועה מהירה (ריצה) ושמירה על הדמות. בחר מודל שתומך ב־start frame, וב־end frame אם אפשר.
7. **תנועות מצלמה מוכנות:** `get_presets` עם `category: "motion"`. חפש tracking shot, dolly in, crane up ו־orbit. **פתיחת הקטלוג לא מאשרת ייצור.**

סכם ל־uriel בהודעה אחת:
- איך נראה הכלב בתמונות הרפרנס;
- איזה מודלים בחרת;
- כמה יעלה הסרטון כולו בערך.

**חכה לאישור.**

## העולם והדמויות (משותף לכל השוטים)

- **המקום:** קמפוס אוניברסיטה בדוי ביום אביב.
  - מדשאה ירוקה ורחבה, שבילי לבנים, עצי אלון וערמונים גדולים.
  - בניין לבנים אדומות בסגנון קלאסי, עם קיסוס ירוק, חלונות לבנים ומגדל שעון ברקע.
  - **בלי שלטים ובלי שם.**
  - סטודנטים רחוקים ברקע, מטושטשים, יושבים על הדשא. אף אחד מהם לא במרכז.
- **האור:** שעת הזהב בשעות אחר הצהריים, שמש נמוכה מאחור.
  - קרני אור בין העצים ו־rim light חם על הפרווה.
  - צבעים: ירוק עשיר, זהב חם, שמיים תכלת־בהירים. מעט פרחים לבנים ואדמדמים בערוגות.
- **הבעלים:**
  - צעיר או צעירה בתחילת שנות ה־20, סטודנט.
  - ג'ינס, סווטשירט קולג' בצבע בורדו בלי כיתוב, סניקרס לבנים ותיק גב.
  - חיוך אמיתי וגדול, כורע על ברך אחת עם ידיים פתוחות.
  - **אותה דמות בכל השוטים:** שמור גם אותה כאלמנט רפרנס אחרי השוט הראשון שאושר.
- **הכלב:**
  - הלברדור של uriel, בשמחה מלאה: אוזניים מתנופפות, לשון בחוץ, זנב מכשכש ו"חיוך" של כלב.
  - **ריצה אמיתית של כלב (gallop)**, עם 4 רגליים ושני צעדים ברורים. בלי רגליים מיותרות ובלי החלקה.
- **מצב רוח:** חם, אופטימי ומרגש, כמו פרסומת טובה.

**negative** (לכל השוטים):

```
text, logo, signage, university name, watermark, extra legs, deformed paws, melting fur, different dog,
dog changes color, sad, dark, rain, crowd in focus, real celebrity, uncanny face
```

## השוטים (סה״כ 15–20 שניות)

לכל שוט מייצרים **קודם פריים מפתח** (תמונה עם רפרנס של הכלב ושל הבעלים), ואחר כך image-to-video שבו פריים המפתח הוא ה־start frame.

### שוט 1: פתיחה רחבה (3 שניות)

**מצלמה:** crane down איטי מגובה העצים אל המדשאה.

```
Wide establishing shot of a fictional university campus quad on a golden hour spring afternoon,
lush green lawn, red brick building with ivy and a clock tower, big oak trees, light rays through leaves,
students far in the background sitting on the grass, soft depth of field.
Slow crane down from tree height to the lawn. Warm, optimistic, cinematic. No text, no signs.
```

### שוט 2: הבעלים מגיע ורואה את הכלב (2.5 שניות)

**מצלמה:** medium shot, דחיפה קלה פנימה.

```
Medium shot of a cheerful college student (early 20s, burgundy college sweatshirt without any lettering, jeans, white sneakers, backpack)
stepping out of the brick building doors onto the lawn, sees their dog off screen and breaks into a huge genuine smile,
drops the backpack. Golden hour backlight, campus greenery behind. Slight push in.
```

### שוט 3: הכלב מזהה ומתחיל לרוץ (2.5 שניות)

**מצלמה:** נמוכה, בגובה הכלב.

```
Low angle shot at the dog's eye level: the yellow Labrador (reference: Labrador hero) lying on the green lawn under an oak tree
lifts its head, ears perk up, recognizes its owner and leaps up into a joyful run toward camera, tongue out, tail wagging.
Golden rim light on the fur, grass blades in the foreground slightly out of focus.
```

### שוט 4: הריצה, שהוא השוט המרכזי (4 שניות)

**מצלמה:** tracking מהצד, נעה במהירות של הכלב.

```
Side tracking shot running alongside the yellow Labrador (reference: Labrador hero) galloping happily across the campus lawn,
ears flapping, tongue out, a joyful dog smile, natural four-legged gallop, grass and a few petals flying,
brick building and trees sliding by in the background with motion blur, sun flare between trees.
Camera keeps the dog centered at a constant speed.
```

**אם הכלב "נמרח" בריצה:** מקצרים ל־2.5 שניות, או עושים שני קליפים קצרים. אפשר גם להשתמש באנימציית הריצה של המודל כ־motion reference, עם `motion_control` או לפי מה ש־`get_workflow_instructions` ממליץ.

### שוט 5: המפגש (3.5 שניות)

**מצלמה:** orbit איטי וחצי־מעגלי סביבם, בהילוך קצת איטי.

```
The yellow Labrador (reference: Labrador hero) leaps into the arms of the kneeling college student (same character as shot 2),
both overjoyed, the student laughing with eyes closed, the dog licking their cheek, tail wagging wildly.
Slow semi-circle orbit around them, slight slow motion, golden backlight, warm lens flare, green campus around them.
```

### שוט 6: הסיום (3 שניות)

**מצלמה:** pull back ו־crane up.

```
The student and the yellow Labrador walk side by side across the green campus lawn toward the sunset,
the dog looking up at its owner happily, the student smiling down. Camera pulls back and rises slowly,
revealing the whole campus quad in warm golden light. Peaceful, happy, life is good. No text.
```

## אחרי הייצור

1. **בדיקה של כל שוט:**
   - הכלב הוא אותו כלב, עם 4 רגליים ובלי עיוותים.
   - הבעלים הוא אותה דמות.
   - אין טקסט.

   מה שלא עובר נוצר מחדש. מראים ל־uriel את כל השוטים לפני החיבור.
2. **חיבור ב־ffmpeg:**
   - בין השוטים, cross-fade קצר של 6–8 פריימים. בין שוט 4 לשוט 5 עושים חיתוך חד, על הקפיצה.
   - צבעים אחידים: אותו חום, ומעט grain.
   - **בלי מוזיקה,** אלא אם uriel מבקש. מוזיקה אפשר לייצר ב־`generate_audio`, רק באישור ורק מוזיקה מקורית.
3. **גרסאות:**
   - **16:9, ‏1920×1080:** לאתר בדסקטופ וליוטיוב.
   - **9:16, ‏1080×1920:** לטלפון, לטיקטוק ולאינסטגרם. עושים עם `reframe` של Higgsfield, או בחיתוך חכם שמשאיר את הכלב במרכז.
   - **קליפ לופ של 6 שניות** מתוך שוט 4: לרקע של דף הבית, בלי קול, עד 3MB.
4. **שמירה:**
   - הסרטון המלא: `public/video/labrador-run-16x9.mp4` ו־`public/video/labrador-run-9x16.mp4`.
   - הלופ: `public/video/labrador-run-loop.mp4`, עם פוסטר `labrador-run-poster.jpg`.

   פקודת הקידוד:

   ```bash
   ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an out.mp4
   ```

## הכנסה לאתר (רק אחרי ש־uriel אישר את הסרטון)

- **בדף הבית (`src/pages/Home.tsx`):** מוסיפים אזור שבו הלופ רץ ברקע.
  - `<video autoplay muted loop playsinline poster=...>`.
  - מעליו הכותרת הקיימת, על שכבה כהה למטה, כדי שהטקסט יהיה קריא (ניגודיות 4.5:1).
  - **`prefers-reduced-motion`:** במצב הזה מציגים רק את הפוסטר.
  - הווידאו הוא `aria-hidden`, כי אין בו מידע.
- **בטלפון:** משתמשים בגרסת 9:16 או בפוסטר, ולא מורידים וידאו כבד ברשת סלולרית אם `navigator.connection.saveData`.
- **אחר כך:**
  - `npm run build`, `npx vitest run`, `npx playwright test --trace off`. **הכל צריך לעבור.**
  - `npm run build:single`.
  - commit ו־push ל־`main`.

## מה מראים ל־uriel בסוף

הודעה קצרה בעברית, עם:

- הסרטון המלא בשתי הגרסאות;
- צילום מסך של דף הבית עם הלופ;
- כמה קרדיטים יצאו;
- מה היה קשה (למשל: "שוט הריצה נוצר 3 פעמים עד שהרגליים יצאו נכון").
