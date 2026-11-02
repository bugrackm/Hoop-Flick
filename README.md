# Hoop Flick

Hoop Flick is a mobile-first HTML5 basketball game built around quick, skill-based physics. Aim your shot, release the ball, and keep climbing through increasingly challenging hoops.

## Play Now

No installation is required:

### [▶ Play Hoop Flick in your browser](https://bugrackm.github.io/Hoop-Flick/)

<p align="center">
  <img src="docs/media/gameplay.gif" alt="Hoop Flick gameplay: drag-and-release shots scoring perfect swishes" width="300">
</p>

The game works with mouse and touch controls. In my experience a mouse gives the most precise shots, but it plays well in mobile browsers too.

## How to Play

1. Select **Play** from the main menu.
2. Touch or click and drag to aim your shot.
3. Release to launch the ball.
4. Pass through each hoop and climb as high as you can.
5. Collect coins to unlock new balls and themes.

Clean shots and bank shots trigger special scoring feedback. As your score increases, the hoop layouts become more challenging.

## Features

- Physics-based drag-and-release gameplay
- Mobile, tablet, and desktop browser support
- Multiple hoop types and progressively harder layouts
- Collectible coins and persistent progression
- Unlockable ball skins and visual themes
- Light and dark modes
- Turkish and English language support
- High-score tracking and responsive sound effects

## Run Locally

Clone the repository:

```bash
git clone https://github.com/bugrackm/Hoop-Flick.git
cd Hoop-Flick
```

Start a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Stop the server with `Ctrl+C`.

Hoop Flick uses plain HTML, CSS, and JavaScript, so there is no package installation or build step.

## Project Structure

```text
Hoop-Flick/
├── index.html            # Game interface and entry point
├── style.css             # Responsive UI and visual styles
├── game.js               # Gameplay, physics, rendering, and progression
└── favicon.png           # Game icon
```

## License

All rights reserved.
