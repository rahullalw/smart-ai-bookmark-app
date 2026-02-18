"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  // 1. Initial fetch
  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookmarks(data);
      }
      setLoading(false);
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId, supabase]);

  // 2. Realtime broadcast subscription (driven by DB trigger)
  useEffect(() => {
    if (!userId) return;

    const topic = `user:${userId}:bookmarks`;
    console.log(`📡 Subscribing to broadcast channel: ${topic}`);

    const channel = supabase
      .channel(topic, { config: { private: true } })
      // INSERT broadcast
      .on("broadcast", { event: "INSERT" }, ({ payload }) => {
        console.log("📨 Broadcast INSERT:", payload);
        const record = payload.record as Bookmark;
        setBookmarks((prev) => [record, ...prev]);
      })
      // UPDATE broadcast
      .on("broadcast", { event: "UPDATE" }, ({ payload }) => {
        console.log("📨 Broadcast UPDATE:", payload);
        const record = payload.record as Bookmark;
        setBookmarks((prev) =>
          prev.map((b) => (b.id === record.id ? record : b))
        );
      })
      // DELETE broadcast
      .on("broadcast", { event: "DELETE" }, ({ payload }) => {
        console.log("📨 Broadcast DELETE:", payload);
        // Deleted row may come as payload.record, payload.old, or payload.old_record
        const record = (payload.record ?? payload.old ?? payload.old_record) as Bookmark | null;
        if (!record?.id) {
          console.warn("⚠️ DELETE broadcast missing record id, skipping", payload);
          return;
        }
        setBookmarks((prev) => prev.filter((b) => b.id !== record.id));
      })
      .subscribe((status) => {
        console.log("📡 Broadcast channel status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Listening for broadcast events on", topic);
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Broadcast channel error — check Supabase realtime & trigger config");
        } else if (status === "TIMED_OUT") {
          console.error("⏱️ Broadcast channel subscription timed out");
        }
      });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Unsubscribing from broadcast channel:", topic);
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // 3. Add bookmark
  const addBookmark = async (url: string, title: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .insert({ url, title, user_id: userId });

    if (error) {
      console.error("Add error:", error);
      throw error;
    }
  };

  // 4. Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return { bookmarks, loading, addBookmark, deleteBookmark };
}