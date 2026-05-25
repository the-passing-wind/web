"use client";

import { Shield, BookOpen, HeartPulse, Scale, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/i18n";


const CategoryIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "Safety":
      return <Shield className="w-5 h-5 text-[#FF6B6B]" />;
    case "Legal":
      return <Scale className="w-5 h-5 text-blue-500" />;
    case "Healthcare":
      return <HeartPulse className="w-5 h-5 text-green-500" />;
    case "Community":
      return <BookOpen className="w-5 h-5 text-purple-500" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

export default function ResourceSection() {
  const { t } = useLanguage();
  return (
    <section id="resources" className="py-24 bg-bg-base transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 text-text-main">
            {t.resources.title} <span className="text-brand italic">{t.resources.titleAccent}</span>
          </h2>
          <p className="text-text-dim max-w-2xl mx-auto font-medium text-base sm:text-lg">
            {t.resources.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.resources.items.map((resource, i) => (
            <motion.a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-bg-base border border-border-main rounded-4xl p-8 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-bg-surface group-hover:bg-brand/10 flex items-center justify-center transition-colors">
                  <CategoryIcon type={resource.category} />
                </div>
                <ExternalLink className="w-4 h-4 text-text-dim/30 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-text-main">{resource.title}</h3>
              <p className="text-sm text-text-dim leading-relaxed font-serif italic text-lg line-clamp-3">
                &quot;{resource.description}&quot;
              </p>
              <div className="mt-8 inline-block text-[10px] font-black tracking-widest uppercase py-1 px-4 border border-border-main text-text-dim group-hover:border-brand group-hover:text-brand rounded-full transition-colors">
                {t.common.categories[resource.category]}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
