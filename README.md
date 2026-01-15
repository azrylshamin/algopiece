# AlgoPiece 🧩

**Visualizing Algorithms, simplifying Logic.**

AlgoPiece is an interactive, gamified learning platform designed to make Data Structures and Algorithms (DSA) accessible and engaging for everyone. By combining dynamic algorithm visualizers with a drag-and-drop block coding interface, we bridge the gap between abstract concepts and executable code.

---

## 🚩 The Problem
Learning algorithms can be intimidating. Beginners often struggle with:
*   **Abstract Concepts:** It's hard to visualize how algorithms like Bubble Sort or Dijkstra's actually move data.
*   **Syntax Barriers:** Fighting with semicolon errors in Java or C++ distracts from the core logic.
*   **Lack of Engagement:** Traditional text-books and lectures can be dry and theoretical.

## 💡 The Solution
AlgoPiece transforms the learning experience:
1.  **Visualizers First:** See the algorithm run step-by-step with real-time graphs and animations.
2.  **No-Code interface:** Use **Blockly** to build algorithms logically without worrying about syntax.
3.  **Gamification:** Earn XP, badges, and track your progress as you master new concepts.
4.  **Multi-Language Generation:** Build with blocks, then instantly see the equivalent **JavaScript** and **Python** code.

---

## ✨ Key Features

### 🖥️ Interactive Visualizers
*   Real-time animation of sorting algorithms (Bubble Sort, etc.).
*   Control playback (Play, Pause, Step-by-Step).
*   Adjustable speed and dataset sizes.

### 🧱 Block-Based Coding (Blockly Integration)
*   **Powered by Blockly v12**: The latest, most stable version of Google's block library.
*   **Custom Blocks**: Tailored blocks for array operations (`create`, `get`, `swap`) and logging steps.
*   **Standard Toolbox**: Full suite of Logic, Loops, Math, Text, Lists, and Variable blocks.
*   **JSON Serialization**: Modern, robust save/load system for your workspaces.

### ⚡ Instant Code Generation
*   Watch your blocks translate into production-ready code in real-time.
*   Toggle between **JavaScript** and **Python** code views.
*   Run your code directly in the browser (sandbox environment).

### 🏆 Gamified Learning
*   User Profiles with avatars and levels.
*   Achievement Badges (e.g., "Sorting Master").
*   Skill progress tracking.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Block Engine:** [Blockly v12](https://developers.google.com/blockly)
*   **Visualization:** Recharts & CSS animations
*   **Icons:** Lucide React
*   **Styling:** Modern CSS3 (Variables, Flexbox/Grid)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/algopiece-mvp.git
    cd algopiece-mvp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:5173` to start building!

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── blockly/       # Blockly integration (Workspace, config, custom blocks)
│   ├── visualizers/   # Algorithm visualization components
│   └── layout/        # Header, Sidebar, Footer
├── pages/
│   ├── AlgorithmDetail # Main learning page (Visualizer + Blocks)
│   ├── Build          # Free-form coding playground
│   └── Profile        # User stats and achievements
├── data/              # Mock data (Standardized services)
└── styles/            # Global CSS variables and reset
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
