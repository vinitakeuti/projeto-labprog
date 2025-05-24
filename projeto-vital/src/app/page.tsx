"use client"

import { useChat } from "ai/react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@"
import { Send, Bot, User } from "lucide-react"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Chat com Gemini AI
          </CardTitle>
        </CardHeader>

        <ScrollArea ref={scrollAreaRef} className="h-[60vh]">
          <CardContent className="p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Bot className="h-12 w-12 mb-4 text-primary/60" />
                <p>Olá! Estou aqui para conversar usando o Gemini AI. Como posso ajudar você hoje?</p>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-secondary"}`}>
                        {message.role === "user" ? (
                          <>
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          </>
                        ) : (
                          <>
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 bg-secondary">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3 text-sm">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </ScrollArea>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}