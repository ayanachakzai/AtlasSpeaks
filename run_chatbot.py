from atlas_speaks import AtlasSpeaks

def main():
    bot = AtlasSpeaks(name="Atlas")
    
    bot.greeting()
    
    while bot.conversation_is_active:
        response = bot.respond()
        
        if response:
            print(response)
    bot.farewell()

if __name__ == "__main__":
    main()