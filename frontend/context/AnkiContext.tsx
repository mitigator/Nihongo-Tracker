"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import {
  AnkiDeck,
  AnkiCard,
  AnkiDeckFormData,
  AnkiCardFormData,
  DecksResponse,
  CardsResponse,
  DeckReviewResponse,
  ReviewRatingResult,
  AnkiAnalyticsResponse,
  SRSRating,
} from "@/types/anki";

// ─────────────────────────────────────────────
// Widget navigation views
// ─────────────────────────────────────────────
export type AnkiView =
  | "deckList"       // home — grid of all decks
  | "review"         // flip-card review session for activeDeck
  | "cardManager"    // browse / add / move cards in activeDeck
  | "deckForm";      // create or edit a deck

interface AnkiContextType {
  // ── State ──────────────────────────────────
  decks: AnkiDeck[];
  activeDeck: AnkiDeck | null;
  dueCards: AnkiCard[];
  currentCardIndex: number;
  isWidgetOpen: boolean;
  view: AnkiView;
  loading: boolean;
  reviewLoading: boolean;

  // ── Widget navigation ───────────────────────
  openWidget: () => void;
  closeWidget: () => void;
  setView: (view: AnkiView) => void;

  // ── Deck actions ────────────────────────────
  fetchDecks: () => Promise<void>;
  selectDeck: (deck: AnkiDeck) => void;
  clearActiveDeck: () => void;
  createDeck: (data: AnkiDeckFormData) => Promise<boolean>;
  updateDeck: (id: string, data: Partial<AnkiDeckFormData>) => Promise<boolean>;
  deleteDeck: (id: string, action?: "move" | "delete") => Promise<void>;

  // ── Review actions ──────────────────────────
  loadDeckReview: (deckId: string) => Promise<void>;
  submitRating: (cardId: string, rating: SRSRating) => Promise<void>;
  nextCard: () => void;

