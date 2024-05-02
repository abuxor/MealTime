"use client";
import { Card, CardBody, CardHeader } from "@/components/card";
import { IconButton, Button } from "@radix-ui/themes";
import React from "react";
import { Drawer } from "@/components/drawer";
import { generateInsight } from "@/api/mealPlan";
import { useAsync } from "@/hooks/useAsync";
import { Chat as ChatUI } from "@/components/chat";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { SparklesIcon, CloseIcon } from "@/components/icons";
import useAxios from "@/hooks/useAxios";
export interface Message {
  content?: string;
  name?: string;
  id?: string;
  isLoading?: boolean;
  isResponse?: boolean;
}

export interface ChatProps {
  builtInPrompts?: Message[];
}

export function Chat({ builtInPrompts }: ChatProps) {
  const AxiosClientSide = useAxios();
  const [open, setOpen] = React.useState(false);
  const [chat, setChat] = React.useState<any[]>([]);

  const onChatSend = async (prompt: string) => {
    return await generateInsight({ prompt }, AxiosClientSide);
  };
  const onBuiltInPromptClicked = (name: string, prompt: string) => {
    addReplyToChat(name);
    addLoadingResponseToChat();
    onReply(prompt);
  };

  const onResponseComplete = (response: any) => {
    const message: Message = {
      isLoading: false,
      isResponse: true,
      content: "",
    };
    if (response && response.insight) {
      message.content = response.insight;
    }
    updateLastMessage(message);
  };

  const onResponseError = (response: any) => {
    const message: Message = {
      isLoading: false,
      isResponse: true,
      content: response,
    };
    updateLastMessage(message);
  };

  const addMessage = (message: Message) => {
    setChat((prev) => [...prev, { ...message }]);
  };

  const updateLastMessage = (message: Message) => {
    setChat((prev) => {
      const newChat = [...prev];
      newChat[newChat.length - 1] = message;
      return newChat;
    });
  };

  const addReplyToChat = (content: string, name?: string, id?: string) => {
    addMessage({ content, isResponse: false, isLoading: false, name, id });
  };
  const addLoadingResponseToChat = () => {
    addMessage({ content: "Loading", isResponse: true, isLoading: true });
  };

  const { request: onReply } = useAsync(onChatSend, {
    onComplete: onResponseComplete,
    onError: onResponseError,
  });

  const onReplySubmit = (e: any) => {
    const formData = new FormData(e.target);
    const message = formData.get("message");
    if (message && typeof message === "string") {
      addReplyToChat(message);
      addLoadingResponseToChat();
      onReply(message);
    }
  };
  return (
    <>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger>
          <Button size="4" color="green">
            <SparklesIcon /> Meal AI
          </Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Card>
            <div className="sticky top-0 bg-white z-50">
              <CardHeader title="Meal AI">
                <Drawer.Close>
                  <IconButton>
                    <CloseIcon />
                  </IconButton>
                </Drawer.Close>
              </CardHeader>
            </div>
            <CardBody>
              <ChatUI.Root>
                <ChatUI.Content>
                  {chat.length < 1 && (
                    <>
                      <EmptyPlaceholder
                        title="Welcome to Meal AI"
                        subtitle="Meal AI can help you plan your meals faster and smarter"
                        image={
                          <SparklesIcon className="w-32 h-32 text-green-200" />
                        }
                      />
                      <div className="flex justify-center">
                        <div>
                          {builtInPrompts &&
                            builtInPrompts.length > 0 &&
                            builtInPrompts.map(({ name, content }) => (
                              <button
                                key={name}
                                onClick={() => {
                                  if (name && content)
                                    onBuiltInPromptClicked(name, content);
                                }}
                                type="button"
                                className="mb-2.5 me-1.5 py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg border border-rose-600 bg-white text-rose-600 align-middle hover:bg-rose-50 text-sm"
                              >
                                {name}
                              </button>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                  <ChatUI.List>
                    {chat.map(({ isResponse, content, isLoading }) => (
                      <ChatUI.Bubble
                        key={content}
                        isLoading={isLoading}
                        position={isResponse ? "left" : "right"}
                        initials={"EW"}
                      >
                        {content}
                      </ChatUI.Bubble>
                    ))}
                  </ChatUI.List>
                </ChatUI.Content>
                <ChatUI.Footer onSubmit={onReplySubmit}></ChatUI.Footer>
              </ChatUI.Root>
            </CardBody>
          </Card>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
