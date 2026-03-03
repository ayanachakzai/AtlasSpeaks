# Atlas Speaks - Cultural Chatbot for Pakistan

A conversational interface for exploring Pakistani culture, debunking myths, and discovering Pakistani music.

**Created by:** Muhammad Ayan Achakzai (25001602)  
**Course:** MSc Applied Machine Learning for Creatives - Conversational Interfaces  
**Institution:** University of the Arts London   
**Git Repository:** https://git.arts.ac.uk/m-achakzai0320251/MAA_CI

---

## 📖 About

Atlas Speaks is a cultural education chatbot designed to share facts about Pakistan, debunk common stereotypes, and recommend Pakistani music based on user preferences. The chatbot uses multiple NLP techniques including:

- **Regex pattern matching** for myth detection and country comparisons
- **Keyword classification** for music recommendations through a multi-turn questionnaire
- **Gemini API integration** for general cultural questions

The chatbot covers cultural information from:
- **Pakistani regions:** Balochistan, Punjab, Sindh, KPK, Gilgit-Baltistan, Azad Kashmir, Islamabad
- **Comparative insights:** UK, USA, India, China, Turkey
- **Music database:** 82 Pakistani songs from 1980s-2025

---

## 🚀 Getting Started

### Prerequisites

- Active internet connection (for Gemini API)
- Gemini API key (free from Google AI Studio)

### Installation

1. **Install dependencies:**
   ```bash
   pip install google-generativeai
   ```

2. **Get a Gemini API key:**
   - Add it to line 272 in `atlas_speaks.py`:
     ```python
     genai.configure(api_key="YOUR_API_KEY_HERE")
     ```

3. **Ensure data files are in place:**
   ```
   data/
   ├── atlas_myths_facts_comparisons.json  (205 cultural facts)
   └── pakistani_music_database.json       (82 songs)
   ```

---

## 🎮 Running the Chatbot

### Basic Usage

```bash
python run_chatbot.py
```


## ✨ Features

### 1. **Menu & Navigation**
- Type `menu` to see all available options
- Type `examples` to see sample questions

### 2. **Myth Busting**
- Ask questions like: "Is Pakistan all desert?"
- Regex patterns detect and debunk common stereotypes
- Responses include facts and poetic reflections

### 3. **Music Recommendations**
- Type `music` to start the questionnaire
- Answer 3 questions about mood, style, and vocal preference
- Get personalized song recommendations with cultural context

### 4. **Cultural Comparisons**
- Compare Pakistan with other countries
- Examples:
  - "Compare Pakistan with India"
  - "Difference between UK and Pakistan"

### 5. **General Questions**
- Ask about Pakistani culture, food, festivals, regions
- Powered by Gemini 2.5 Flash Lite API

---

## 📁 Project Structure

```
MAA_CI/
├── atlas_speaks.py              # Main chatbot class
├── chatbot_base.py             # Base class (provided by course)
├── run_chatbot.py              # Entry point to run chatbot
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── MAA_CI_AtlasSpeaks.pdf     # Project essay/report
├── data/
│   ├── atlas_myths_facts_comparisons.json
│   └── pakistani_music_database.json
└── .git/                       # Git version control
```

---

## 🎯 Example Commands

### Getting Started
- `menu` - Show all features
- `examples` - See sample questions
- `hi` / `hello` - Casual greeting

### Exploring Culture
- "Tell me about Balochi culture"
- "What is Pakistani food like?"
- "Is Pakistan safe to visit?"

### Music Discovery
- `music` - Start music questionnaire
- Get recommendations based on mood, style, and vocals

### Comparisons
- "Compare Pakistan with United Kingdom"
- "Difference between India and Pakistan"

### Exit
- `exit` / `quit` / `bye` - End conversation

---

## 🔗 Links

- **Git Repository:** https://git.arts.ac.uk/m-achakzai0320251/MAA_CI
- **Google AI Studio:** https://aistudio.google.com/app/apikey
- **Project Essay:** MAA_CI_AtlasSpeaks.pdf

---

**Last Updated:** December 10, 2025
