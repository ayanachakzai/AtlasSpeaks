import json
from random import random
import re
from chatbot_base import ChatbotBase
import warnings #learned from LLM to suppress warnings for Gemini API
warnings.filterwarnings(
    "ignore",
    category=FutureWarning,
    module="google.api_core._python_version_support"
)


class AtlasSpeaks(ChatbotBase):
    # Week 2-3 parent class and variables
    def __init__(self, name="Chatbot"):
        ChatbotBase.__init__(self, name)
    # Week 3 data structure loading
        self.data = self.load_data('data/atlas_myths_facts_comparisons.json')
        self.music_data = self.load_data('data/pakistani_music_database.json')

    # week 3 booleans
        self.conversation_is_active = True

        self.in_music_mode = False
        self.music_step=0
        self.music_preferences = {}


    def load_data(self, filepath):
        # Week 3 Functions
        with open(filepath, 'r', encoding='utf-8') as file:
            data = json.load(file)
        print(f"Loaded {len(data)} entries from {filepath.split('/')[-1]}.")
        return data
    
    def greeting(self):
        # Week 2 Greeting
        print(f"\n{'='*60}")
        print(f"Salam & Welcome to {self.name} Speaks")
        print(f"{'='*60}\n")
        print("\nI was created by a student from Balochistan, Pakistan and my purpose is to share.")
        print("\nAlong the way, I can also tell you a little about a few other places –")
        print("the United Kingdom, United States, India, China, and Turkey.")
        print("\nI can also suggest you some good Pakistani music based on your mood and taste!\n")
        print("\nThink of me as a friendly companion who loves exploring traditions,")
        print("debunking myths, and finding connections across cultures.\n")
        print("Would you like to see a MENU of what I can do, or some EXAMPLE prompts")         # Learned from LLM to generate a Menu
        print("to get started?")
        print("\nType: 'menu' or 'examples'")
        print("\nType 'music' to get Pakistani music recommendations.")
        print("Type 'exit' anytime to leave.\n")
        print(f"{'='*60}\n")

    def show_menu(self):
        
        print("\n" + "="*60)
        print("📋 MENU - What I Can Help You With")
        print("\n" + "="*60)
        print("\n🗺️  CULTURAL EXPLORATION")
        print("  • Ask me about Pakistani culture, traditions, or regions")
        print("  • Debunk common myths and stereotypes")
        print("  • Learn about food, festivals, history, and more")
        print("\n🎵 MUSIC RECOMMENDATIONS")
        print("  • Get personalized Pakistani music suggestions")
        print("  • Discover artists from different eras and genres")
        print("  • Type 'music' to start the questionnaire")
        print("\n🌍 COMPARATIVE INSIGHTS")
        print("  • Learn about other countries I know (UK, US, India, China, Turkey)")
        print("  • Compare cultural practices and traditions")
        print("\n💬 EXAMPLE COMMANDS")
        print("  • Type 'examples' to see sample questions")
        print("  • Type 'music' to get music recommendations")
        print("  • Type 'exit' to end our conversation")
        print("\n" + "="*60 + "\n")

    def show_examples(self):

        print("\n" + "="*60)
        print("💡 EXAMPLE QUESTIONS - Try asking me:")
        print("="*60)
        print("\n📍 ABOUT PAKISTAN:")
        print("  • 'Is Pakistan safe to visit?'")
        print("  • 'Tell me about Pakistani food'")
        print("  • 'What is Balochi culture like?'")
        print("  • 'Are all Pakistanis Muslim?'")
        print("\n🎵 MUSIC:")
        print("  • 'music' - Start personalized recommendations")
        print("  • 'Recommend me some Pakistani songs'")
        print("\n🌍 COMPARISONS:")
        print("  • 'How is Pakistan different from India?'")
        print("  • 'Tell me about Turkish and Pakistani food'")
        print("\n💭 MYTHS:")
        print("  • 'Pakistan is all desert, right?'")
        print("  • 'Do women have rights in Pakistan?'")
        print("\n" + "="*60 + "\n")

    def process_input(self, user_input):
        #week 3-4 process user input
        processed = user_input.strip().lower()
        return processed
    
    def start_music_questionnaire(self):
        # Week 4 multi-turn conversation flow
        self.in_music_mode = True
        self.music_step = 1
        self.music_preferences = {}
        
        return (
                "\n🎵 Let me help you discover Pakistani music!\n"
            "I'll ask 3 quick questions.\n\n"
            "Question 1/3: What mood are you in?\n\n"
            "  A) 🎉 Energetic - dance/party vibes\n"
            "  B) 🧘 Calm - relax/meditate\n"
            "  C) 💕 Romantic - in my feelings\n"
            "  D) 🎭 Emotional - deep and powerful\n"
            "  E) 🌍 Curious - explore something new\n\n"
            "Type: A, B, C, D, or E"
        )
    
    def handle_music_questionnaire(self, user_input):
        
        # Q1 Mood
        if self.music_step == 1:
            mood_map = {
                'a': 'energetic',
                'b': 'calm',
                'c': 'romantic',
                'd': 'emotional',
                'e': 'curious'
            }
        
            if user_input in mood_map:
                self.music_preferences['mood'] = mood_map[user_input]
                self.music_step = 2
                return (
                f"\n✅ Mood: {mood_map[user_input].upper()}\n\n"
                        "Question 2/3: Which style sounds interesting?\n\n"
                        "  A) 🎸 Modern (pop, rock, indie)\n"
                        "  B) 🎻 Traditional (folk, classical)\n"
                        "  C) 🙏 Spiritual (Sufi, qawwali)\n"
                        "  D) 🎺 Fusion (traditional + modern)\n\n"
                        "Type: A, B, C, or D"
                )
            else:
                return "Please Choose A, B, C, D, or E"
        
        # Q2 Style
        elif self.music_step == 2:
            style_map = {
                'a': 'modern',
                'b': 'traditional',
                'c': 'spiritual',
                'd': 'fusion'
            }
        
            if user_input in style_map:
                self.music_preferences['style'] = style_map[user_input]
                self.music_step = 3
                return (
                f"\n✅ Style: {style_map[user_input].upper()}\n\n"
                    "Question 3/3: Vocal preference?\n\n"
                    "  A) 🎤 Powerful vocals\n"
                    "  B) 🎹 Soft/gentle vocals\n"
                    "  C) 🎵 Either is fine\n\n"
                    "Type: A, B, or C"
                )
            else:
                return "Please Choose A, B, C, or D"
        
        # Q3 Vocals
        elif self.music_step == 3:
            vocal_map = {
                'a': 'powerful',
                'b': 'soft',
                'c': 'any'
            }
        
            if user_input in vocal_map:
                self.music_preferences['vocals'] = vocal_map[user_input]
                self.music_step = 0
                self.in_music_mode = False
                return self.generate_music_recommendations()
            else:
                return "Please Choose A, B, or C"
            
    def generate_music_recommendations(self):
        #week 3-4 filtering
        mood = self.music_preferences.get('mood')
        style = self.music_preferences.get('style')
        vocals = self.music_preferences.get('vocals')


        matches = []
        songs = self.music_data  
        for song in songs:
            mood_match = song.get('mood', '').lower() == mood
            style_match = song.get('style', '').lower() == style


            if vocals == 'any':
                vocal_match = True
            else:
                vocal_match = song.get('vocal_intensity', '').lower() == vocals

            if mood_match and style_match and vocal_match:
                matches.append(song)

    # output formatting
        if len(matches) == 0:
            return ("\nSorry, I couldn't find any songs matching your preferences.\n"
                "Try the questionnaire again with different choices!\n")     

    # only show first 5 songs
        import random
        if len(matches) > 5:
            matches = random.sample(matches, 5)  # Random 5 instead of first 5

        #building the response
        response = f"\n 🎵 Found {len(matches)} songs for you!\n"
        response += "="*60 + "\n\n"


        count = 1
        for song in matches:
            response += f"\n🎵 {count}. {song.get('song')} - {song.get('artist')}\n"
            response += f"\nYear: {song.get('year')} | Language: {song.get('language')}\n"
            response += f"\n💡 Why you'll love it: {song.get('why_youll_love')}\n"
            response += f"\n🎶 Comparison to Western Music: {song.get('comparison')}\n"
            response += "-" * 60 + "\n"

            count = count + 1
        response += "="*60 + "\n"
        response += "Type 'music' to get more recommendations or type 'menu' to go back to the main menu!\n"

        return response

