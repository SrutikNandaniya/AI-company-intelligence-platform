# StrategicAI — AI-Powered Company Intelligence & Recommendation Platform

> Enter any company name or website URL → Get real-time data from Wikipedia, Wikidata, and the company's own website → AI identifies challenges, recommends solutions, and generates a CEO-ready pitch.

---

## 🎯 What It Does

StrategicAI is a full-stack AI platform that researches any company in the world and produces strategic business recommendations. Unlike tools that just generate a static report, StrategicAI builds an interactive **RAG knowledge base** you can chat with, identifies **challenges with evidence**, ranks **AI solutions by impact score**, and writes an **executive-ready CEO pitch** — all from real, verified data.

### Two Input Modes

| Mode | Input | Data Sources | Best For |
|------|-------|-------------|----------|
| **🏢 Company Name** | "Prestige Group", "Google", "Tata Motors" | Wikipedia + Wikidata + Company Website | Well-known companies with Wikipedia articles |
| **🌐 Company Website** | "prestigeconstructions.com" | Jina AI Reader scrapes homepage, /about, /news, /projects (+ optional GLM-5.1 extraction) | Any company — even if not on Wikipedia |

### Key Features

- 📊 **Company Overview** — Industry, scale, founded year, employees, HQ, leadership (all real data)
- 🏢 **Business Information** — Offerings, projects, news, expansion plans from website & Wikipedia
- 💬 **RAG Chatbot** — Chat with company data, every answer grounded in real sources
- ⚠️ **Challenge Detection** — AI identifies business risks with reasoning + evidence
- 🤖 **AI Opportunities** — Strategic AI recommendations mapped to each challenge
- 🎯 **Impact Scoring** — (Impact + Feasibility + Urgency) / 3 ranking system
- 📝 **CEO Pitch Generator** — Auto-generated executive letter with phased roadmap
- 📄 **Export Report** — One-click download of complete analysis

---

## 🏗️ Architecture

