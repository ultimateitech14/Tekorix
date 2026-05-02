"use client";

import { useEffect } from "react";

const interactiveContainerTags = new Set(["article", "aside", "div", "form", "li", "section"]);
const roundedClassPattern = /(?:^|\s)rounded-(?:full|md|lg|xl|2xl)(?:\s|$)|rounded-\[[^\]]+\]/;
const backgroundClassPattern = /(?:^|\s)bg-(?:\[[^\]]+\]|[^\s]+)/;

function getClassName(element: Element) {
  return typeof element.className === "string" ? element.className : element.getAttribute("class") ?? "";
}

function isInteractiveSurface(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.dataset.noSurfaceWave === "true" || element.hasAttribute("disabled")) {
    return false;
  }

  if (element.matches("button:not(:disabled), a[href], [role='button'], .surface-card")) {
    return true;
  }

  if (!interactiveContainerTags.has(element.tagName.toLowerCase())) {
    return false;
  }

  const className = getClassName(element);

  if (!roundedClassPattern.test(className) || !backgroundClassPattern.test(className)) {
    return false;
  }

  return !className.includes("pointer-events-none");
}

function findSurface(target: EventTarget | null) {
  let current = target instanceof Element ? target : null;

  while (current) {
    if (isInteractiveSurface(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function setWaveOrigin(surface: HTMLElement, clientX?: number, clientY?: number) {
  const rect = surface.getBoundingClientRect();

  if (!rect.width || !rect.height || clientX === undefined || clientY === undefined) {
    surface.style.setProperty("--surface-wave-x", "50%");
    surface.style.setProperty("--surface-wave-y", "50%");
    return;
  }

  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;

  surface.style.setProperty("--surface-wave-x", `${Math.max(0, Math.min(100, x))}%`);
  surface.style.setProperty("--surface-wave-y", `${Math.max(0, Math.min(100, y))}%`);
}

function markSurface(surface: HTMLElement) {
  surface.classList.add("surface-wave-ready");
}

export function SurfaceInteractionEffects() {
  useEffect(() => {
    const pressTimers = new Map<HTMLElement, number>();
    let hoveredSurface: HTMLElement | null = null;

    function clearPress(surface: HTMLElement) {
      const timer = pressTimers.get(surface);

      if (timer !== undefined) {
        window.clearTimeout(timer);
        pressTimers.delete(surface);
      }

      surface.classList.remove("surface-wave-press");
    }

    function setHoveredSurface(surface: HTMLElement | null) {
      if (hoveredSurface && hoveredSurface !== surface) {
        hoveredSurface.classList.remove("surface-wave-hover");
      }

      hoveredSurface = surface;

      if (surface) {
        markSurface(surface);
        surface.classList.add("surface-wave-hover");
      }
    }

    function handlePointerOver(event: PointerEvent) {
      if (event.pointerType === "touch") {
        return;
      }

      const surface = findSurface(event.target);

      if (!surface) {
        return;
      }

      const relatedSurface = findSurface(event.relatedTarget);

      if (surface !== relatedSurface) {
        setHoveredSurface(surface);
      }

      setWaveOrigin(surface, event.clientX, event.clientY);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") {
        return;
      }

      if (!hoveredSurface) {
        return;
      }

      if (!(event.target instanceof Node) || !hoveredSurface.contains(event.target)) {
        return;
      }

      setWaveOrigin(hoveredSurface, event.clientX, event.clientY);
    }

    function handlePointerOut(event: PointerEvent) {
      if (event.pointerType === "touch") {
        return;
      }

      const surface = findSurface(event.target);
      const relatedSurface = findSurface(event.relatedTarget);

      if (!surface || surface === relatedSurface) {
        return;
      }

      if (hoveredSurface === surface) {
        setHoveredSurface(null);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const surface = findSurface(event.target);

      if (!surface) {
        return;
      }

      markSurface(surface);
      setWaveOrigin(surface, event.clientX, event.clientY);
      surface.classList.add("surface-wave-press");

      const existingTimer = pressTimers.get(surface);
      if (existingTimer !== undefined) {
        window.clearTimeout(existingTimer);
      }

      const releaseTimer = window.setTimeout(() => {
        surface.classList.remove("surface-wave-press");
        pressTimers.delete(surface);
      }, 460);

      pressTimers.set(surface, releaseTimer);
    }

    function handlePointerCancel(event: PointerEvent) {
      const surface = findSurface(event.target);

      if (surface) {
        clearPress(surface);
      }
    }

    function handleFocusIn(event: FocusEvent) {
      const surface = findSurface(event.target);

      if (!surface) {
        return;
      }

      markSurface(surface);
      setWaveOrigin(surface);
      surface.classList.add("surface-wave-hover");
    }

    function handleFocusOut(event: FocusEvent) {
      const surface = findSurface(event.target);

      if (surface) {
        surface.classList.remove("surface-wave-hover");
      }
    }

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("pointerout", handlePointerOut, true);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointercancel", handlePointerCancel, true);
    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("focusout", handleFocusOut, true);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointercancel", handlePointerCancel, true);
      document.removeEventListener("focusin", handleFocusIn, true);
      document.removeEventListener("focusout", handleFocusOut, true);

      pressTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  return null;
}
