# 🎮 Creeper Tools

A collection of utility tools for Minecraft Java Edition (1.21.11), built to assist players with everyday gameplay calculations and planning.

> ⚠️ **This project is actively under development.** New tools and features are being added regularly. Contributions, suggestions, and feedback are welcome!

**Live:** [https://creepertools.vercel.app/](https://creepertools.vercel.app/)

---

## 🛠️ Tools

### 🌋 Nether Coordinate Calculator
Converts coordinates between the Overworld and the Nether dimensions using the 8:1 scale ratio.

- Dimension selector (Overworld ↔ Nether)
- Input fields for X, Y, Z coordinates
- Real-time result calculation
- Copy coordinates to clipboard
- Copy `/tp` command to clipboard

### ⚒️ Crafting Material Calculator
Calculates the total raw materials needed to craft any quantity of a craftable item, recursively breaking down every ingredient to its base components.

- Searchable list of all craftable items (Java 1.21.11)
- Quantity input
- Recursive ingredient tree displayed visually
- Raw material summary with stack conversion (e.g. "2 stacks + 4 items")
- Cycle detection to handle circular recipes (e.g. gold ingot ↔ gold nugget)
- History sidebar with previous calculations
- Export raw materials as `.json` for use in checklists
- Delete individual history entries or clear all

---

## 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14+](https://nextjs.org/) (App Router) | Framework |
| [React](https://react.dev/) | UI |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Motion](https://motion.dev/) | Animations |
| [Vercel](https://vercel.com/) | Hosting & CI/CD |

---

## 📁 Project Structure

```
app/
├── page.tsx                    # Home / tool menu
├── layout.tsx                  # Global layout with header
├── types.ts                    # Shared TypeScript interfaces
├── nether/
│   └── page.tsx                # Nether coordinate calculator
└── crafting/
    ├── page.tsx                # Crafting material calculator
    └── components/
        ├── TreeNode.tsx        # Recursive ingredient tree component
        ├── RawMaterialsSummary.tsx  # Raw materials display
        └── Sidebar.tsx         # History sidebar

data/
└── 1.21.11/                    # Minecraft Java 1.21.11 game data
    ├── items.json
    ├── recipes.json
    └── ...                     # Other data files available for future tools

public/
└── images/                     # Static assets
```

---

## 🧠 Key Technical Decisions

### Client-side only (no backend)
All calculations happen in the browser. The Minecraft game data (items, recipes) is bundled as static JSON files extracted from the official game JAR. This keeps the app fast, free to host, and simple to maintain.

> The `minecraft-data` npm package was originally used but removed due to Vercel's 250MB serverless function size limit. The relevant JSON files were extracted and committed directly to the repository.

### Recursive crafting algorithm
The `calcMaterials()` function recursively traverses ingredient trees until it reaches raw materials (items with no crafting recipe). It handles:

- **Shaped recipes** (`inShape` — 3x3 grid)
- **Shapeless recipes** (`ingredients` — unordered list)
- **Cycle detection** via a `visited` Set to prevent infinite recursion
- **Direct cycle detection** via `hasCycle()` to handle items that are ingredients of each other (e.g. gold ingot ↔ gold nugget)

### Stack conversion
Raw material quantities are automatically converted to Minecraft stacks (64 items each), showing stacks and remainder for easier in-game counting.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/mfsouza95/minecraft-tools.git
cd minecraft-tools

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Roadmap

The following features are planned for future releases:

- [ ] **Enchantment checklist** — mark enchantments you already have
- [ ] **Material checklist** — import exported JSON and track collection progress with per-item input
- [ ] **Recipe selector** — choose which recipe variant to use per item (e.g. oak vs birch planks)
- [ ] **Wood preference setting** — default to a preferred wood type across all recipes
- [ ] **Nugget → Ingot consolidation** — option to always convert nuggets to ingots in the final raw material summary
- [ ] **Full mobile responsiveness** — optimized layout for all screen sizes
- [ ] **Calculation groups** — combine multiple calculations and export a merged material list

---

## 🧪 Testing

> Testing suite is planned. The goal is to cover:
> - Unit tests for `calcMaterials()`, `hasCycle()`, `isRawMaterial()`, and `exportHistory()` with **Jest**
> - CI pipeline via **GitHub Actions** to run tests on every push to `main`

---

## 📄 License

This project is open source. Minecraft data used is sourced directly from the official Minecraft Java Edition game files and is subject to Mojang's [EULA](https://www.minecraft.net/en-us/eula).
