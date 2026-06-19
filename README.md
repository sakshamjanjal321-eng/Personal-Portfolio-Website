# Personal Portfolio Website

A premium, high-fidelity, and fully responsive static portfolio website designed for full-stack software engineers and data systems builders. 

## Features
- **Curated Theme Architectures:** Implements fully synchronized Dark and Light HSL color palettes stored in custom CSS properties. Theme switches are persisted via `localStorage`.
- **High-Performance Static Structure:** Requires no build tools or bundlers. Runs natively in any modern browser out-of-the-box, ensuring sub-millisecond load times.
- **Interactive Component Elements:**
  - Dynamic scroll-reveal triggers (`IntersectionObserver`) that slide cards in and animate skill tracks.
  - Active section link state updates inside the header as users scroll.
  - Categorized portfolio filter bar (All, Web Apps, Data Science, Developer Tools) with enter/exit fade animations.
  - Form field validation (float label patterns, input checker checks, visual toast status notices).
  - Quick email clipboard-copy utility.
- **High-Fidelity Visual Elements:** Uses inline SVGs to display glowing dev setups and pipeline cogs, avoiding heavy external images or assets.

## Project Structure
```
├── index.html        # Main DOM layout structure
├── style.css         # Modular CSS system containing colors, layout grids, & theme properties
├── app.js            # Theme togglers, dynamic grids, contact forms, & animation layers
└── README.md         # Customization guidelines
```

## Setup & Local Development
1. Clone or download this project folder.
2. Open `index.html` directly in any web browser (Chrome, Edge, Safari, Firefox).
3. No local server, dependencies, or installations required.

## Customization Guide

### 1. Changing Bio & Name
Open [index.html](file:///c:/Users/saksh/OneDrive/Desktop/Personal%20Portfolio%20Website/index.html) and search for the respective sections (`#hero`, `#about`) to change your heading taglines, bio paragraph texts, and timeline checkpoints.

### 2. Modifying Core Skills
Inside `index.html`, scroll to the `#skills` section. You can customize category titles and individual skill bar percentages:
```html
<div class="skill-item">
    <div class="skill-info">
        <span class="skill-name">Python</span>
        <span class="skill-pct">85%</span>
    </div>
    <div class="skill-track">
        <!-- Adjust the data-width attribute to set progress percentages -->
        <div class="skill-bar" data-width="85%"></div>
    </div>
</div>
```

### 3. Adding/Editing Portfolio Projects
Open [app.js](file:///c:/Users/saksh/OneDrive/Desktop/Personal%20Portfolio%20Website/app.js) and update the `PROJECTS_DATA` array. You can add new objects or edit existing ones. The tags and layouts will adapt automatically:
```javascript
{
    id: 'unique-project-id',
    title: 'Your Project Title',
    category: 'web', // Options: 'web', 'data', 'tool'
    description: 'Detailed description of your engineering task...',
    tags: ['React', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/your-username/repo',
    demo: 'https://your-demo-url.com',
    svgContent: `...inline SVG layout to showcase your project visually...`
}
```

### 4. Customizing Style Colors
Open [style.css](file:///c:/Users/saksh/OneDrive/Desktop/Personal%20Portfolio%20Website/style.css) and customize the color system in the `:root` pseudo-class (for Dark Theme) or the `[data-theme="light"]` selector (for Light Theme). Adjust variables like `--primary` or `--secondary` using standard HSL format:
```css
:root {
    --primary: hsl(260, 95%, 68%);    /* Change violet primary hue */
    --secondary: hsl(190, 90%, 50%);  /* Change cyan secondary hue */
}
```

## Deployment Setup
To host your portfolio online for free:
- **GitHub Pages:** Create a repository named `yourusername.github.io`, push these files to the root, and select "Pages" in your repository Settings to go live.
- **Vercel:** Drag and drop this folder directly into [Vercel's Import Panel](https://vercel.com/new). It will auto-detect the static files and deploy instantly.
