import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, AlertTriangle } from 'lucide-react'
import { Card } from '../components/ui/Card'

type Msg = { role: 'user' | 'ai'; text: string }

const SUGGESTED = [
  'Why do I feel more tired before my period?',
  'Is a 24-day cycle normal?',
  'What foods help with bloating?',
  'How do I talk to my doctor about irregular periods?',
]

const CANNED_REPLY =
  "That's a great question. Based on typical patterns, this is often linked to hormonal shifts across your cycle — but individual causes vary. I'd recommend logging your symptoms for a few more cycles so we can look for a pattern, and bringing this up with a doctor if it persists or feels severe."

export default function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: "Hi Meera, I'm your AI wellness companion. Ask me anything about your cycle, symptoms or how you're feeling today." },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ai', text: CANNED_REPLY }])
    }, 1400)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-display text-2xl md:text-3xl flex items-center gap-2">
          <Sparkles size={22} className="text-bloom" /> AI Chatbot
        </h1>
      </div>

      <div className="flex items-start gap-2.5 bg-sun-soft text-sun/90 text-xs rounded-xl p-3 mb-4">
        <AlertTriangle size={15} className="shrink-0 mt-0.5" />
        <p>This chatbot offers general wellness information and isn't a substitute for medical advice. For symptoms that concern you, please consult a doctor via Doctor Connect.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-bloom text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length < 2 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form
          className="border-t border-border p-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your cycle, symptoms, or wellness..."
            className="flex-1 h-11 px-4 rounded-xl bg-input-background border border-border text-sm focus-ring focus-visible:border-bloom"
          />
          <button
            type="submit"
            className="h-11 w-11 rounded-xl bg-bloom text-white flex items-center justify-center focus-ring shrink-0"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </form>
      </Card>
    </div>
  )
}
