# IdeaTracker AI

IdeaTracker AI is a web application that helps you track the progress of your ideas by breaking them down into manageable subtasks. It uses Google Generative AI to generate detailed breakdowns and subtasks for your ideas.

## Features

- Add new ideas with titles and descriptions.
- Automatically correct spelling and grammar for titles and descriptions.
- Generate detailed subtasks for each idea using Google Generative AI.
- Track the progress of each idea and its subtasks.
- View detailed breakdowns of each subtask.
- Save and load ideas from local storage.

## Technologies Used

- React
- TypeScript
- Vite
- Framer Motion
- Tailwind CSS
- Google Generative AI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ideatracker-ai.git
cd ideatracker-ai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Google Generative AI API key:

```properties
VITE_GEMINI_API_KEY=your_api_key_here
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:3000`.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Serve the production build:

```bash
npm run serve
# or
yarn serve
```

### ESLint Configuration

If you are developing a production application, we recommend updating the ESLint configuration to enable type-aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`.
- Optionally add `...tseslint.configs.stylisticTypeChecked`.
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## License

This project is licensed under the MIT License.
