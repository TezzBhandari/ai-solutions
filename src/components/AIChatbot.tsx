import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your AI assistant. How can I help you with our services, job opportunities, or portfolio information?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: inputMessage }];
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Thank you for your interest! Our AI solutions include job portal automation, software development, and business intelligence systems.",
        "We specialize in DocuMind, Log AI, FinSight, LaundriQ, and SafeOps solutions. Which one interests you most?",
        "Our job submission process is fully automated. Simply fill out our contact form and we'll handle the job hunting for you!",
        "We're located in Tinkune, Kathmandu, Nepal. Feel free to contact us at ydraju1429@gmail.com or +977-9829798238."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'bot', content: randomResponse }]);
    }, 1000);

    setMessages(newMessages);
    setInputMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-hero rounded-full p-4 shadow-glow ai-logo"
        aria-label="Open AI Chat Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 glass-card flex flex-col">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-glass-border/20">
            <Bot className="text-accent mr-2 ai-logo" size={20} />
            <span className="font-semibold">AI Assistant</span>
            <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass border border-glass-border/20'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-glass-border/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about our services..."
                className="flex-1 bg-input border border-glass-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={handleSendMessage}
                className="btn-glass p-2"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;