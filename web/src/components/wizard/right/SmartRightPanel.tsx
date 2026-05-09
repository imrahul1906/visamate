"use client";

/**
 * SmartRightPanel — "Your Journey, Building Live"
 * ================================================
 * Orchestrates the right panel across all wizard steps.
 *
 * Step 0 → <JourneySpark />          — Animated globe + destination inspiration
 * Step 1 → <DestinationRevealed />   — Atmospheric country portrait
 * Step 2 → <JourneyArc />            — Live visa profile card + journey arc
 * Step 3 → <ApplicationTimeline />   — Personalised milestone timeline
 * All done → Real DocumentsContent (handled in WizardAccordion)
 */

import JourneySpark        from "./JourneySpark";
import DestinationRevealed from "./Destinationrevealed";
import JourneyArc          from "./Journeyarc";
import ApplicationTimeline from "./Applicationtimeline";
import type { Selection }  from "./types";

interface Props {
  selection: Selection;
  completedCount: number;
}

export default function SmartRightPanel({ selection, completedCount }: Props) {
  if (completedCount === 0) return <JourneySpark />;
  if (completedCount === 1) return <DestinationRevealed selection={selection} />;
  if (completedCount === 2) return <JourneyArc selection={selection} />;
  return <ApplicationTimeline selection={selection} completedCount={completedCount} />;
}