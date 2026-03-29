"use client";

import * as React from "react";
import { Portal } from "@ark-ui/react/portal";
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";
import {
  AlertCircle,
  AlertTriangle,
  CircleCheck,
  Info,
  Sparkles,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    position?: ToastPosition,
  ) => void;
}

interface BasicToastOptions {
  description?: string;
  duration?: number;
  position?: ToastPosition;
  title?: string;
  type?: ToastType;
}

type ToastPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "top";

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const POSITION_TO_PLACEMENT: Record<ToastPosition, ToastPlacement> = {
  "top-left": "top-start",
  "top-right": "top-end",
  "bottom-left": "bottom-start",
  "bottom-right": "bottom-end",
  center: "top",
};

const POSITION_ORDER: ToastPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
];

const TOASTERS: Record<ToastPosition, ReturnType<typeof createToaster>> = {
  "top-left": createToaster({
    gap: 14,
    max: 4,
    overlap: true,
    placement: POSITION_TO_PLACEMENT["top-left"],
  }),
  "top-right": createToaster({
    gap: 14,
    max: 4,
    overlap: true,
    placement: POSITION_TO_PLACEMENT["top-right"],
  }),
  "bottom-left": createToaster({
    gap: 14,
    max: 4,
    overlap: true,
    placement: POSITION_TO_PLACEMENT["bottom-left"],
  }),
  "bottom-right": createToaster({
    gap: 14,
    max: 4,
    overlap: true,
    placement: POSITION_TO_PLACEMENT["bottom-right"],
  }),
  center: createToaster({
    gap: 14,
    max: 3,
    overlap: true,
    placement: POSITION_TO_PLACEMENT.center,
  }),
};

const TOAST_STYLES: Record<
  ToastType,
  {
    accent: string;
    border: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconWrap: string;
    title: string;
  }
> = {
  success: {
    accent: "from-emerald-500 via-emerald-400 to-cyan-400",
    border: "border-emerald-200/80 dark:border-emerald-500/25",
    description: "text-slate-600 dark:text-slate-300",
    icon: CircleCheck,
    iconWrap:
      "bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/15 dark:bg-emerald-400/12 dark:text-emerald-300 dark:ring-emerald-400/20",
    title: "Success",
  },
  error: {
    accent: "from-rose-500 via-red-500 to-orange-400",
    border: "border-rose-200/80 dark:border-rose-500/25",
    description: "text-slate-600 dark:text-slate-300",
    icon: AlertCircle,
    iconWrap:
      "bg-rose-500/12 text-rose-600 ring-1 ring-rose-500/15 dark:bg-rose-400/12 dark:text-rose-300 dark:ring-rose-400/20",
    title: "Something went wrong",
  },
  warning: {
    accent: "from-amber-500 via-orange-400 to-yellow-300",
    border: "border-amber-200/80 dark:border-amber-500/25",
    description: "text-slate-600 dark:text-slate-300",
    icon: AlertTriangle,
    iconWrap:
      "bg-amber-500/12 text-amber-600 ring-1 ring-amber-500/15 dark:bg-amber-400/12 dark:text-amber-300 dark:ring-amber-400/20",
    title: "Heads up",
  },
  info: {
    accent: "from-sky-500 via-blue-500 to-cyan-400",
    border: "border-sky-200/80 dark:border-sky-500/25",
    description: "text-slate-600 dark:text-slate-300",
    icon: Info,
    iconWrap:
      "bg-sky-500/12 text-sky-600 ring-1 ring-sky-500/15 dark:bg-sky-400/12 dark:text-sky-300 dark:ring-sky-400/20",
    title: "DevHub update",
  },
};

function getToastStyles(type: string | undefined) {
  return TOAST_STYLES[(type as ToastType) || "info"] ?? TOAST_STYLES.info;
}

export function showBasicToast(
  message: string,
  type: ToastType = "info",
  position: ToastPosition = "bottom-right",
  options: Omit<BasicToastOptions, "position" | "type"> = {},
) {
  const toaster = TOASTERS[position] ?? TOASTERS["bottom-right"];
  const meta = TOAST_STYLES[type] ?? TOAST_STYLES.info;

  queueMicrotask(() => {
    toaster.create({
      description: options.description ?? message,
      duration: options.duration ?? 4200,
      title: options.title ?? meta.title,
      type,
    });
  });
}

function BasicToastCard({
  description,
  title,
  type,
}: {
  description?: React.ReactNode;
  title?: React.ReactNode;
  type?: string;
}) {
  const meta = getToastStyles(type);
  const Icon = meta.icon;

  return (
    <Toast.Root
      className={cn(
        "relative w-[min(92vw,24rem)] overflow-hidden rounded-2xl border bg-white/95 p-4 pr-11 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/85",
        "h-[var(--height)] translate-x-[var(--x)] translate-y-[var(--y)] scale-[var(--scale)] opacity-[var(--opacity)] [z-index:var(--z-index)]",
        "will-change-transform transition-[translate,scale,opacity,height,box-shadow] duration-300 ease-[cubic-bezier(0.21,1.02,0.73,1)] data-[state=closed]:duration-200 data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)]",
        "dark:bg-slate-950/85",
        meta.border,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          meta.accent,
        )}
      />
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            meta.iconWrap,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <Toast.Title className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title ?? meta.title}
          </Toast.Title>
          {description ? (
            <Toast.Description className={cn("mt-1 text-sm leading-5", meta.description)}>
              {description}
            </Toast.Description>
          ) : null}
        </div>
      </div>
      <Toast.CloseTrigger className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/80 dark:hover:text-slate-200">
        <X className="h-4 w-4" />
      </Toast.CloseTrigger>
    </Toast.Root>
  );
}

export function BasicToastViewport() {
  return (
    <Portal>
      {POSITION_ORDER.map((position) => (
        <Toaster key={position} toaster={TOASTERS[position]}>
          {(toast) => (
            <BasicToastCard
              description={toast.description}
              title={toast.title}
              type={toast.type}
            />
          )}
        </Toaster>
      ))}
    </Portal>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = React.useCallback(
    (
      message: string,
      type: ToastType = "info",
      position: ToastPosition = "bottom-right",
    ) => {
      showBasicToast(message, type, position);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <BasicToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function ToastShowcaseDemo() {
  const { showToast } = useToast();

  return (
    <div className="w-full rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            DevHub Toasts
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Clean feedback for auth, learning flows, and AI actions.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
          onClick={() =>
            showToast("Your profile changes were saved successfully.", "success", "top-right")
          }
          type="button"
        >
          Show Success Toast
        </button>
        <button
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
          onClick={() =>
            showToast("We couldn't reach the server. Please try again.", "error", "bottom-right")
          }
          type="button"
        >
          Show Error Toast
        </button>
        <button
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/15"
          onClick={() =>
            showToast("You still need to complete one more step.", "warning", "top-left")
          }
          type="button"
        >
          Show Warning Toast
        </button>
        <button
          className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-100 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/15"
          onClick={() =>
            showToast("AI assistant is ready to help with this lesson.", "info", "bottom-left")
          }
          type="button"
        >
          Show Info Toast
        </button>
      </div>
    </div>
  );
}

export function ToastBasic() {
  return (
    <ToastProvider>
      <div className="w-full rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-sky-50/70 p-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <ToastShowcaseDemo />
      </div>
    </ToastProvider>
  );
}

export default ToastBasic;
