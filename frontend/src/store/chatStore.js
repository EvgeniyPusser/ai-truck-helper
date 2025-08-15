import { create } from 'zustand'

const useChatStore = create((set, get) => ({
  // State
  messages: [],
  isTyping: false,
  isVoiceEnabled: false,
  currentConversation: null,

  // Actions
  addMessage: (message) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          timestamp: new Date(),
          ...message,
        },
      ],
    }));
  },

  sendMessage: async (text, context = {}) => {
    const { addMessage } = get();

    // Add user message
    addMessage({
      type: "user",
      content: text,
      sender: "user",
    });

    // Set typing indicator
    set({ isTyping: true });

    try {
      // TODO: Replace with actual AI API call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("holly_token")}`,
        },
        body: JSON.stringify({
          message: text,
          context,
          conversation_id: get().currentConversation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add AI response
      addMessage({
        type: "gnome",
        content: data.message,
        sender: "holly",
        suggestions: data.suggestions || [],
      });

      set({
        isTyping: false,
        currentConversation: data.conversation_id,
      });
    } catch {
      // Add error message
      addMessage({
        type: "error",
        content: "Sorry, I'm having trouble right now. Please try again!",
        sender: "system",
      });

      set({ isTyping: false });
    }
  },

  // Mock gnome responses for development
  sendMockMessage: (text) => {
    const { addMessage } = get();

    // Add user message
    addMessage({
      type: "user",
      content: text,
      sender: "user",
    });

    // Set typing indicator
    set({ isTyping: true });

    // Simulate AI thinking time
    setTimeout(() => {
      const mockResponses = [
        "🧙‍♂️ That's a great question! Based on your move details, I'd recommend the cross-loading option. It combines professional transport with local helpers, saving you about 40% compared to full-service movers.",
        "🧙‍♂️ I can help you find the perfect solution! For your move distance, container sharing might be ideal - it's eco-friendly and cost-effective. Would you like me to show you available options?",
        "🧙‍♂️ Excellent choice! Let me explain why this option works best for your situation. The timing, distance, and your move type all factor into this recommendation.",
        "🧙‍♂️ I see you're interested in saving money while keeping things simple. Have you considered splitting the job - using professional movers for heavy items and handling boxes yourself?",
      ];

      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];

      addMessage({
        type: "gnome",
        content: randomResponse,
        sender: "holly",
        suggestions: [
          "Tell me more",
          "Show options",
          "Get quotes",
          "Ask another question",
        ],
      });

      set({ isTyping: false });
    }, 1500);
  },

  clearChat: () => {
    set({
      messages: [],
      currentConversation: null,
      isTyping: false,
    });
  },

  toggleVoice: () => {
    set((state) => ({
      isVoiceEnabled: !state.isVoiceEnabled,
    }));
  },

  startNewConversation: () => {
    set({
      messages: [],
      currentConversation: null,
      isTyping: false,
    });

    // Add welcome message
    const { addMessage } = get();
    addMessage({
      type: "gnome",
      content:
        "🧙‍♂️ Hi! I'm Holly, your moving assistant. I'm here to help you find the perfect moving solution. What would you like to know?",
      sender: "holly",
      suggestions: [
        "Explain cross-loading",
        "Show all options",
        "Help me save money",
        "Timeline questions",
      ],
    });
  },

  // Запрос плана переезда (новый метод)
  requestPlan: async ({ from, to, date, volume, needHelpers }) => {
    const { addMessage } = get();
    set({ isTyping: true });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("holly_token") || ""}`,
        },
        body: JSON.stringify({ from, to, date, volume, needHelpers }),
      });

      if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
      const data = await res.json();

      // Коротко покажем результат как ответ гномика
      const km = Math.round((data?.itinerary?.km ?? 0) * 10) / 10;
      const hours = data?.itinerary?.hours ?? "—";
      const total = data?.pricing?.estTotal ?? "—";
      addMessage({
        type: "gnome",
        sender: "holly",
        content: `🗺️ ${data?.itinerary?.from} → ${data?.itinerary?.to}\n⏱️ ${hours} ч · ${km} км\n💵 ~$${total}`,
        suggestions: [
          "Показать детали",
          "Изменить параметры",
          "Сохранить план",
        ],
      });

      set({ isTyping: false });
      return data;
    } catch (e) {
      addMessage({
        type: "error",
        sender: "system",
        content: "Не удалось получить план. Попробуйте ещё раз.",
      });
      set({ isTyping: false });
      throw e;
    }
  },
}));

export default useChatStore
