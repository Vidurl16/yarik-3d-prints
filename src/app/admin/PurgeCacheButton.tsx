"use client";

import { useState } from "react";
import { purgeCache } from "./actions";

export default function PurgeCacheButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    setState("loading");
    try {
      await purgeCache();
      setState("done");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="font-body text-xs tracking-wider px-3 py-1.5 border transition-all duration-150 disabled:opacity-50"
      style={{
        borderColor:
          state === "done" ? "rgba(74,222,128,0.5)" :
          state === "error" ? "rgba(248,113,113,0.5)" :
          "rgba(196,160,69,0.25)",
        color:
          state === "done" ? "rgb(74,222,128)" :
          state === "error" ? "rgb(248,113,113)" :
          "rgba(196,160,69,0.8)",
      }}
    >
      {state === "loading" ? "Purging..." :
       state === "done"    ? "✓ Cache Cleared" :
       state === "error"   ? "✗ Failed" :
       "Purge Cache"}
    </button>
  );
}
