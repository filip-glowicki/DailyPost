"use client";

import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface ShareButtonProps {
  title: string;
  content: string;
}

export function ShareButton({ title, content }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = useCallback(() => {
    try {
      // Prepare the tweet text - truncate if too long
      const tweetText = `${title}\n\n${content}`.slice(0, 280);

      // Create Twitter share URL
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

      // Open Twitter share dialog in a new tab
      window.open(tweetUrl, "_blank", "noopener,noreferrer");

      toast({
        title: "Sukces",
        description: "Post został udostępniony na Twitter",
      });
    } catch {
      toast({
        title: "Błąd",
        description: "Nie udało się udostępnić posta na Twitter",
        variant: "destructive",
      });
    }
  }, [title, content, toast]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      title="Udostępnij na Twitter"
      aria-label="Udostępnij post na Twitter"
      data-test-id="share-twitter-button"
    >
      <Share className="mr-2 h-4 w-4" aria-hidden="true" />
      Udostępnij
    </Button>
  );
}
