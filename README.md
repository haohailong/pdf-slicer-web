# PDF Slicer

![PDF Slicer Banner](public/pwa-512x512.png)

A highly aesthetic, **local-first** web application designed to instantly split dual-page PDF scans (like books or sheet music) into individual, properly ordered single pages perfectly down the middle. 

**Zero servers, zero privacy risks.** All processing is done client-side in your browser using JavaScript and WebAssembly.

---

## ✨ Features

- **100% Local Processing:** Files never leave your device. Your data is not uploaded to any server.
- **Progressive Web App (PWA):** Install it directly to your desktop or mobile device. Works completely offline.
- **Premium UI/UX:** Built with a stunning Glassmorphism design, dark mode, smooth animations, and drag-and-drop support.
- **Lightning Fast:** Uses `pdf-lib` to directly manipulate PDF metadata without re-rendering pixels.

## 🛠 Tech Stack

- **Framework:** React + TypeScript (via Vite)
- **Styling:** Tailwind CSS (v3) + Lucide Icons
- **PDF Engine:** `pdf-lib`
- **PWA:** `vite-plugin-pwa`

## 🚀 Getting Started (Local Development)

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation

1. Clone the repository (or download the source):
   ```bash
   git clone https://github.com/your-username/pdf-slicer.git
   cd pdf-slicer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:5173`

## 📦 Deployment (Hosting)

Since this is a pure static frontend application, it can be deployed anywhere for **free**.

1. Build the project:
   ```bash
   npm run build
   ```
   This will generate a `dist` folder containing all the static files.

2. **Deploy to GitHub Pages, Vercel, Netlify, or Cloudflare Pages:**
   Simply drag and drop the `dist` folder into your hosting provider, or link your GitHub repository to automatically build and deploy.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
