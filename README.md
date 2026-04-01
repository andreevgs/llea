# LLEA — Your Smart Language Learning Assistant

LLEA is a modern web application designed for practicing foreign languages through writing essays and texts. The app leverages the power of generative Artificial Intelligence (Google Gemini and Qwen) to automatically review your texts, find mistakes, evaluate your grammar, and build your personalized vocabulary.

## About the Project

The main goal of **LLEA** is to help users bridge the gap between theory and practice. Write texts in your target language without the fear of making mistakes, knowing that the AI will carefully review every word.

- **Write Texts and Essays**: Practice writing in your chosen language. If you're a beginner, you can use a translator (there is a special checkbox to ensure your learning statistics remain accurate).
- **AI Analysis & Error Correction**: Each of your essays is analyzed by neural networks. The app highlights sentences with mistakes, suggests correct translations, and gives you a grammar score (out of 10).
- **Detailed Statistics & Progress**: A motivating points system! For every sentence without mistakes, you earn **+2 points**, while mistakes deduct **-1 point**. The app tracks your "clean" texts and average grammar level.
- **Personalized Dictionary**: Unknown or difficult words are extracted and saved into your personal database for future study.
- **Multilingual Interface**: Fully localized UI (English, Russian, Belarusian, Polish, Spanish, etc.), with a customizable "Native Language -> Target Language" setup.
- **Light & Dark Themes**: For a comfortable user experience at any time of the day.

## Technology Stack

- **Framework**: Vue 3 (Composition API)
- **UI Library**: Vuetify 3 (Material Design)
- **State Management & Routing**: Pinia, Vue Router
- **Internationalization**: Vue i18n
- **Bundler**: Vite
- **AI Providers**: Google Gemini, Qwen

---

## How to Run Locally

Ensure you have **Node.js** installed on your machine (v18 or v20+ is recommended).

1. **Clone the repository and navigate to the project directory:**

   ```bash
   git clone <repository-link>
   cd llea
   ```

2. **Install dependencies:**
   Use `npm` (or alternatively `yarn` / `pnpm`):

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

Once started, open the link provided by Vite in your browser (default is [http://localhost:3001](http://localhost:3001)). Any changes you make to the code will be instantly reflected in the browser (thanks to instant HMR).

## Build for Production

To generate the static minified files for production deployment:

```bash
npm run build
```

The optimized production-ready files will be generated in the `dist/` folder.

> The project is already configured for automatic deployment to **GitHub Pages** (via GitHub Actions). Upon any push to the `main` branch, the project will automatically build and deploy.
