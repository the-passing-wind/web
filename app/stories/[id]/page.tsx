"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import CommentSection from "@/components/CommentSection";
import { useLanguage } from "@/lib/i18n";
import { Heart, ArrowLeft, User as UserIcon, Quote, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";

interface Story {
  id: string;
  content: string;
  alias?: string;
  category: "Experience" | "Encouragement" | "Observation";
  createdAt: any;
}

export default function StoryDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const path = `stories/${id as string}`;
    const unsubscribe = onSnapshot(
      doc(db, path),
      (docSnap) => {
        if (docSnap.exists()) {
          setStory({ id: docSnap.id, ...docSnap.data() } as Story);
        }
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, path);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-bg-base">
        <Navbar />
        <div className="pt-40 max-w-xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-serif text-text-main mb-8">{t.stories.notFound}</h1>
          <Link href="/stories" className="text-brand font-bold hover:underline">
            {t.stories.backToArchive}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <Navbar />

      <div className="pt-32 pb-12 bg-bg-surface">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-dim hover:text-brand transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.stories.backToArchive}
          </Link>

          <article className="bg-bg-base border border-border-main rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-bg-surface rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-text-dim opacity-50" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-text-main">
                    {story.alias || t.common.anonymousAgent}
                  </h2>
                  <p className="text-xs font-mono text-text-dim uppercase tracking-widest">
                    {story.createdAt?.toDate
                      ? formatDistanceToNow(story.createdAt.toDate(), { addSuffix: true })
                      : t.common.justNow}
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-bg-surface rounded-full text-xs font-black uppercase tracking-widest text-text-dim border border-border-main">
                {t.stories.categories[story.category]}
              </span>
            </div>

            <div className="font-serif text-2xl sm:text-3xl leading-relaxed text-text-main opacity-90 whitespace-pre-wrap italic mb-12">
              &quot;{story.content}&quot;
            </div>

            <div className="pt-8 border-t border-border-main">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm font-bold text-text-dim hover:text-brand transition-colors group">
                    <Heart className="w-5 h-5 group-hover:fill-brand transition-colors" />
                    <span>{t.stories.witnessed}</span>
                  </button>
                  <span className="w-1.5 h-1.5 bg-border-main rounded-full"></span>
                  <div className="flex items-center gap-2 text-xs text-text-dim">
                    <Sparkles className="w-4 h-4" />
                    <span>{t.stories.securityNote}</span>
                  </div>
                </div>
              </div>

              <CommentSection storyId={story.id} />
            </div>
          </article>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center text-center px-6">
        <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center mb-8 shadow-xl">
          <Heart className="text-white w-6 h-6 fill-current" />
        </div>
        <p className="text-text-dim max-w-md mb-8 leading-relaxed italic text-lg opacity-60">
          {t.footer.quote}
        </p>
      </div>
    </main>
  );
}
