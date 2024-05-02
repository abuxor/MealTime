import React from "react";
import { SendIcon, SparklesIcon } from "@/components/icons";
import ScrollToBottom from "react-scroll-to-bottom";
import Markdown from "react-markdown";

export interface ChatBubbleProps {
  position: "left" | "right";
  icon?: React.ReactNode;
  initials?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export interface ChatFooterProps {
  children?: React.ReactNode;
  onSubmit?: Function;
  placeholder?: string;
  defaultValue?: string;
}

export interface ChatContentProps extends ChatFooterProps {
  children?: React.ReactNode;
}

export interface ChatListProps {
  children?: React.ReactNode;
}

export interface ChatRootProps {
  children?: React.ReactNode;
}

function ChatFooter({
  children,
  onSubmit,
  placeholder = "Please ask me a question...",
  defaultValue = "",
}: ChatFooterProps) {
  return (
    <footer className="max-w-4xl mx-auto sticky bottom-0 z-10 bg-white pt-2 pb-4 sm:pt-4 sm:pb-6 px-4 sm:px-6 lg:px-0">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
          e.currentTarget.reset();
        }}
      >
        <label htmlFor="chat" className="sr-only">
          {placeholder}
        </label>
        <div className="flex items-center px-3 py-2">
          <textarea
            name="message"
            rows={3}
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
          <button
            type="submit"
            className="inline-flex justify-center p-2 text-white bg-rose-500 rounded-md cursor-pointer hover:bg-rose-600"
          >
            <SendIcon />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </footer>
  );
}

function ChatLoader() {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 bg-green-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-green-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-green-700 rounded-full animate-bounce"></div>
    </div>
  );
}

function ChatBubble({
  position,
  children,
  icon = (
    <SparklesIcon className="w-8 h-8  p-1  text-green-700 bg-rose-300 rounded-full" />
  ),
  initials = "ME",
  isLoading = false,
}: ChatBubbleProps) {
  const Children = <Markdown className="prose-sm">{children}</Markdown>;
  if (position === "left")
    return (
      <li className="flex gap-x-2 sm:gap-x-4">
        {icon}
        <div className="grow max-w-[90%] md:max-w-2xl w-full space-y-3">
          <div className="bg-white border border-gray-200 rounded-md p-4 space-y-3 text-sm text-gray-800 ">
            {isLoading ? <ChatLoader /> : Children}
          </div>
        </div>
      </li>
    );
  return (
    <li className="max-w-2xl ms-auto flex justify-end gap-x-2 sm:gap-x-4">
      <div className="grow text-end space-y-3">
        <div className="inline-block bg-rose-100 rounded-md p-4 text-sm text-gray-800">
          {isLoading ? <ChatLoader /> : Children}
        </div>
      </div>
      <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-600">
        <span className="text-sm font-medium text-white leading-none">
          {initials}
        </span>
      </span>
    </li>
  );
}

function ChatList({ children }: ChatListProps) {
  return <ul className="space-y-5">{children}</ul>;
}

function ChatRoot({ children }: ChatRootProps) {
  return (
    <ScrollToBottom>
      <div className="relative h-[90vh]">{children}</div>
    </ScrollToBottom>
  );
}

function ChatContent({ children }: ChatContentProps) {
  return (
    <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto  min-h-[70vh]">
      {children}
    </div>
  );
}

export const Chat = {
  Root: ChatRoot,
  Bubble: ChatBubble,
  Content: ChatContent,
  List: ChatList,
  Footer: ChatFooter,
};

export default Chat;