```
Company Name  OR  Company Website URL
        │              │
  ┌─────▼─────┐  ┌────▼──────┐
  │ Wikipedia  │  │ Jina AI    │
  │ Wikidata   │  │ Reader API │
  │ Website    │  │ (Scrape)   │
  └─────┬─────┘  └────┬──────┘
        │              │
        │    ┌─────────▼─────────┐
        │    │ GLM-5.1 (Optional) │
        │    │ Intelligent Extract│
        │    └─────────┬─────────┘
        │              │
  ┌─────▼──────────────▼──────┐
  │   Data Merge & Cleaning    │
  └────────────┬──────────────┘
               │
  ┌────────────▼──────────────┐
  │   Vector Knowledge Base    │
  │   BAAI/bge-small-en-v1.5  │
  │   ChromaDB                 │
  └────────────┬──────────────┘
               │
  ┌────────────▼──────────────┐
  │   RAG Chatbot + AI Engine  │
  │   Challenges │ Opportunities│
  │   Impact Score │ CEO Pitch  │
  └───────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + TypeScript 5 | UI & application logic |
| Styling | Tailwind CSS 4 | Dark-themed responsive UI |
| Build | Vite 7 | Fast dev & production build |
| Embedding | BAAI/bge-small-en-v1.5 | Text vectorization for RAG |
| Vector DB | ChromaDB | Similarity search |
| RAG | LangChain | Retrieval-Augmented Generation |
| Web Scraping | Jina AI Reader (`r.jina.ai`) | URL → clean markdown (free, no key) |
| Wikipedia | MediaWiki REST API | Article search & full extracts (free) |
| Wikidata | wbgetentities API | Structured entity data (free) |
| LLM (Optional) | GLM-5.1 / GLM-4 Flash | AI-powered extraction (free tier available) |
| Icons | Lucide React | UI icon library |

**All data sources are 100% free. No API keys required** (except optional GLM-5.1 for enhanced extraction).

---

## 🚀 How to Run on Your Machine

### Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Step 1: Clone or Download

```bash
git clone <your-repo-url>
cd strategicai
```

Or download and extract the ZIP, then open the folder in your terminal.

### Step 2: Install Dependencies

```bash
npm install
```

This installs React, TypeScript, Tailwind CSS, Lucide React, and all other dependencies.

### Step 3: Start Development Server

```bash
npm run dev
```

Open your browser and go to **http://localhost:5173**

### Step 4: Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder. The output is a single `index.html` file that can be served anywhere.

### Step 5: Preview Production Build

```bash
npm run preview
```

---

## 🔑 Optional: Connect GLM-5.1 for AI-Powered Extraction

Without GLM-5.1, the platform works great using regex-based extraction. With GLM-5.1, you get significantly more accurate structured data from website content.

### Option A: OpenRouter (Recommended — Free Model Available)

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Generate an API key
4. In StrategicAI, click **"Connect GLM-5.1"** → Select **OpenRouter** → Paste your key → Select **GLM-4 Flash (Free)**

### Option B: Zhipu AI (Direct — Access to GLM-5.1)

1. Go to [open.bigmodel.cn](https://open.bigmodel.cn)
2. Register and get an API key (free trial credits)
3. In StrategicAI, click **"Connect GLM-5.1"** → Select **Zhipu AI** → Paste your key → Select **GLM-5.1**

> ⚠️ For browser-only usage, OpenRouter is recommended because it supports CORS. Direct Zhipu AI calls may be blocked by browser security policies.

---

## 📖 Project Documentation

The app includes a built-in **Project Documentation** page with 11 comprehensive sections covering architecture, approaches, challenges, solutions, and the GLM-5.1 integration guide. Click **"Project Documentation"** on the landing page, then use **"Save as PDF"** to export.

---

## 📁 Project Structure

```
src/
├── App.tsx                        # Main app — dual input, pipeline, dashboard
├── main.tsx                       # Entry point
├── index.css                      # Tailwind + print styles
├── types.ts                       # TypeScript types & pipeline stages
├── components/
│   ├── ChatPanel.tsx              # RAG chatbot interface
│   ├── InsightPanel.tsx           # Overview, Business, Challenges, AI Ops, Scoring, CEO Pitch
│   ├── ResearchPipeline.tsx       # Animated pipeline progress
│   └── Documentation.tsx         # Full project documentation + PDF export
└── utils/
    ├── wikiApi.ts                 # Wikipedia + Wikidata API integration
    ├── webScraper.ts              # Jina AI Reader website scraping
    ├── dataGenerator.ts           # Build CompanyData from all sources
    ├── chatEngine.ts              # RAG chatbot response engine
    └── llmExtractor.ts           # GLM-5.1 / GLM-4 Flash LLM integration
```

---

## 📊 Data Sources

| Source | What It Provides | API Key Needed? |
|--------|-----------------|-----------------|
| Wikipedia | Company articles, summaries, full text | ❌ No |
| Wikidata | Founded, industry, HQ, employees, CEO, founders, website | ❌ No |
| Jina AI Reader | Clean website content from any URL | ❌ No |
| GLM-5.1 / GLM-4 | Intelligent structured data extraction | ✅ Yes (free tier available) |

---

## ⚠️ Known Limitations

- **CORS**: Direct Zhipu AI API calls may be blocked in browsers. Use OpenRouter as a workaround.
- **Website Scraping**: Some websites may block Jina AI Reader or have JavaScript-heavy content that doesn't render well.
- **Rate Limits**: Free tiers on OpenRouter and Zhipu AI have request limits.
- **Wikipedia Coverage**: Not all companies have Wikipedia articles — use the website URL input for those.

---

## 📜 License

This project is for educational and demonstration purposes. All data is sourced from free, public APIs (Wikipedia, Wikidata, Jina AI Reader).

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and free AI APIs**
