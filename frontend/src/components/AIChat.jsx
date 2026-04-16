import { useState } from "react";

export default function AIChat() {
    const [messages, setMessages] = useState([
        { role: "ai", text: "Ask me about your inventory or pricing decisions." }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input) return;

        setMessages([...messages, { role: "user", text: input },
        { role: "ai", text: "Based on trends, I recommend adjusting stock or pricing." }
        ]);

        setInput("");
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-2">🤖 AI Advisor</h3>

            <div className="h-40 overflow-y-auto text-sm space-y-2">
                {messages.map((m, i) => (
                    <div key={i} className={m.role === "ai" ? "text-blue-600" : "text-black"}>
                        {m.text}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Ask AI..."
                />
                <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded">
                    Send
                </button>
            </div>
        </div>
    );
}