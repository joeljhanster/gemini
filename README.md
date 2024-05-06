# Phishy: Your AI Companion against Online Scams

**Empowering users to navigate the web with confidence.**

Phishy, our Chrome extension powered by Gemini AI, is your friendly guardian angel for safe web browsing. This innovative tool educates users through a conversational chatbot, helping you learn how to identify phishing scams and navigate the web with confidence. Phishy empowers you to ask any questions related to cybersecurity, fostering a deeper understanding of online threats and making you a more vigilant web explorer.

## Inspiration

**Sparked by Real Stories, Fueled by Innovation**

Our journey began with everyday conversations. We saw the growing concern about online safety, especially from loved ones new to the digital world. News stories highlighting the massive impact of online scams, affecting millions of lives and costing trillions of dollars, only fueled our resolve.

We envisioned a future where everyone, from seasoned web users to the next generation, could navigate the web confidently. This inspired us to create a solution that leverages the power of AI (like Gemini!) to make cybersecurity education accessible and engaging.

**Personal Connection: A Catalyst for Change**

One personal experience truly underscored the need for action. When a family member almost fell victim to a cleverly disguised clickbait scam, we knew we had to find a better way to educate people. This is where Phishy was born – an AI companion designed to empower the next billion users to become informed web navigators.

## What it does

**Ever feel like you're navigating a web of mystery?**

Phishy, your friendly Chrome extension, acts like a digital magnifying glass! It scans websites, unearthing hidden clues in the form of clickable links. But Phishy's no ordinary detective – it uses the power of Gemini AI to analyze these links and sniff out any suspicious characters.

If Phishy spots a shady link, it won't just raise a red flag – it'll explain why it looks fishy! This way, you'll learn to recognize phishing attempts yourself and become more confident navigating the web. Furthermore, Phishy's built-in chatbot is always happy to answer your cybersecurity questions, transforming you from a web wanderer into a confident explorer!

## How we built it

**Building Phishy: A Collaborative Effort**

Phishy is a powerful tool, but it wasn't built in a day! Here's a peek behind the curtain to see how we brought this AI companion to life:

1. **Designing a User-Friendly Experience: Figma**

Our journey began with Figma, a design tool that allowed us to craft a user-friendly and intuitive interface for Phishy. We prioritized a clean layout and clear interactions to ensure Phishy feels like a natural extension of your browsing experience.

2. **Seamless Integration: Chrome Extension**

Phishy seamlessly integrates as a Chrome extension, working silently by your side, analyzing links as you explore the web. Once it finishes its initial scan, a discreet notification pops up, informing you of the number of suspicious links caught. These flagged links are then subtly highlighted on the webpage itself. Hover over them for a helpful tooltip explaining why Phishy deems them suspicious. Still unsure? Our friendly chatbot is just a click away to answer any questions and provide further clarification.

3. **The Power of AI: Google AI wrapped in Flask**

The brains behind Phishy's detection and educational capabilities lie in Google AI's powerful technology. We took things a step further by utilizing Google AI Studio to train our model. This platform helped us create a model that can not only identify suspicious links but also explain them in a fun and informative way, tailored to the everyday web user. We harnessed this power by utilizing Flask, a Python framework, to create consumable REST APIs.

4. **Smart Storage: MongoDB**

Keeping Phishy running smoothly requires a powerful database. That's where MongoDB, a NoSQL hero, steps in. It stores your conversation history with the Phishy chatbot, so you can revisit past lessons and learnings. But MongoDB does even more! It helps us cleverly cache past sentiment analysis results. This means Phishy can consult its memory instead of constantly asking Google AI, making everything faster and saving resources.

## Challenges we ran into

Building Phishy wasn't without its hurdles! Here are some of the roadblocks we encountered and how we navigated them:

1. **Finding the Right Tool for the Job:**

Initially, we grappled with the question: When is Google AI the best solution, compared to other machine learning models? For tasks like classifying suspicious links, supervised learning models might be sufficient. We had to carefully choose the right tool for the job, ensuring optimal performance.

2. **Overcoming Google AI's Rate Limits:**

Google AI has limitations on the number of requests it can handle per minute. To optimize our queries and stay within this limit (60 requests per minute), we made some clever tweaks. We streamlined URLs by focusing on the domain name and removing unnecessary elements. Additionally, we implemented a caching system in our database. This meant Phishy could consult past results for frequently accessed URLs, reducing the need for repetitive calls to Google AI.

3. **Embracing New Frontiers:**

