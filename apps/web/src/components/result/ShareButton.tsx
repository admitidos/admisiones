"use client";

import { useState, useCallback } from "react";
import { Share2, Check, Link } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [title, text]);

  return (
    <button
      data-testid="share-button"
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-sm border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-foreground transition-all hover:border-accent hover:text-accent"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          ¡Enlace copiado!
        </>
      ) : (
        <>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
            <Share2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Link className="h-4 w-4" aria-hidden="true" />
          )}
          Compartir resultado
        </>
      )}
    </button>
  );
}
