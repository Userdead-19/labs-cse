"use client";

import * as React from "react";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="relative bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md rounded p-4 min-w-[250px]"
        >
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-1 right-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            ✖
          </button>
          <p className="font-medium">{toast.title}</p>
          {toast.description && (
            <p className="text-sm text-zinc-500">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
