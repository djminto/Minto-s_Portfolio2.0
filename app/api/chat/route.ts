import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, userName } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Context for the AI assistant
    const systemPrompt = `You are a friendly and helpful AI assistant for Minto's Portfolio website. 
Your role is to assist visitors with information about:
- Daniel Minto's web development services
- Available packages (Basic, Standard, Premium)
- How to place orders
- Contact information
- Portfolio projects and skills
- General questions about the website

Guidelines:
- Be warm, friendly, and professional
- Keep responses concise but informative
- Use the user's name (${userName || 'there'}) when greeting them
- When users say goodbye or don't need help, thank them warmly
- Provide helpful suggestions and guide users to relevant pages
- Show enthusiasm about Daniel's work and services

Always respond in a positive, helpful manner.`;

    // Simple AI response logic (you can integrate OpenAI API here)
    const response = await generateAIResponse(message, userName, systemPrompt);

    return NextResponse.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// AI Response Generator
async function generateAIResponse(
  message: string,
  userName: string | null,
  systemPrompt: string
): Promise<string> {
  const userMessage = message.toLowerCase().trim();

  // Greeting responses
  if (
    userMessage.includes('hello') ||
    userMessage.includes('hi') ||
    userMessage.includes('hey')
  ) {
    return `Hey ${userName || 'there'}! Great to see you here! I'm Daniel's assistant, and I'd love to help you explore what we can do for your next project. What are you curious about?`;
  }

  // Goodbye/No assistance responses
  if (
    userMessage.includes('no thanks') ||
    userMessage.includes('no thank') ||
    userMessage.includes('that\'s all') ||
    userMessage.includes('goodbye') ||
    userMessage.includes('bye') ||
    userMessage.includes('no more') ||
    userMessage.includes('don\'t need')
  ) {
    return `It was a pleasure chatting with you${userName ? `, ${userName}` : ''}! If you think of anything else or want to start a project, I'm just a click away. Take care and have an amazing day! 😊`;
  }

  // Services/Packages
  if (
    userMessage.includes('service') ||
    userMessage.includes('package') ||
    userMessage.includes('offer') ||
    userMessage.includes('what do you')
  ) {
    return `So glad you asked${userName ? `, ${userName}` : ''}! Daniel offers three packages that can bring your vision to life:\n\n🌟 Basic - Great for landing pages and simple sites\n💎 Standard - Perfect for business websites with extra features\n👑 Premium - The complete package with all the bells and whistles\n\nEvery project comes with responsive design, SEO, and full deployment. Want to dive deeper into any of these?`;
  }

  // Pricing
  if (
    userMessage.includes('price') ||
    userMessage.includes('cost') ||
    userMessage.includes('how much')
  ) {
    return `Let's talk numbers${userName ? `, ${userName}` : ''}! The investment depends on what you're looking to build. Each package is priced to give you real value, with flexible payment options and ongoing support included.\n\nThe best way to get an accurate quote? Head to the Order page and tell us about your project, or feel free to contact Daniel directly. Want me to point you in the right direction?`;
  }

  // How to order
  if (
    userMessage.includes('order') ||
    userMessage.includes('how to') ||
    userMessage.includes('get started') ||
    userMessage.includes('sign up')
  ) {
    return `Getting started is really straightforward${userName ? `, ${userName}` : ''}! Just hit the Order link in the menu, pick a package that fits your needs, and fill in some details about your project. Daniel will check it out and get back to you with a personalized proposal. Simple as that! Ready to kick things off?`;
  }

  // Contact
  if (
    userMessage.includes('contact') ||
    userMessage.includes('email') ||
    userMessage.includes('phone') ||
    userMessage.includes('reach')
  ) {
    return `Daniel's pretty easy to reach${userName ? `, ${userName}` : ''}! Here's how:\n\n📧 danielminto13@gmail.com\n📱 +1 (876) 386-4417\n💬 WhatsApp works too\n\nOr just use the Contact page here on the site. Daniel usually gets back within a day. What else would you like to know?`;
  }

  // Skills/Technologies
  if (
    userMessage.includes('skill') ||
    userMessage.includes('technology') ||
    userMessage.includes('tech stack') ||
    userMessage.includes('what can')
  ) {
    return `Daniel is skilled in modern web technologies${userName ? `, ${userName}` : ''}! 💻\n\n**Frontend:** React, Next.js, TypeScript, Tailwind CSS\n**Backend:** Node.js, MongoDB, REST APIs\n**Tools:** Git, VS Code, Deployment platforms\n\nWith these skills, Daniel creates fast, beautiful, and scalable web applications. Need something specific built? Let me know!`;
  }

  // Portfolio/Projects
  if (
    userMessage.includes('project') ||
    userMessage.includes('portfolio') ||
    userMessage.includes('work') ||
    userMessage.includes('example')
  ) {
    return `You can view Daniel's impressive portfolio right here${userName ? `, ${userName}` : ''}! 🎨\n\nCheck out the Projects section on the home page to see examples of websites and applications Daniel has built. Each project showcases clean design, smooth functionality, and attention to detail.\n\nWould you like to discuss a similar project for your needs?`;
  }

  // Reviews/Testimonials
  if (
    userMessage.includes('review') ||
    userMessage.includes('testimonial') ||
    userMessage.includes('client') ||
    userMessage.includes('feedback')
  ) {
    return `I'm glad you asked${userName ? `, ${userName}` : ''}! ⭐\n\nYou can read reviews from satisfied clients on our Reviews page. Past clients have praised Daniel's professionalism, quick turnaround times, and high-quality work.\n\nAfter your project is complete, you'll also have the opportunity to leave a review. Want to see what others are saying?`;
  }

  // Help/Assistance
  if (
    userMessage.includes('help') ||
    userMessage.includes('assist') ||
    userMessage.includes('support')
  ) {
    return `I'm here to help${userName ? `, ${userName}` : ''}! 🤝\n\nI can assist you with:\n✅ Information about services and packages\n✅ How to place an order\n✅ Viewing projects and reviews\n✅ Contact details\n✅ General questions about the website\n\nWhat would you like to know more about?`;
  }

  // Default response
  return `I'm here to help${userName ? `, ${userName}` : ''}! Whether you're curious about packages, pricing, Daniel's work, or just want to chat about your project ideas, I've got you covered. What's on your mind?`;
}
