"use client"
import { useAuth } from "@/contexts/authContext";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

// Updated CSS import from new package
import "@knocklabs/react/dist/index.css";
import { useRef, useState } from "react";

export const KnockNotificationFeed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const { user } = useAuth()
  return (
    // Updated props on KnockProvider
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY}
      user={{ id: user?.id }}
    >
      <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>
  );
};