'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Bot, AlertCircle, X } from 'lucide-react';
import { usePersonaChat } from '@/hooks/use-persona-chat';
import { useLifeModelStore } from '@/stores/life-model-store';
import { ChatHeader, ChatMessageList, ChatInput } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { PersonaId } from '@/types';

/**
 * Inner Chat View component that interacts with useSearchParams
 * and connects persona conversation components.
 */
function ChatView(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPersona = searchParams.get('persona') as PersonaId | null;

  const validInitialPersona: PersonaId =
    requestedPersona === 'current' ? 'current' : 'improved';

  const lifeModel = useLifeModelStore((state) => state.model);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const {
    activePersona,
    setActivePersona,
    currentPersonaData,
    messages,
    isLoading,
    error,
    clearError,
    sendMessage,
    clearChat,
    speakingMessageId,
    speakMessage,
  } = usePersonaChat({ initialPersonaId: validInitialPersona });

  // Sync state if URL query param changes
  useEffect(() => {
    if (requestedPersona && (requestedPersona === 'current' || requestedPersona === 'improved')) {
      if (requestedPersona !== activePersona) {
        setActivePersona(requestedPersona);
      }
    }
  }, [requestedPersona, activePersona, setActivePersona]);

  // Handle switching personas and syncing URL without re-rendering page
  const handleSelectPersona = (id: PersonaId) => {
    setActivePersona(id);
    router.replace(`/chat?persona=${id}`, { scroll: false });
  };

  const handleConfirmClear = () => {
    clearChat();
    setIsClearModalOpen(false);
  };

  // If no simulation exists in memory, display empty state guard
  if (!lifeModel) {
    return (
      <main className="min-h-screen bg-bg-primary text-text-primary px-4 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full text-center space-y-5 p-8" data-testid="empty-chat-card">
          <div className="w-12 h-12 rounded-full bg-accent-info/10 text-accent-info flex items-center justify-center mx-auto">
            <Bot className="w-6 h-6" aria-hidden="true" />
          </div>

          <CardHeader className="p-0">
            <CardTitle as="h2" className="text-xl font-bold">
              No Simulation Found
            </CardTitle>
            <CardDescription className="text-text-secondary mt-2">
              You must generate your future personas before conversing with them.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 pt-2">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => router.push('/onboarding')}
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              aria-label="Go to Onboarding"
            >
              Go to Onboarding
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const personaName =
    currentPersonaData?.name ||
    (activePersona === 'current'
      ? 'Future Self (Current Path)'
      : 'Future Self (Improved Path)');

  return (
    <main
      className="min-h-screen bg-bg-primary flex flex-col justify-between"
      data-testid="chat-page-container"
    >
      {/* Sticky Header with Persona Switcher & Actions */}
      <ChatHeader
        activePersona={activePersona}
        onSelectPersona={handleSelectPersona}
        personaName={personaName}
        onBackClick={() => router.push('/dashboard')}
        onClearChat={() => setIsClearModalOpen(true)}
      />

      {/* Error Alert Banner */}
      {error && (
        <div
          role="alert"
          className="bg-accent-danger/10 border-b border-accent-danger/20 text-accent-danger text-xs px-4 py-2.5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            aria-label="Dismiss error"
            className="p-1 hover:bg-accent-danger/20 rounded cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Scrollable Conversation Transcript */}
      <ChatMessageList
        messages={messages}
        personaId={activePersona}
        personaName={personaName}
        isLoading={isLoading}
        onSelectStarter={sendMessage}
        onSpeakMessage={speakMessage}
        speakingMessageId={speakingMessageId}
        className="flex-1 max-w-4xl w-full mx-auto"
      />

      {/* Bottom Text Entry & Disclaimer */}
      <div className="border-t border-border-primary bg-bg-secondary/40 backdrop-blur-sm p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto space-y-2">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            placeholder={`Ask ${personaName} anything...`}
          />

          <p className="text-[11px] text-text-tertiary text-center">
            Future You is a reflection tool, not a prediction engine. Conversations are simulated client-side.
          </p>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Conversation History?"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            This will permanently remove the conversation history with this persona from your browser.
            This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
              aria-label="Cancel clearing chat"
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClear}
              aria-label="Confirm clear chat"
            >
              Clear History
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

/**
 * ChatPage provides the primary route for conversing with future personas.
 * Wrapped in Suspense boundary as required by Next.js App Router for useSearchParams.
 *
 * @returns JSX Element rendering the persona chat page
 */
export default function ChatPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-muted">
          Loading conversation...
        </div>
      }
    >
      <ChatView />
    </Suspense>
  );
}
