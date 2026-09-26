import { createFileRoute } from "@tanstack/react-router";
import { DaybreakDesktop } from "@/components/daybreak/DaybreakDesktop";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Daybreak | Personal Command Centre" },
    { name: "description", content: "A pastel cyber personal OS for focus, notes, reading, budgeting, and daily reflection." },
    { property: "og:title", content: "Daybreak | Personal Command Centre" },
    { property: "og:description", content: "A pastel cyber personal OS for focus, notes, reading, budgeting, and daily reflection." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <DaybreakDesktop />;
}
