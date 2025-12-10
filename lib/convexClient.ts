import { ConvexReactClient } from "convex/react";

// URL of your Convex deployment.
// In local development, set VITE_CONVEX_URL inside `.env.local`,
// e.g. VITE_CONVEX_URL="http://localhost:8187"
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  // This keeps runtime failures explicit if Convex is not configured.
  // The UI can still handle this gracefully if needed.
  console.warn(
    "VITE_CONVEX_URL is not set. ConvexReactClient will not be able to connect."
  );
}

export const convex = new ConvexReactClient(convexUrl ?? "");


