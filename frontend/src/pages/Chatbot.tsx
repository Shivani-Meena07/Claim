import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Send, AlertTriangle } from 'lucide-react'
import { Card } from '../components/ui/Card'

type Msg = {
  role: 'user' | 'ai'
  text: string
}

const SUGGESTED = [
  'Why do I feel more tired before my period?',
  'Is a 24-day cycle normal?',
  'What foods help with bloating?',
  'How do I talk to my doctor about irregular periods?',
]

export default function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [userName, setUserName] = useState('')

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // ===============================
  // LOAD USER + CHAT HISTORY
  // ===============================

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('Authentication token not found')
        }

        const response = await fetch('/api/chatbot/history', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load chatbot history'
          )
        }

        // Set logged-in user's name
        setUserName(data.user?.name || '')

        // Load previous conversation
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(
            data.messages.map((message: any) => ({
              role: message.role,
              text: message.text,
            }))
          )
        } else {
          // New user / no previous conversation
          setMessages([
            {
              role: 'ai',
              text: `Hi ${data.user?.name || 'there'}, I'm your AI wellness companion. Ask me anything about your cycle, symptoms or how you're feeling today.`,
            },
          ])
        }
      } catch (error) {
        console.error('Chat history error:', error)

        // Fallback greeting
        setMessages([
          {
            role: 'ai',
            text: "Hi, I'm your AI wellness companion. Ask me anything about your cycle, symptoms or how you're feeling today.",
          },
        ])
      } finally {
        setLoadingHistory(false)
      }
    }

    loadChatHistory()
  }, [])

  // ===============================
  // AUTO SCROLL
  // ===============================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, typing])

  // ===============================
  // SEND MESSAGE
  // ===============================

  async function send(text: string) {
    if (!text.trim() || typing) return

    const userMessage = text.trim()

    // Show user's message immediately
    setMessages((m) => [
      ...m,
      {
        role: 'user',
        text: userMessage,
      },
    ])

    setInput('')
    setTyping(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            'Failed to get AI response'
        )
      }

      // Update user name if returned by backend
      if (data.user?.name) {
        setUserName(data.user.name)
      }

      // Add AI response
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: data.response,
        },
      ])
    } catch (error) {
      console.error('Chatbot error:', error)

      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: 'Sorry, I could not process your question right now. Please try again.',
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl">
            AI Chatbot
          </h1>

          {userName && (
            <p className="text-sm text-muted-foreground mt-1">
              Hi {userName}, how can I help you today?
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 bg-sun-soft text-sun/90 text-xs rounded-xl p-3 mb-4">
        <AlertTriangle size={15} className="shrink-0 mt-0.5" />

        <p>
          This chatbot offers general wellness information and
          isn't a substitute for medical advice. For symptoms
          that concern you, please consult a doctor via Doctor
          Connect.
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-sm text-muted-foreground">
                Loading your conversation...
              </p>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-bloom text-white rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm leading-6'
                    }`}
                  >
                    {m.role === 'ai' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0">
                              {children}
                            </p>
                          ),

                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 mb-3 space-y-1">
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 mb-3 space-y-1">
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => (
                            <li>{children}</li>
                          ),

                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),

                          h1: ({ children }) => (
                            <h1 className="text-base font-semibold mb-2">
                              {children}
                            </h1>
                          ),

                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold mb-2">
                              {children}
                            </h2>
                          ),

                          h3: ({ children }) => (
                            <h3 className="text-sm font-semibold mb-2">
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    ) : (
                      m.text
                    )}
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
                        style={{
                          animation: `typing-dot 1.2s ease-in-out ${
                            i * 0.15
                          }s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {!loadingHistory && messages.length < 2 && (
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
            disabled={loadingHistory}
          />

          <button
            type="submit"
            disabled={
              typing ||
              loadingHistory ||
              !input.trim()
            }
            className="h-11 w-11 rounded-xl bg-bloom text-white flex items-center justify-center focus-ring shrink-0 disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </form>
      </Card>
    </div>
  )
}