This project pushed our boundaries in exciting ways! It was our first foray into creating a Chrome extension, utilizing Google AI, and deploying on Google Cloud Run. We had a lot of "firsts" under our belt, but thanks to Google's well-documented resources, we were able to navigate these new territories successfully.

4. **Finding the Perfect Fit for GenAI:**

We also explored whether Google AI was the ideal solution for Phishy. We didn't want to force-fit the technology – our goal was to find a problem where GenAI could truly shine. While we explored other use cases, GenAI's capabilities (like image generation) weren't yet mature enough for our specific needs.

## Accomplishments that we're proud of

Phishy is more than just a tool – it's a testament to our dedication to learning and pushing boundaries. Here's what makes us particularly proud:

- **First Steps, Giant Leaps:** We embraced numerous "firsts" on this project – building a Chrome extension, utilizing Google AI, and deploying on Cloud Run. It wasn't about winning, but about gaining invaluable experience and exploring the potential of generative AI in everyday challenges.
- **From Prototype to Reality:** The culmination of countless late nights? Our very first Minimum Viable Product (MVP) of Phishy! Witnessing this brainchild come to life was a significant milestone.
- **Empowering the Next Billion:** Our ultimate goal? To empower the next generation of web users. We believe Phishy can equip them with the knowledge and tools to navigate the web with confidence and reduce the impact of phishing scams.
- **Small Team, Big Impact:** Building Phishy as a two-person team while juggling busy schedules? We did it! Seeing our vision come to life through sheer determination is a truly rewarding experience.

Phishy is just the beginning. We're excited to see how it evolves and empowers users to become more web-savvy.

## What we learned

Phishy's development wasn't just about building a tool – it was a valuable learning experience. Here are some key takeaways:

- **Demystifying Generative AI:** We finally dipped our toes into the world of Generative AI (GenAI), a previously intimidating concept. Thanks to Google AI Studio and pre-trained Gemini models, the process was surprisingly accessible. This experience shattered the myth that GenAI implementation is overly complex.
- **The Power of Education:** Through Phishy, we solidified the importance of user education. While numerous phishing detectors and APIs exist, phishing scams are constantly evolving. The key to staying safe lies in user awareness and vigilance. Phishy aims to empower users with the knowledge to become informed web explorers.
- **Staying Ahead of the Curve:** The fight against online threats is an ongoing battle. Phishy's development process highlighted the need for adaptability in cybersecurity solutions. We must constantly learn and evolve to stay ahead of emerging scam tactics.

These lessons will undoubtedly guide our future endeavors as we strive to create a safer and more secure online environment.

## What's next for Phishy

Phishy is just getting started! Here's a glimpse into what the future holds for your friendly web guardian:

- **Phishy's Playground:** Imagine a simulated web environment powered by Gemini AI! Users can test their Phishy skills by navigating through realistic (but fake!) phishing scams. Gemini AI will craft convincing content and links, putting your web-sleuthing abilities to the test in a safe and educational space. This interactive playground will not only enhance user learning but also provide valuable data to further refine Phishy's detection capabilities.
- **Expanding Our Phishing IQ:** Currently, Phishy focuses on identifying suspicious links. But the world of phishing is vast! We're actively exploring ways for Phishy to recognize a wider range of phishing tactics. This includes detecting suspicious language patterns, unrealistic urgency cues, and inconsistencies in website design – all the red flags that might trick an unsuspecting user. By equipping Phishy with a broader phishing vocabulary, we can provide even more comprehensive protection.
- **Beyond the Browser:** Phishy's reach might extend beyond Chrome extensions in the future. Imagine a world where Phishy can analyze emails, social media messages, or even text messages for potential phishing attempts. This multi-platform approach would create a more holistic shield against online threats, safeguarding users wherever they roam in the digital world.

We're constantly brainstorming new ways for Phishy to learn and adapt. Our ultimate goal? To empower users to navigate the web with confidence and transform them into true cybersecurity champions!

## Contributors

Phishy wouldn't be possible without the dedication of these amazing team members:

- **[Presca Lim](https://www.linkedin.com/in/presca-lim/)** (UI/UX Designer, Frontend Developer, Prompt Engineer)
  - Presca brought Phishy to life with a user-friendly interface and helped craft the prompts that power our AI companion.
- **[Joel Lim](https://www.linkedin.com/in/joel-lim17/)** (Fullstack Developer, Devops Engineer)
  - Joel's expertise ensured Phishy runs smoothly under the hood, from building the core functionalities to deploying it for the world to use.
