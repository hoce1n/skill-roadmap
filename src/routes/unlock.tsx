import { createFileRoute, redirect } from "@tanstack/react-router";
import { UnlockForm } from "@/components/unlock-form";
import { getUnlockState } from "@/lib/items.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Unlock · Skill Roadmap Tracker" },
      {
        name: "description",
        content: "Enter the shared passcode to open the skill roadmap checklist.",
      },
    ],
  }),
  loader: async () => {
    const state = await getUnlockState();
    if (state.unlocked) throw redirect({ to: "/" });
    return state;
  },
  component: UnlockPage,
});

function UnlockPage() {
  const state = Route.useLoaderData();
  return <UnlockForm initial={state} />;
}
