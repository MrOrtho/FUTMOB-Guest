# FUTMOB Guest

A desktop app (built with Electron) for building a guest football match: formations, scoreboard, player stats and ratings. When you finish, export the match as a file and send it to the admin, who links each player to the real database.

---

## 1. Requirements

- **Windows 10/11** (the installer target; macOS and Linux can run it with `npm start`)
- **Node.js 18 or newer** - download from https://nodejs.org (the LTS version is fine)

Check it is installed by opening a terminal and running:

```
node -v
npm -v
```

## 2. Install

1. Unzip the project somewhere, e.g. `C:\futmob-electron`.
2. Open a terminal in that folder (in File Explorer, click the address bar, type `cmd`, press Enter).
3. Install the dependencies:

```
npm install
```

This downloads Electron and electron-builder. It only needs doing once.

## 3. Run the app

```
npm start
```

The FUTMOB Guest window opens.

## 4. Build an installer (optional)

```
npm run build
```

The installer is created in the `dist/` folder (for example `FUTMOB Guest Setup 1.0.0.exe`). Run it to install the app like any other program.

> The first build downloads extra files and can take a few minutes. If the installer shows a default icon, add an `icon.ico` file to the project and list it in the `build.files` array in `package.json`.

---

## 5. Using the app

### The top bar

The bar at the top stays visible at all times, including in full screen. Drag any empty part of it to move the window.

| Button | What it does |
|---|---|
| **? Instructions** | Shows how guest mode works. It also opens automatically the first time you use the app. |
| **+ New Match** | Starts a fresh match (asks first if you have one in progress). |
| **Import Match** | Loads a match file you exported earlier so you can fix mistakes. |
| **Export Match** | Saves the match as a `.json` file to send to the admin. |
| Settings (sliders icon) | Opens settings (see below). |
| Minimise / Maximise / Close | Standard window controls. |

### Building a match

1. **Match name and date** - type them in at the top of the left panel. Use **Rename / Friendly** to rename the match or mark it as a friendly.
2. **Teams** - click a team name to rename it. Each team has a formation box (e.g. `4-4-2`, `4-3-3`, or anything like `5-1`) and a **GK** tick for whether the team has a goalkeeper.
3. **Add a player** - click an empty `+` slot on the pitch, type the player's name (any name is fine, e.g. "Dan") and enter their stats:
   - Goals, assists, shots, penalties scored/missed, own goals, dribbles
   - Tackles, interceptions, clearances, blocks
   - Goalkeepers have their own set: saves, goals conceded, clearances, etc.
   - Yellow/red card, captain, minutes played
   - Goal minutes, written like `12, 45+2`

   Click **Save stats**. Cancelling on a brand-new slot removes it again.
4. **Ratings and Man of the Match** - ratings are calculated automatically from the stats. The Man of the Match goes to the best-rated player on the winning team (or either team if it is a draw).
5. **Scoreboard** - the score, scorers and minutes, cards and missed penalties update by themselves as you enter stats.
6. **Edit Formation** - turn this on to swap players between slots on the same team. Choose *Tap to swap* (tap one player, then another) or *Drag to swap*. A goalkeeper can only swap with another goalkeeper slot.
7. **Full screen** - the button below the pitch enlarges the pitch to fill the window. The top bar stays in place. Press **Esc** to leave full screen.

### Sending your match

1. Make sure every player has a real name (the app warns you about anyone still called "New Player").
2. Click **Export Match**. A file named like `futmob-guest-sunday-kickabout-2026-10-28.json` is saved.
3. Send that file to the admin.

If you spot a mistake afterwards, click **Import Match**, choose your exported file, fix it, and export again. Only files exported from this app are accepted.

### Old games

If you come back to a match that has not been edited for 1 or more days, the app says it is an old game and asks:

- **Make a new game** - clears it and starts a new match dated today. Export the old one first if you still need it.
- **Continue editing** - keeps the match; the one-day clock restarts from now.

### Settings

Click the sliders icon in the top bar.

- **Save Progress locally** (on by default)
  - **On:** your match is kept on this computer between sessions, so you can close the app and carry on later.
  - **Off:** when you close the app, everything saved is wiped and it opens fresh next time. The instructions pop-up will also show again.

---

## 6. Where your data is stored

- Your match is saved automatically in the app's local storage, in your user profile (on Windows: `%APPDATA%\futmob-guest`).
- The settings file (`settings.json`) is in the same folder.
- Exported matches go wherever you choose to save them.

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `npm` is not recognised | Install Node.js and reopen the terminal. |
| `npm install` fails or is very slow | Check your internet connection and try again. Some school/work networks block the Electron download. |
| Window is blank | Close it, run `npm install` again, then `npm start`. |
| My match disappeared | "Save Progress locally" was probably off. Turn it on in settings for next time, or re-import your exported file. |
| Import says "not a guest match file" | Pick a file made with **Export Match** in this app, not a full FUTMOB save file. |

## 8. Project layout

```
futmob-electron/
├── main.js        Creates the window, handles minimise/maximise/close and settings
├── preload.js     Safe bridge between the page and main.js
├── package.json   Dependencies and build settings
├── icon.png       Window icon
├── README.md      This file
└── src/
    └── index.html The whole app (top bar, match builder, pitch, stats)
```
