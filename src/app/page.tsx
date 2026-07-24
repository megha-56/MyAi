// 'use client';
// import { useState } from 'react';

// export default function Chat() {
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { role: 'user', content: input }];
//     setMessages(newMessages);
//     setInput('');
//     setLoading(true);

//     const res = await fetch('/api/chat', {
//       method: 'POST',
//       body: JSON.stringify({ messages: newMessages, sessionId: 'demo-session' }),
//     });

//     const reader = res.body!.getReader();
//     let assistantReply = '';
//     setMessages([...newMessages, { role: 'assistant', content: '' }]);

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       assistantReply += new TextDecoder().decode(value);
//       setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">MyAi Chatbot</h1>
//       <div className="space-y-3 mb-4 min-h-[300px]">
//         {messages.map((m, i) => (
//           <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
//             <span className={`inline-block rounded px-3 py-2 ${
//               m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'
//             }`}>
//               {m.content}
//             </span>
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           className="flex-1 border rounded px-3 py-2 text-black"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {loading ? '...' : 'Send'}
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: newMessages, sessionId: 'demo-session' }),
    });

    const reader = res.body!.getReader();
    let assistantReply = '';
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantReply += new TextDecoder().decode(value);
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">MyAi Chatbot</h1>
      <div className="space-y-3 mb-4 min-h-[300px]">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={`inline-block px-5 py-3 max-w-[80%] ${
                m.role === 'user'
                  ? 'bg-violet-200 text-black rounded-full'
                  : 'bg-gray-100 text-black rounded-3xl'
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-violet-300 hover:bg-violet-400 text-black px-5 py-2 rounded-full disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}