  // ── Card actions ────────────────────────────
  fetchCards: (deckId: string) => Promise<AnkiCard[]>;
  createCard: (data: AnkiCardFormData) => Promise<boolean>;
  updateCard: (id: string, data: Partial<AnkiCardFormData>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (cardId: string, toDeckId: string) => Promise<boolean>;

  // ── Analytics ───────────────────────────────
  fetchAnkiAnalytics: () => Promise<AnkiAnalyticsResponse | null>;
}

const AnkiContext = createContext<AnkiContextType | undefined>(undefined);

export const AnkiProvider = ({ children }: { children: ReactNode }) => {
  const [decks, setDecks] = useState<AnkiDeck[]>([]);
  const [activeDeck, setActiveDeck] = useState<AnkiDeck | null>(null);
  const [dueCards, setDueCards] = useState<AnkiCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [view, setView] = useState<AnkiView>("deckList");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  // ─────────────────────────────────────────────
  // Widget navigation
  // ─────────────────────────────────────────────
  const openWidget = useCallback(() => {
    setView("deckList");
    setIsWidgetOpen(true);
  }, []);

  const closeWidget = useCallback(() => {
    setIsWidgetOpen(false);
    setActiveDeck(null);
    setDueCards([]);
    setCurrentCardIndex(0);
    setView("deckList");
  }, []);

  // ─────────────────────────────────────────────
  // Deck actions
  // ─────────────────────────────────────────────
  const fetchDecks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<DecksResponse>("/api/anki/decks");
      setDecks(data.decks);
    } catch {
      toast.error("Failed to fetch decks");
    } finally {
      setLoading(false);
    }
  }, []);

  const selectDeck = useCallback((deck: AnkiDeck) => {
    setActiveDeck(deck);
  }, []);

  const clearActiveDeck = useCallback(() => {
    setActiveDeck(null);
    setDueCards([]);
    setCurrentCardIndex(0);
  }, []);

  const createDeck = async (data: AnkiDeckFormData): Promise<boolean> => {
    try {
      const { data: newDeck } = await axiosInstance.post<AnkiDeck>(
        "/api/anki/decks",
        data
      );
      setDecks((prev) => [...prev, newDeck]);
      toast.success(`Deck "${newDeck.name}" created!`);
      return true;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Failed to create deck";
      toast.error(message);
      return false;
    }
  };

  const updateDeck = async (
    id: string,
    data: Partial<AnkiDeckFormData>
  ): Promise<boolean> => {
    try {
      const { data: updated } = await axiosInstance.patch<AnkiDeck>(
        `/api/anki/decks/${id}`,
        data
      );
      setDecks((prev) => prev.map((d) => (d._id === id ? updated : d)));
      if (activeDeck?._id === id) setActiveDeck(updated);
      toast.success("Deck updated");
      return true;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Failed to update deck";
      toast.error(message);
      return false;
    }
  };

  const deleteDeck = async (
    id: string,
    action: "move" | "delete" = "delete"
  ): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/anki/decks/${id}`, {
        data: { action },
      });
      setDecks((prev) => prev.filter((d) => d._id !== id));
      if (activeDeck?._id === id) {
        setActiveDeck(null);
        setView("deckList");
      }
      toast.success("Deck deleted");
    } catch {
      toast.error("Failed to delete deck");
    }
  };

  // ─────────────────────────────────────────────
  // Review actions
  // ─────────────────────────────────────────────
  const loadDeckReview = useCallback(async (deckId: string) => {
    setReviewLoading(true);
    try {
      const { data } = await axiosInstance.get<DeckReviewResponse>(
        `/api/anki/decks/${deckId}/review`
      );
      setDueCards(data.cards);
      setCurrentCardIndex(0);
      setView("review");
    } catch {
      toast.error("Failed to load review cards");
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const submitRating = async (
    cardId: string,
    rating: SRSRating
  ): Promise<void> => {
    if (!activeDeck) return;
    try {
      await axiosInstance.post<ReviewRatingResult>(
        `/api/anki/decks/${activeDeck._id}/review`,
        { cardId, rating }
      );
      // Optimistically advance to the next card — the updated SRS fields
      // are persisted server-side and will be correct on next fetch.
      setCurrentCardIndex((prev) => prev + 1);

      // Refresh deck due count in the background.
      fetchDecks();
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  const nextCard = useCallback(() => {
    setCurrentCardIndex((prev) => prev + 1);
  }, []);

  // ─────────────────────────────────────────────
  // Card actions
  // ─────────────────────────────────────────────
  const fetchCards = useCallback(async (deckId: string): Promise<AnkiCard[]> => {
    try {
      const { data } = await axiosInstance.get<CardsResponse>(
        `/api/anki/cards?deckId=${deckId}`
      );
      return data.cards;
    } catch {
      toast.error("Failed to fetch cards");
      return [];
    }
  }, []);

  const createCard = async (data: AnkiCardFormData): Promise<boolean> => {
    try {
      await axiosInstance.post<AnkiCard>("/api/anki/cards", data);
      // Refresh decks so cardCount updates.
      fetchDecks();
      toast.success("Card added!");
      return true;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Failed to create card";
      toast.error(message);
      return false;
    }
  };

  const updateCard = async (
    id: string,
    data: Partial<AnkiCardFormData>
  ): Promise<boolean> => {
    try {
      await axiosInstance.patch<AnkiCard>(`/api/anki/cards/${id}`, data);
      toast.success("Card updated");
      return true;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Failed to update card";
      toast.error(message);
      return false;
    }
  };

  const deleteCard = async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/anki/cards/${id}`);
      fetchDecks();
      toast.success("Card deleted");
    } catch {
      toast.error("Failed to delete card");
    }
  };

  const moveCard = async (
    cardId: string,
    toDeckId: string
  ): Promise<boolean> => {
    try {
      await axiosInstance.patch<AnkiCard>(`/api/anki/cards/${cardId}`, {
        deckId: toDeckId,
      });
      fetchDecks();
      toast.success("Card moved");
      return true;
    } catch {
      toast.error("Failed to move card");
      return false;
    }
  };

  // ─────────────────────────────────────────────
  // Analytics
  // ─────────────────────────────────────────────
  const fetchAnkiAnalytics = useCallback(async (): Promise<AnkiAnalyticsResponse | null> => {
    try {
      const { data } = await axiosInstance.get<AnkiAnalyticsResponse>(
        "/api/anki/analytics"
      );
      return data;
    } catch {
      toast.error("Failed to fetch Anki analytics");
      return null;
    }
  }, []);

  return (
    <AnkiContext.Provider
      value={{
        decks,
        activeDeck,
        dueCards,
        currentCardIndex,
        isWidgetOpen,
        view,
        loading,
        reviewLoading,
        openWidget,
        closeWidget,
        setView,
        fetchDecks,
        selectDeck,
        clearActiveDeck,
        createDeck,
        updateDeck,
        deleteDeck,
        loadDeckReview,
        submitRating,
        nextCard,
        fetchCards,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        fetchAnkiAnalytics,
      }}
    >
      {children}
    </AnkiContext.Provider>
  );
};

export const useAnkiContext = () => {
  const ctx = useContext(AnkiContext);
  if (!ctx) throw new Error("useAnkiContext must be used inside AnkiProvider");
  return ctx;
};
