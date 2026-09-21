import { createFileRoute, redirect } from "@tanstack/react-router";
import { Checklist } from "@/components/checklist";
import { getUnlockState, listItems } from "@/lib/items.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skill Roadmap Tracker" },
      {
        name: "description",
        content:
          "Check off the full-stack skill roadmap. Notes, links, and markdown export.",
      },
    ],
  }),
  beforeLoad: async () => {
    const state = await getUnlockState();
    if (!state.unlocked) {
      throw redirect({ to: "/unlock" });
    }
  },
  loader: () => listItems(),
  component: Home,
});

function Home() {
  const items = Route.useLoaderData();
  return <Checklist initialItems={items} />;
}
