/**
 * @packageDocumentation
 * Client-side interaction enhancements for the Docusaurus site.
 */

type CleanupFunction = () => void;

interface CleanupRef {
    current: CleanupFunction | null;
}

declare global {
    interface Window {
        initializeAdvancedFeatures?: typeof initializeAdvancedFeatures;
    }
}

const ROUTE_REFRESH_DELAY_MS = 100;
const INITIAL_HYDRATION_DELAY_MS = 0;
const SIDEBAR_TOKENIZED_DATA_KEY = "sbTokenized";

const runtimeSidebarKindPrefixes = [
    "Accessor:",
    "Class:",
    "Enum:",
    "Function:",
    "Interface:",
    "Method:",
    "Namespace:",
    "Property:",
    "Type:",
    "Type Alias:",
    "Variable:",
] as const;

interface SidebarLabelMutation {
    element: HTMLAnchorElement;
    originalLabel: string;
}

function applySidebarLabelTokenColoring(): CleanupFunction {
    const mutations: SidebarLabelMutation[] = [];

    const processLinks = (sidebarLinks: readonly HTMLAnchorElement[]): void => {
        for (const link of sidebarLinks) {
            if (isSidebarLinkTokenized(link)) continue;

            const linkLabel = link.textContent.trim();
            if (!linkLabel) continue;

            const runtimePrefix = getRuntimeSidebarKindPrefix(linkLabel);
            if (runtimePrefix !== null) {
                const remainderText = linkLabel
                    .slice(runtimePrefix.length)
                    .trimStart();
                if (remainderText.length > 0) {
                    mutations.push({ element: link, originalLabel: linkLabel });
                    setSidebarLeadingToken({
                        link,
                        remainderText,
                        separator: "",
                        tokenClassName: "sb-inline-runtime-kind",
                        tokenText: `${runtimePrefix}\u00A0`,
                    });
                }
                continue;
            }

            const ruleNumberPrefix = getRuleNumberPrefix(linkLabel);
            if (ruleNumberPrefix !== null) {
                mutations.push({ element: link, originalLabel: linkLabel });
                setSidebarLeadingToken({
                    link,
                    remainderText: ruleNumberPrefix.remainder,
                    tokenClassName: "sb-inline-rule-number",
                    tokenText: ruleNumberPrefix.numberToken,
                });
            }
        }
    };

    const processSidebarMenuLinks = (): void => {
        const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(
            ".theme-doc-sidebar-menu .menu__link"
        );
        processLinks([...sidebarLinks]);
    };

    processSidebarMenuLinks();

    const sidebarMenu = document.querySelector<HTMLElement>(
        ".theme-doc-sidebar-menu"
    );
    let sidebarRefreshTimer: null | ReturnType<typeof setTimeout> = null;

    const scheduleSidebarRefresh = (): void => {
        if (sidebarRefreshTimer) clearTimeout(sidebarRefreshTimer);

        sidebarRefreshTimer = setTimeout(() => {
            processSidebarMenuLinks();
            sidebarRefreshTimer = null;
        }, 0);
    };

    const sidebarObserver =
        sidebarMenu === null
            ? null
            : new MutationObserver(() => {
                  scheduleSidebarRefresh();
              });

    sidebarObserver?.observe(sidebarMenu ?? document.body, {
        childList: true,
        subtree: true,
    });

    return (): void => {
        sidebarObserver?.disconnect();
        if (sidebarRefreshTimer) clearTimeout(sidebarRefreshTimer);

        for (const mutation of mutations) {
            if (!mutation.element.isConnected) continue;
            mutation.element.dataset[SIDEBAR_TOKENIZED_DATA_KEY] = "";
            mutation.element.textContent = mutation.originalLabel;
        }
    };
}

function applyThemeToggleAnimation(): CleanupFunction {
    const themeToggle = document.querySelector(
        '[aria-label*="color mode"], [title*="Switch"]'
    );

    if (!(themeToggle instanceof HTMLElement)) {
        return (): void => {};
    }

    let animationTimer: null | ReturnType<typeof setTimeout> = null;
    const handleClick = (): void => {
        themeToggle.style.transform = "scale(0.94)";
        themeToggle.style.transition = "transform 120ms ease";

        if (animationTimer) clearTimeout(animationTimer);
        animationTimer = setTimeout(() => {
            themeToggle.style.transform = "scale(1)";
            animationTimer = null;
        }, 90);
    };

    const controller = new AbortController();
    themeToggle.addEventListener("click", handleClick, {
        signal: controller.signal,
    });

    return (): void => {
        if (animationTimer) clearTimeout(animationTimer);
        controller.abort();
    };
}

