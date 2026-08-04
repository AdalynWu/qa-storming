"use client";

import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import {
  askKnowledgeBase,
  ChatbotError,
  MAX_QUESTION_LENGTH,
} from "@/lib/chatbot";
import type { ChatAnswer, ChatSource } from "@/types/chatbot";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  kind?: ChatAnswer["kind"];
  sources?: ChatSource[];
  error?: boolean;
};

const INITIAL_MESSAGE: Message = {
  id: 0,
  role: "assistant",
  content: "你好，可以詢問我 QA 文件、產品說明與測試流程。我只會依核准的公開卷冊回答，並附上資料來源。",
};

const SUGGESTIONS = [
  "直播間遇到 404 應注意什麼？",
  "Maestro selector 如何選？",
  "Moor 開播前要檢查什麼？",
  "今天適合上班嗎？",
];

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M4 11.5 20 4l-5.5 16-3.1-6.2zM11.4 13.8 20 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function KnowledgeChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextMessageId = useRef(1);
  const wasOpen = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previouslyOpen = wasOpen.current;
    wasOpen.current = open;
    if (!previouslyOpen || open) return;
    const frame = requestAnimationFrame(() => launcherRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "end" });
  }, [messages, loading, open]);

  const submitQuestion = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    const userMessage: Message = { id: nextMessageId.current++, role: "user", content: trimmed };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await askKnowledgeBase(trimmed);
      setMessages((current) => [...current, {
        id: nextMessageId.current++,
        role: "assistant",
        content: result.answer,
        kind: result.kind,
        sources: result.sources,
      }]);
    } catch (error) {
      const content = error instanceof ChatbotError
        ? error.message
        : "賢者問答櫃台暫時無法使用，請稍後再試。";
      setMessages((current) => [...current, {
        id: nextMessageId.current++,
        role: "assistant",
        content,
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(question);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submitQuestion(question);
    }
  };

  return (
    <aside className={`knowledge-chatbot ${open ? "is-open" : ""}`}>
      {!open && (
        <div className="knowledge-chatbot-invitation">
          <span className="knowledge-chatbot-speech" aria-hidden="true">有什麼疑問可以問我唷</span>
          <button
            ref={launcherRef}
            className="knowledge-chatbot-launcher"
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label="開啟賢者問答：有什麼疑問可以問我唷"
          >
            <span className="animal-sprite sprite-jelly knowledge-chatbot-jelly" aria-hidden="true" />
          </button>
        </div>
      )}

      {open && (
        <section
          className="knowledge-chatbot-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          <header className="knowledge-chatbot-header">
            <span className="knowledge-chatbot-seal" aria-hidden="true">Q</span>
            <div>
              <h2 id={titleId}>賢者問答櫃台</h2>
              <p id={descriptionId}>只查閱核准公開卷冊</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="關閉賢者問答櫃台">
              <CloseIcon />
            </button>
          </header>

          <div className="knowledge-chatbot-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <article className={`knowledge-chatbot-message is-${message.role}${message.kind === "fun" ? " is-fun" : ""}${message.error ? " is-error" : ""}`} key={message.id}>
                <span>{message.role === "assistant" ? (message.kind === "fun" ? "史萊姆閒聊" : "賢者") : "冒險者"}</span>
                <p>{message.content}</p>
                {!!message.sources?.length && (
                  <details>
                    <summary>查看資料來源（{message.sources.length}）</summary>
                    <ul>
                      {message.sources.map((source) => (
                        <li key={source.href}><Link href={source.href}>{source.title}</Link></li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}

            {messages.length === 1 && (
              <div className="knowledge-chatbot-suggestions" aria-label="建議問題">
                {SUGGESTIONS.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => void submitQuestion(suggestion)} disabled={loading}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="knowledge-chatbot-loading" role="status">
                <i aria-hidden="true"><span /><span /><span /></i>
                賢者正在翻閱卷冊…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="knowledge-chatbot-form" onSubmit={onSubmit}>
            <label htmlFor={`${titleId}-question`}>你的問題</label>
            <div>
              <textarea
                ref={inputRef}
                id={`${titleId}-question`}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={onInputKeyDown}
                maxLength={MAX_QUESTION_LENGTH}
                rows={2}
                placeholder="例如：Moor 開播前要檢查什麼？"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !question.trim()} aria-label="送出問題">
                <SendIcon />
              </button>
            </div>
            <footer><span>Enter 送出 · Shift + Enter 換行</span><span>{question.length}/{MAX_QUESTION_LENGTH}</span></footer>
          </form>
        </section>
      )}
    </aside>
  );
}
