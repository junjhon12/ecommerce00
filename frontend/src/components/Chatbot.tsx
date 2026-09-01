import { useState } from 'react';
import type { FormEvent } from 'react';
import { fetchRecommendation } from '../api';

export default function Chatbot() {
    const [query, setQuery] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    /* 
      feat: handle chatbot query submission
      Local component state was chosen for the chat window over global context to 
      optimize memory management, as the chat history is isolated entirely to this 
      specific view, balancing performance with highly readable component logic[cite: 3].
    */
    const handleAskAI = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await fetchRecommendation(query);
            setResponse(data.reply);
        } catch {
            setResponse("Sorry, I am having trouble connecting to the AI.");
        }
    };

    return (
        <aside className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-40">
            <div className="bg-indigo-600 p-4">
                <h3 className="text-white font-bold tracking-tight">AI Shopping Assistant</h3>
            </div>
            <div className="p-4 bg-gray-50 flex flex-col gap-3 h-64 overflow-y-auto">
                {response ? (
                    <p className="bg-indigo-100 text-indigo-900 p-3 rounded-lg text-sm leading-relaxed">{response}</p>
                ) : (
                    <p className="text-gray-500 text-sm italic">Ask me for product recommendations!</p>
                )}
                {loading && <p className="text-gray-500 text-sm animate-pulse">Thinking...</p>}
            </div>
            <form onSubmit={handleAskAI} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="I'm looking for..." 
                    required 
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    Ask
                </button>
            </form>
        </aside>
    );
}