import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const App = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');

  const sections = [
    {
      id: 'team',
      title: 'Team',
      content:
        'Our team consists of licensed psychologists with over 10 years of experience in various fields including cognitive behavioral therapy, mindfulness-based therapy, and psychodynamic approaches.',
      image: '/images/team-photo.jpg',
    },
    {
      id: 'expertise',
      title: 'Expertise',
      content:
        'We specialize in anxiety disorders, depression, trauma, relationships, and work-related stress. Our evidence-based approaches are tailored to meet your individual needs.',
    },
    {
      id: 'ambience',
      title: 'Ambience',
      content:
        'Our clinic provides a calm, confidential space designed to help you feel comfortable and safe. Each session room is thoughtfully designed with soft lighting and comfortable seating.',
    },
  ];

  const questions = [
    { id: 'q1', text: 'Can I get an experienced counselor?', answer: 'Yes, your counselor has over 10 years of experience and is well-versed in handling today\'s real-world challenges.' },
    { id: 'q2', text: 'Will the counseling be confidential?', answer: 'Absolutely. Everything you share in counseling stays completely confidential. Your privacy and trust are our top priorities. Many celebrities and public figures have also chosen us for their counseling needs, trusting us with their personal journeys.' },
    { id: 'q3', text: 'I am a woman. Can I get a woman counselor?', answer: 'Yes, of course. Nurora is a women-owned counseling center, and our entire team is made up of experienced women counselors. We understand your needs and are here to support you with care and understanding.' },
    { id: 'q4', text: 'I am a man. Can I get a woman counselor?', answer: 'Yes, absolutely. As a man, gaining a woman’s perspective can bring powerful insights into your healing journey. And beyond that, your counselor is a trained professional. Nurora is a women-led center, with a full team of experienced women counselors here to guide you with care and expertise.' },
    { id: 'q5', text: 'What will be the duration of my session?', answer: '“You matter more than the clock ❤️” At Nurora, we don’t believe in cutting you off when you’re emotionally opening up. There’s no strict time limit — don’t worry about the clock. We’re here to listen, understand, and be with you fully.' },
    { id: 'q6', text: 'How will the ambience be?', answer: 'Nurora is designed to feel nothing like a regular clinic. Every detail of our space is crafted to help you feel calm, safe, and connected. To truly catch the aura, we invite you to take a look at what people say about us.' },
    { id: 'q7', text: 'Can I be in touch with the counsellor?', answer: 'Absolutely. At Nurora, we believe healing continues even outside the therapy room. You can stay in touch with your counsellor through scheduled follow-ups and gentle check-ins. You’re also welcome to send small doubts as voice notes during your counsellor’s available hours. We’re here for you, every step of the way.' },
    { id: 'q8', text: 'Can I know my counsellor?', answer: 'Of course. Once you share the category of your concern — for example, Relationship ➔ Pre-marital — we’ll match you with the most suitable psychologist. For instance, you might meet Ms. Priyanka, who specializes in pre-marital counselling. You’ll get to see her photo, read about her expertise, and even check out the reviews shared by her previous clients. We believe knowing your counsellor helps you feel even safer and connected.' },
    { id: 'q9', text: 'I have a fear of being judged. Will I be judged here?', answer: 'We hear you. In today’s world, many of us carry the fear of being judged. That’s why at Nurora, we’ve created a special space — a space where you are met with understanding, not judgment. Here, your thoughts, emotions, and experiences are safe, respected, and honored. You matter just as you are.' },
    { id: 'q10', text: 'Do I need a prior appointment or can I walk in?', answer: 'While walk-ins are welcome if there is a slot available, we highly recommend booking in advance to ensure your time is reserved without wait. This helps us give you the full attention you deserve.' },
    { id: 'q11', text: 'What can I expect more?', answer: 'Coffee!!! Come, let’s talk over a coffee ☕️. But if you\'re a chai person... don’t worry, your cup of chai is waiting too! 🍵' },
  ];

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);


  const handleSectionClick = (section) => {
    if (selectedSection && selectedSection.id === section.id) {
      setSelectedSection(null);
    } else {
      setSelectedSection(section);
    }
  };

  
  const handleQuestionClick = (question) => {
    if (isTyping) return;

    setSelectedQuestion(question);
    setIsTyping(true);
    setTypedText('');

    let index = -1;
    const intervalId = setInterval(() => {
      if (index < question.text.length) {
        setTypedText((prevText) => prevText + question.text.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);

        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            { type: 'question', text: question.text },
          ]);
          setTypedText('');
          setTimeout(() => {
            typeAnswer(question.answer);
          }, 300);
        }, 300);
      }
    }, 50);
  };

  const typeAnswer = (answerText) => {
    let answerIndex = 0;
    let currentAnswer = '';

    const answerIntervalId = setInterval(() => {
      if (answerIndex < answerText.length) {
        currentAnswer += answerText[answerIndex];

        setConversation((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.type === 'answerTyping') {
            const updated = [...prev];
            updated[updated.length - 1] = { type: 'answerTyping', text: currentAnswer };
            return updated;
          } else {
            return [...prev, { type: 'answerTyping', text: currentAnswer }];
          }
        });

        answerIndex++;
      } else {
        clearInterval(answerIntervalId);
        setConversation((prev) => {
          const updated = [...prev];
          if (updated[updated.length - 1].type === 'answerTyping') {
            updated[updated.length - 1] = { type: 'answer', text: answerText };
          }
          return updated;
        });
        setIsTyping(false);
        setTypedText('');
        setSelectedQuestion(null);
      }
    }, 30);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [typedText]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <header
        className="fixed top-0 left-0 right-0 p-4 border-b rounded-b-2xl border-gray-200 flex items-center justify-between z-20 bg-white shadow-sm"
        style={{ boxShadow: '0 4px 6px -4px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="text-xl font-semibold flex items-center space-x-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {conversation.length > 0 && (
          <div className="flex-grow flex justify-center z-10">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section)}
                  className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm"
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 mt-16 mb-32 overflow-auto p-4 flex flex-col">
        {conversation.length === 0 && (
          <div className="flex justify-center space-x-4 my-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className="mt-10 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                {section.title}
              </button>
            ))}
          </div>
        )}

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
              <p className="text-gray-600 mb-4">{selectedSection.content}</p>
              {selectedSection.image && (
                <img
                  src={selectedSection.image}
                  alt={`${selectedSection.title} image`}
                  className="rounded-lg w-full h-auto object-cover"
                />
              )}
            </div>
          </div>
        )}

        <div className="flex-1">
          {conversation.map((message, index) => (
            <div key={index} className={`mb-4 ${message.type.startsWith('question') ? 'text-right' : 'text-left'}`}>
              <div className="inline-block px-4 py-2 max-w-[95%] bg-gray-200 text-gray-800 rounded-lg whitespace-pre-wrap">
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-lg border-t border-gray-200 pt-4 z-20"
        style={{ boxShadow: '0 -4px 6px -4px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="px-4 mb-4">
          <div className="overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <div className="inline-flex space-x-2 px-4">
              {questions.map((question) => (
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

        <div className="px-4 pb-4">
          <div className="flex items-center w-full bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={(e) => {}}
              readOnly
              placeholder="Enter a question..."
              className="flex-1 px-4 py-2 focus:outline-none overflow-x-auto scrollbar-hide"
            />

            {conversation.length > 0 ? (
              <button className="px-6 py-2 bg-gray-800 text-white rounded-full m-1 text-sm hover:bg-gray-700 transition-all">
                Book Now
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-full m-1"
                disabled
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;