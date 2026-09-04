/**
 * TypeScript definitions for dcs-ui
 */

export {};

declare global {
  /**
   * Component controller object registered with DCS.register()
   */
  interface DCSComponentController {
    init?: (el: HTMLElement) => void;
    [key: string]: any;
  }

  /**
   * Options for DCS.toast(message, options)
   */
  interface DCSToastOptions {
    type?: 'info' | 'success' | 'warning' | 'error' | 'danger' | string;
    duration?: number;
    position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | string;
    action?: {
      label: string;
      callback?: () => void;
    };
  }

  /**
   * Toast instance returned by DCS.toast()
   */
  interface DCSToastInstance {
    dismiss: () => void;
  }

  /**
   * Public DCS API surface exposed on window.DCS
   */
  interface DCSApi {
    /**
     * Registers a new component controller with the given name.
     */
    register(name: string, controller: DCSComponentController): void;

    /**
     * Initializes uninitialized DCS components within the given container (defaults to document).
     */
    _init(container?: Element | Document | null): void;

    /**
     * Returns an array of registered component names.
     */
    _registeredComponents(): string[];

    /**
     * Internal/helper method to show a quick toast notification.
     */
    _showToast(message: string, type?: string): void;

    /**
     * Returns an array of visible, focusable elements inside the given container.
     */
    _focusable(container: Element): HTMLElement[];

    /**
     * Traps focus within container. Returns a release function that restores focus.
     */
    _trapFocus(container: HTMLElement): () => void;

    /**
     * Displays a toast notification with configuration options.
     */
    toast?(message: string, options?: DCSToastOptions): DCSToastInstance;

    /**
     * Optional helper to update global status indicator.
     */
    updateGlobalStatus?(status: string, color?: string): void;

    /**
     * Optional helper to trigger a toast for button actions.
     */
    triggerButtonToast?(label: string, type?: string): void;

    [key: string]: any;
  }

  interface Window {
    DCS: DCSApi;
  }

  // ── Custom Event Map Extensions ──────────────────────────

  interface DCSTreeActivateDetail {
    item: HTMLElement;
    label: string;
  }

  interface DCSRadioChangeDetail {
    value: string;
    label: string;
    input: HTMLInputElement;
  }

  interface GlobalEventHandlersEventMap {
    'dcs-tree-activate': CustomEvent<DCSTreeActivateDetail>;
    'dcs-empty-retry': CustomEvent<void>;
    'dcs-radio-change': CustomEvent<DCSRadioChangeDetail>;
  }

  interface HTMLElementEventMap {
    'dcs-tree-activate': CustomEvent<DCSTreeActivateDetail>;
    'dcs-empty-retry': CustomEvent<void>;
    'dcs-radio-change': CustomEvent<DCSRadioChangeDetail>;
  }

  // ── Per-Component Options Interfaces ─────────────────────

  interface DCSAccordionOptions {
    mode?: 'single' | 'multiple';
  }

  interface DCSCarouselOptions {
    autoplay?: boolean | string;
    cardsVisible?: number | string;
  }

  interface DCSEmptyOptions {
    state?: 'error' | 'empty' | 'no-results' | string;
    retry?: boolean | string;
  }

  interface DCSModalOptions {
    id?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
    static?: boolean | string;
  }

  interface DCSProgressOptions {
    value?: number | string;
    max?: number | string;
    color?: string;
    size?: string;
    stroke?: number | string;
    label?: string;
    indeterminate?: boolean | string;
  }

  interface DCSRadioGroupOptions {
    name?: string;
  }

  interface DCSSparklineOptions {
    values?: string | number[];
    width?: number | string;
    height?: number | string;
    color?: string;
    trend?: number | string;
  }

  interface DCSStepperOptions {
    step?: number | string;
  }

  interface DCSTruncateOptions {
    lines?: number | string;
  }

  interface DCSDropdownOptions {
    label?: string;
  }

  interface DCSClipboardOptions {
    text?: string;
  }

  interface DCSContextMenuOptions {
    menuId?: string;
  }

  interface DCSSearchOptions {
    filter?: string;
  }

  interface DCSShortcutHintOptions {
    shortcut?: string;
  }

  interface DCSSplitPaneOptions {
    dense?: boolean;
  }

  interface DCSBreadcrumbsOptions {
    section?: string;
  }
}
