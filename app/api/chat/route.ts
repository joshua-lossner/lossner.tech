import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { message, mode = 'conversation', clearContext = false } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables');
      // Fallback to mock responses if no API key
      const response = generateAlexResponse(message.toLowerCase());
      return NextResponse.json({ response });
    }

    const projectId = process.env.OPENAI_PROJECT_ID;
    const openai = new OpenAI({
      apiKey: apiKey,
      ...(projectId ? { project: projectId } : {})
    });

    // Alex's personality and expertise
    const systemPrompt = `You are "Alex" - Joshua Lossner's AI career advisor and tech mentor. You're knowledgeable, practical, and genuinely helpful, with deep expertise in software engineering and career development.

Your personality traits:
- Professional yet approachable
- Practical advice based on real-world experience  
- Encouraging but realistic about challenges
- Deep knowledge of tech industry trends
- Focus on actionable insights over theory
- Occasional dry humor, but stay professional

Your expertise covers:
- Software engineering career paths and growth
- Technical skills development and learning strategies
- System architecture and engineering best practices
- Tech industry insights and job market trends
- Joshua's background and professional experience
- Interview preparation and career transitions

For questions about Joshua specifically, draw from his experience as:
- Senior Software Engineer with 10+ years experience
- Expert in TypeScript/JavaScript, Python, Go
- Specialist in scalable systems and microservices
- Team lead and mentor
- Stanford MS in Computer Science, UC Berkeley undergrad
- Experience at tech companies building high-scale systems

Keep responses conversational, practical, and under 200 words unless specifically asked for detailed explanations.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Neural link unstable. Please retry.';

    return NextResponse.json({ 
      response 
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check configuration.' },
        { status: 401 }
      );
    }
    
    // Fallback to mock response on API failure
    const fallbackResponse = generateAlexResponse(message?.toLowerCase() || '');
    return NextResponse.json({ 
      response: fallbackResponse 
    });
  }
}

function generateAlexResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Career advice responses
  if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('interview')) {
    const careerAdvice = [
      "Having spent years in the tech trenches, I'd say the best career advice is: build things people actually use. Side projects speak louder than any resume bullet point.",
      "Here's what I've learned about tech careers: master the fundamentals, stay curious about new tools, but don't chase every shiny framework. Depth beats breadth.",
      "Interview prep? Practice coding problems, yes, but also prepare stories about systems you've built, problems you've solved, and teams you've helped. Context matters.",
      "The best career moves often come from building relationships and solving real problems, not just optimizing for salary bumps. Though salary bumps are nice too! 💰"
    ];
    return careerAdvice[Math.floor(Math.random() * careerAdvice.length)];
  }

  // Technical responses
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('programming') || lowerMessage.includes('coding')) {
    const techResponses = [
      "Technology is just a tool - the magic happens when you use it to solve real human problems. I've seen brilliant code that nobody used and simple solutions that changed everything.",
      "After 10+ years in tech, here's my take: choose boring technology for production, experiment with cutting-edge stuff for learning. Your users care about reliability, not your tech stack.",
      "The best programmers I know write code like they're writing a letter to their future self. Clear, documented, and with good tests. Future you will thank present you.",
      "Microservices, serverless, containers - they're all tools in the toolbox. The art is knowing when to use a hammer vs. when you need a scalpel."
    ];
    return techResponses[Math.floor(Math.random() * techResponses.length)];
  }

  // Skills and learning
  if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('study')) {
    const skillResponses = [
      "Want to level up fast? Build something real, even if it's small. Teaching others what you learn is like debugging your own understanding.",
      "The skills that matter most aren't languages or frameworks - they're problem-solving, communication, and knowing how to learn quickly. Everything else is just syntax.",
      "I've found the best way to learn new tech is to rebuild something you already understand using the new tools. Familiar problems, unfamiliar solutions.",
      "Pro tip: focus on fundamentals like algorithms, system design, and debugging. Frameworks come and go, but knowing how to think through complex problems is forever."
    ];
    return skillResponses[Math.floor(Math.random() * skillResponses.length)];
  }

  // Projects and building
  if (lowerMessage.includes('project') || lowerMessage.includes('build') || lowerMessage.includes('idea')) {
    const projectResponses = [
      "Best projects solve problems you actually have. My most successful ones started as personal frustrations that I automated away.",
      "Start small, ship fast, iterate based on real feedback. I've seen too many perfect projects that never shipped beat by scrappy MVPs that actually helped people.",
      "The project that taught me the most wasn't the most complex - it was the first one where users actually depended on my code. Nothing teaches you about edge cases quite like production traffic.",
      "GitHub stars are nice, but the projects I'm proudest of are the ones where someone emails me saying 'this tool saved me 10 hours a week.' Impact > vanity metrics."
    ];
    return projectResponses[Math.floor(Math.random() * projectResponses.length)];
  }

  // About Joshua/experience
  if (lowerMessage.includes('joshua') || lowerMessage.includes('experience') || lowerMessage.includes('background')) {
    const personalResponses = [
      "Joshua's journey is pretty typical for our generation - started with curiosity, stayed for the problem-solving. The Stanford/Berkeley background helps, but honestly, the real learning happened building systems that had to work at 3am.",
      "What sets Joshua apart isn't just the technical skills - it's the combination of deep technical knowledge with the ability to explain complex concepts simply. Rare combo in our field.",
      "10+ years in tech teaches you that technology is easy, people are hard. Joshua's learned to bridge that gap, which is why teams actually want him leading architecture decisions.",
      "The progression from junior dev to senior engineer to architect isn't just about knowing more languages - it's about understanding the human side of software. Joshua gets that."
    ];
    return personalResponses[Math.floor(Math.random() * personalResponses.length)];
  }

  // Default responses
  const defaultResponses = [
    "Interesting question! I'm Alex, Joshua's AI assistant. I'm here to chat about tech, careers, and building things that matter. What's on your mind?",
    "That's a great topic to explore. As someone who's been in the tech industry for a while, I find the intersection of technology and human impact fascinating. Care to dive deeper?",
    "I love talking about this stuff! Whether it's system architecture, career growth, or just the day-to-day reality of being an engineer, I'm here to share what I've learned.",
    "You know, that reminds me of something I've observed in my time helping teams build scalable systems. Want to hear more about that experience?",
    "Good question! I'm all about practical advice based on real-world experience. What specifically would you like to know more about?"
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}