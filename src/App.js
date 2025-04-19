import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const App = () => {
  // States for managing the UI
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Sample data - you'll replace these with your actual content
  const sections = [
    {
      id: 'team',
      title: 'Our Team',
      content: 'Our team consists of licensed psychologists with over 10 years of experience in various fields including cognitive behavioral therapy, mindfulness-based therapy, and psychodynamic approaches.'
    },
    {
      id: 'expertise',
      title: 'Our Expertise',
      content: 'We specialize in anxiety disorders, depression, trauma, relationships, and work-related stress. Our evidence-based approaches are tailored to meet your individual needs.'
    },
    {
      id: 'ambience',
      title: 'Our Ambience',
      content: 'Our clinic provides a calm, confidential space designed to help you feel comfortable and safe. Each session room is thoughtfully designed with soft lighting and comfortable seating.'
    }
  ];
  
  const questions = [
    {
      id: 'q1',
      text: 'What is your approach to therapy?',
      answer: "We take an integrative approach to therapy, drawing from various evidence-based methods including CBT, mindfulness techniques, and psychodynamic therapy. We believe in tailoring our approach to each client's specific needs and goals."    },
    {
      id: 'q2',
      text: 'How long does a typical session last?',
      answer: "Our standard sessions are 50 minutes long, which is the clinical hour. For initial consultations, we allocate 60 minutes to ensure we have enough time to understand your needs properly."    },
    {
      id: 'q3',
      text: 'Do you accept insurance?',
      answer: "Yes, we accept most major insurance plans. We recommend contacting your insurance provider to verify your mental health benefits before your first appointment. We're also happy to provide any necessary documentation."
    },
    {
      id: 'q4',
      text: 'How do I know if therapy is right for me?',
      answer: 'Therapy can be beneficial for anyone looking to improve their mental wellbeing, work through challenges, or develop better coping strategies. We offer a free 15-minute consultation call to discuss your specific situation and determine if our services would be a good fit.'
    }
  ];
  
  const messagesEndRef = useRef(null);
  
  // Handle section button click
  const handleSectionClick = (section) => {
    if (selectedSection && selectedSection.id === section.id) {
      setSelectedSection(null);
    } else {
      setSelectedSection(section);
    }
  };
  
  // Handle question selection
  const handleQuestionClick = (question) => {
    if (isTyping) return; // Prevent selecting a new question while typing
    
    setSelectedQuestion(question);
    setIsTyping(true);
    setTypedText('');
    
    // Simulate typing animation
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < question.text.length) {
        setTypedText(prevText => prevText + question.text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
        
        // Add to conversation after typing is complete
        setTimeout(() => {
          setConversation([
            ...conversation, 
            { type: 'question', text: question.text },
            { type: 'answer', text: question.answer }
          ]);
          setTypedText('');
          setSelectedQuestion(null);
        }, 500);
      }
    }, 50);
  };
  
  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 flex items-center">
        <div className="text-xl font-semibold flex items-center">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          MindfulCare Psychology
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 flex flex-col">
        {/* Section buttons */}
        {conversation.length === 0 && (
          <div className="flex justify-center space-x-4 my-8">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                {section.title}
              </button>
            ))}
          </div>
        )}
        
        {/* Selected section modal */}
        {selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
              <button 
                onClick={() => setSelectedSection(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-medium mb-2">{selectedSection.title}</h3>
              <p className="text-gray-600">{selectedSection.content}</p>
            </div>
          </div>
        )}
        
        {/* Conversation area */}
        <div className="flex-1">
          {conversation.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.type === 'question' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.type === 'question' 
                    ? 'bg-gray-200 text-gray-800 rounded-br-none' 
                    : 'bg-gray-800 text-white rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
              {message.type === 'answer' && (
                <div className="mt-2 mb-6">
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-sm hover:bg-gray-700 transition-colors">
                    Book Now
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Question prompts */}
      <div className="bg-white border-t border-gray-200 pt-4">
        <div className="px-4 mb-4">
          <div className="overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <div className="inline-flex space-x-2 px-4">
              {questions.map(question => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionClick(question)}
                  className={`px-4 py-2 border border-gray-200 rounded-full whitespace-nowrap text-sm hover:bg-gray-100 transition-colors ${
                    selectedQuestion?.id === question.id ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  {question.text}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Input area */}
        <div className="px-4 pb-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm">
            <input
              type="text"
              value={typedText}
              onChange={(e) => setInputText(e.target.value)}
              readOnly
              placeholder="Select a question from above..."
              className="flex-1 px-4 py-2 focus:outline-none"
            />
            <button className="px-4 py-2 bg-gray-800 text-white rounded-full m-1" disabled={isTyping}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;