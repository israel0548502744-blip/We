# שמחה לביא – אתר הרצאות

אתר סטטי בעברית (RTL) להזמנת הרצאות של שמחה לביא. ללא build.

- `site/` – האתר (`index.html`, `styles.css`, `main.js`, תמונות וסרטונים)
- `aliyah/` – אנימציית "העלייה של האיכר"

## הרצה מקומית

    npx serve site      # או: cd site && python3 -m http.server

## לפני עלייה לאוויר

מלאו את `SITE_CONFIG` בראש `site/main.js` (מספר וואטסאפ, מייל, קישורי טיקטוק ויוטיוב),
והחליפו את הסרטון בכפתור "טעימה מההרצאה" ב-`site/index.html` (`data-video`) אם צריך.