# MYTHS
    def check_for_myths(self, user_input):
    # week 4 regex to find myths
        for entry in self.data:
            triggers = entry.get('triggers', [])
            

            for trigger in triggers:
                pattern = re.compile(trigger, re.IGNORECASE)
                
                if pattern.search(user_input):
                    region = entry.get('region', 'Unknown')
                    fact = entry.get('fact', '')
                    reflect = entry.get('reflect', '')

                    response = f"\n🗺️  {region.upper()}\n"
                    response += "="*60 + "\n"
                    response += f"✅ FACT: {fact}\n\n"
                    response += f"💭 REFLECTION: {reflect}\n"
                    response += "="*60 + "\n"
                    response += "\nType: 'menu' or 'examples'"
                    response += "\nType 'music' to get Pakistani music recommendations."
                    return response
        
        # Only return None AFTER checking ALL entries
        return None


# FACTS
    def find_relevant_fact(self, user_input):
        
        try:
            import google.generativeai as genai
            import os
            
            # API key
            genai.configure(api_key="YOUR_API_KEY_HERE")
            
            # model
            model = genai.GenerativeModel('gemini-2.5-flash-lite')
            
            # prompt
            prompt = f"""You are Atlas, a cultural chatbot about Pakistan.

Answer this question in 2-3 friendly sentences. Give your result in Two Parts. The first being ✅ FACT, and the second being 💭 REFLECTION which reflects poetically on the fact.
{user_input}

Focus on Pakistani culture, regions (Balochistan, Punjab, Sindh, KPK), or other countries (UK, USA, India, China, Turkey)."""
            
            # generate response
            response = model.generate_content(prompt)
            
            # format output
            answer = response.text.strip()

            return f"\n🌍 {answer}\n" + "="*60 + "\n"
            
        except Exception as e:
            print(f"🐛 DEBUG ERROR: {e}")
            return ("\n⚠️ Connection issue. Try asking about:\n"
                    "  • Pakistani food, culture, music\n"
                    "  • Type 'menu' for options\n")

        # COMPARISONS
    def handle_comparison(self, user_input):
            # Week 4 - regex pattern matching for comparisons
            # took guidance from LLM to create patterns
            comparison_patterns = [
                r'compare\s+(.+?)\s+(?:with|and|to|versus|vs)\s+(.+)',
                r'difference\s+between\s+(.+?)\s+and\s+(.+)',
                r'(.+?)\s+versus\s+(.+)',
                r'(.+?)\s+vs\s+(.+)'
            ]
        
        # Country name mappings
            country_map = {
                'pakistan': 'Pakistan',
                'uk': 'United Kingdom',
                'britain': 'United Kingdom',
                'england': 'United Kingdom',
                'united kingdom': 'United Kingdom',
                'usa': 'United States',
                'america': 'United States',
                'united states': 'United States',
                'india': 'India',
                'china': 'China',
                'turkey': 'Turkey'
        }
        
            for pattern in comparison_patterns:
                match = re.search(pattern, user_input, re.IGNORECASE)
                if match:
                    country1 = match.group(1).strip().lower()
                    country2 = match.group(2).strip().lower()
                    
                    region1 = country_map.get(country1, country1.title())
                    region2 = country_map.get(country2, country2.title())
                    
                    facts1 = []
                    facts2 = []
                    
                    for entry in self.data:
                        entry_region = entry.get('region', '')
                        if region1.lower() == entry_region.lower():
                            facts1.append(entry)
                        if region2.lower() == entry_region.lower():
                            facts2.append(entry)
                    
                    if facts1 and facts2:

                        import random
                        fact1 = random.choice(facts1)
                        fact2 = random.choice(facts2)

                        response = f"\n🌍 {region1.upper()} and {region2.upper()} - Cultural Overview\n"
                        response += "="*60 + "\n\n"
                        response += f"📍 {region1.upper()}:\n"
                        response += f"{fact1.get('fact', '')}\n\n"
                        response += f"💭 {fact1.get('reflect', '')}\n\n"
                        response += f"📍 {region2.upper()}:\n"
                        response += f"{fact2.get('fact', '')}\n\n"
                        response += f"💭 {fact2.get('reflect', '')}\n\n"
                        response += "="*60 + "\n"
                        response += f"💡 I have {len(facts1)-1} more facts about {region1} and {len(facts2)-1} more about {region2}.\n"
                        response += "Ask me specific questions to learn more!\n"
                        response += "\nType: 'menu' or 'examples'"
                        response += "\nType 'music' to get Pakistani music recommendations."
                        return response
                    elif facts1:
                        fact1 = facts1[0]
                        response = f"\n🌍 About {region1.upper()}\n"
                        response += "="*60 + "\n"
                        response += f"📖 {fact1.get('fact', '')}\n\n"
                        response += f"💭 {fact1.get('reflect', '')}\n"
                        response += "="*60 + "\n"
                        response += f"\n(I don't have information about {region2} to compare)\n"
                        response += "\nType: 'menu' or 'examples'"
                        response += "\nType 'music' to get Pakistani music recommendations."
                        return response
            
            return None   
     
    def get_random_reflection(self):
    # random selection from list in case answer is not found
        import random
        
        reflections = [
            "Every question is a bridge between cultures, even if I don't have all the answers yet.",
            "Some stories are still being written. Ask me about Pakistan, and I'll share what I know!",
            "Like a traveler in new lands, I'm still learning. Try asking about culture, food, or music!",
            "Not all paths are mapped, but I can guide you through Pakistani heritage and traditions.",
            "The best conversations start with curiosity. Let me share what I do know!",
            "Sometimes the melody escapes me, but I have many songs about Pakistan to share.",
            "Every culture has untold stories. Mine are about Pakistan—ask me about them!",
            "Like petals in the wind, some answers drift beyond my reach. But I have many tales of Pakistan!"
        ]
        
        return random.choice(reflections)

    def generate_response(self, processed_input):
        if processed_input in ['exit', 'quit', 'bye', 'goodbye']:
            self.conversation_is_active = False
            return "Thank you for exploring with Atlas Speaks! 🌍✨"

        if processed_input in ['menu', 'help', 'options']:
            self.show_menu()
            return ""

        if processed_input in ['examples', 'example prompts']:
            self.show_examples()
            return ""

        if processed_input in ['hi', 'hello', 'hey', 'how are you', 'whats up', 'howdy']:
            return ("\nHello! I'm doing great, thank you for asking! 😊\n"
                    "I'm here to share stories about Pakistan and other cultures.\n"
                    "Type 'menu' to see what I can help you with!\n")

        if processed_input in ['music', 'recommend music', 'music recommendations']:
            return self.start_music_questionnaire()

        if self.in_music_mode:
            return self.handle_music_questionnaire(processed_input)

        myth_response = self.check_for_myths(processed_input)
        if myth_response:
            return myth_response
        
        comparison_response = self.handle_comparison(processed_input)
        if comparison_response:
            return comparison_response

        fact_response = self.find_relevant_fact(processed_input)
        if fact_response:
            return fact_response

        return (f"\n{self.get_random_reflection()}\n\n"
        "🤔 I work best with questions about:\n"
        "  • Pakistani culture, traditions, and regions\n"
        "  • Common myths to debunk\n"
        "  • Food, music, history, and festivals\n"
        "  • Comparisons with UK, USA, India, China, Turkey\n\n"
        "💡 Try:\n"
        "  • 'Tell me about Pakistani food'\n"
        "  • 'Is Pakistan safe to visit?'\n"
        "  • Type 'examples' for more ideas\n"
        "  • Type 'menu' to see all options\n")