function createScrollIndicator(): CleanupFunction {
    const indicator = document.createElement("div");
    indicator.className = "scroll-indicator";
    indicator.style.cssText = [
        "position: fixed",
        "inset-block-start: 0",
        "inset-inline-start: 0",
        "z-index: 9999",
        "height: 3px",
        "width: 0%",
        "background: linear-gradient(90deg, var(--ifm-color-primary), var(--ifm-color-primary-light))",
        "pointer-events: none",
        "transition: width 80ms linear",
    ].join(";");

    document.body.append(indicator);

    const update = (): void => {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / Math.max(documentHeight, 1)) * 100;
        indicator.style.width = `${Math.max(0, Math.min(100, scrollPercent))}%`;
    };

    const controller = new AbortController();
    window.addEventListener("scroll", update, {
        passive: true,
        signal: controller.signal,
    });
    update();

    return (): void => {
        controller.abort();
        indicator.remove();
    };
}

function getRuleNumberPrefix(
    label: string
): null | Readonly<{ numberToken: string; remainder: string }> {
    const match = /^(?<numberToken>\d{2,3}) (?<remainder>.+)$/u.exec(label);
    const { numberToken, remainder } = match?.groups ?? {};
    return numberToken === undefined || remainder === undefined
        ? null
        : { numberToken, remainder };
}

function getRuntimeSidebarKindPrefix(
    label: string
): (typeof runtimeSidebarKindPrefixes)[number] | null {
    for (const prefix of runtimeSidebarKindPrefixes) {
        if (label.startsWith(`${prefix} `)) return prefix;
    }
    return null;
}

function initializeAdvancedFeatures(): CleanupFunction {
    const prefersReducedMotion = globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const cleanupFunctions = prefersReducedMotion
        ? [createScrollIndicator(), applySidebarLabelTokenColoring()]
        : [
              createScrollIndicator(),
              applySidebarLabelTokenColoring(),
              applyThemeToggleAnimation(),
          ];

    return (): void => {
        for (const cleanup of cleanupFunctions) cleanup();
    };
}

function initializeEnhancements(): CleanupFunction {
    const cleanupRef: CleanupRef = { current: null };
    let initialSetupFrame: null | number = null;
    let initialSetupTimer: null | ReturnType<typeof setTimeout> = null;
    let routeChangeTimer: null | ReturnType<typeof setTimeout> = null;
    let previousPathname = location.pathname;

    const setupEnhancements = (): void => {
        cleanupRef.current?.();
        cleanupRef.current = initializeAdvancedFeatures();
    };

    const cancelInitialSetup = (): void => {
        if (initialSetupFrame !== null)
            globalThis.cancelAnimationFrame(initialSetupFrame);
        if (initialSetupTimer !== null) clearTimeout(initialSetupTimer);
        initialSetupFrame = null;
        initialSetupTimer = null;
    };

    const scheduleInitialSetup = (): void => {
        cancelInitialSetup();
        initialSetupFrame = globalThis.requestAnimationFrame(() => {
            initialSetupFrame = null;
            initialSetupTimer = setTimeout(() => {
                initialSetupTimer = null;
                setupEnhancements();
            }, INITIAL_HYDRATION_DELAY_MS);
        });
    };

    if (document.readyState === "complete") scheduleInitialSetup();
    else window.addEventListener("load", scheduleInitialSetup, { once: true });

    const observer = new MutationObserver(() => {
        if (location.pathname === previousPathname) return;
        previousPathname = location.pathname;
        if (routeChangeTimer) clearTimeout(routeChangeTimer);
        routeChangeTimer = setTimeout(() => {
            setupEnhancements();
            routeChangeTimer = null;
        }, ROUTE_REFRESH_DELAY_MS);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return (): void => {
        window.removeEventListener("load", scheduleInitialSetup);
        cancelInitialSetup();
        cleanupRef.current?.();
        if (routeChangeTimer) clearTimeout(routeChangeTimer);
        observer.disconnect();
    };
}

function isSidebarLinkTokenized(link: HTMLAnchorElement): boolean {
    const tokenizedValue = link.dataset[SIDEBAR_TOKENIZED_DATA_KEY];
    return tokenizedValue !== undefined && tokenizedValue.length > 0;
}

function setSidebarLeadingToken(
    options: Readonly<{
        link: HTMLAnchorElement;
        remainderText: string;
        separator?: string;
        tokenClassName: string;
        tokenText: string;
    }>
): void {
    const {
        link,
        remainderText,
        separator = " ",
        tokenClassName,
        tokenText,
    } = options;
    const token = document.createElement("span");

    token.className = tokenClassName;
    token.textContent = tokenText;
    link.dataset[SIDEBAR_TOKENIZED_DATA_KEY] = tokenClassName;
    link.replaceChildren(
        token,
        document.createTextNode(`${separator}${remainderText}`)
    );
}

if (typeof document !== "undefined") {
    initializeEnhancements();
    globalThis.window.initializeAdvancedFeatures = initializeAdvancedFeatures;
}

export { initializeAdvancedFeatures, initializeEnhancements };
export default initializeEnhancements;
