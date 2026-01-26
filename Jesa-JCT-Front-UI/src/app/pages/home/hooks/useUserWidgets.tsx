import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useAuth } from "../../../modules/auth";

export const WIDGET_IDS = [
  "myActions",
  "supportRequest",
  "alertsByType",
  "alertsByCategory",
  "applications",
  "reality",
] as const;

export type WidgetId = (typeof WIDGET_IDS)[number];

export interface UserWidgetsState {
  myActions: boolean;
  supportRequest: boolean;
  alertsByType: boolean;
  alertsByCategory: boolean;
  applications: boolean;
  reality: boolean;
}

export interface UserWidgetsStorage {
  visibility: UserWidgetsState;
  order: WidgetId[];
}

const DEFAULT_WIDGETS: UserWidgetsState = {
  myActions: true,
  supportRequest: true,
  alertsByType: true,
  alertsByCategory: true,
  applications: true,
  reality: true,
};

const DEFAULT_ORDER: WidgetId[] = [
  "myActions",
  "supportRequest",
  "applications",
  "alertsByType",
  "alertsByCategory",
  "reality",
];

const STORAGE_KEY_PREFIX = "user_widgets_";
const ORDER_STORAGE_KEY_PREFIX = "user_widgets_order_";

function getStorageKey(
  userId: string | number | undefined,
  email?: string
): string {
  if (userId !== undefined && userId !== null && String(userId)) {
    return `${STORAGE_KEY_PREFIX}${userId}`;
  }
  if (email) return `${STORAGE_KEY_PREFIX}${email}`;
  return `${STORAGE_KEY_PREFIX}guest`;
}

function getOrderStorageKey(
  userId: string | number | undefined,
  email?: string
): string {
  if (userId !== undefined && userId !== null && String(userId)) {
    return `${ORDER_STORAGE_KEY_PREFIX}${userId}`;
  }
  if (email) return `${ORDER_STORAGE_KEY_PREFIX}${email}`;
  return `${ORDER_STORAGE_KEY_PREFIX}guest`;
}

function loadWidgets(key: string): UserWidgetsState {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...DEFAULT_WIDGETS };
    const parsed = JSON.parse(raw) as Partial<UserWidgetsState>;
    return { ...DEFAULT_WIDGETS, ...parsed };
  } catch {
    return { ...DEFAULT_WIDGETS };
  }
}

function loadWidgetOrder(key: string): WidgetId[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [...DEFAULT_ORDER];
    const parsed = JSON.parse(raw) as WidgetId[];
    // Validate that all widgets are present
    const validOrder = parsed.filter((id) => WIDGET_IDS.includes(id));
    const missing = WIDGET_IDS.filter((id) => !validOrder.includes(id));
    return [...validOrder, ...missing];
  } catch {
    return [...DEFAULT_ORDER];
  }
}

function saveWidgets(key: string, state: UserWidgetsState): void {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function saveWidgetOrder(key: string, order: WidgetId[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

type UserWidgetsContextValue = {
  visibleWidgets: UserWidgetsState;
  widgetOrder: WidgetId[];
  setWidgetVisible: (id: WidgetId, visible: boolean) => void;
  toggleWidget: (id: WidgetId) => void;
  isVisible: (id: WidgetId) => boolean;
  reorderWidgets: (newOrder: WidgetId[]) => void;
  moveWidget: (fromIndex: number, toIndex: number) => void;
};

const UserWidgetsContext = createContext<UserWidgetsContextValue | null>(null);

export const UserWidgetsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const storageKey = useMemo(
    () =>
      getStorageKey(
        currentUser?.UserId ?? (currentUser?.id as number | undefined),
        currentUser?.email
      ),
    [currentUser?.UserId, currentUser?.id, currentUser?.email]
  );

  const orderStorageKey = useMemo(
    () =>
      getOrderStorageKey(
        currentUser?.UserId ?? (currentUser?.id as number | undefined),
        currentUser?.email
      ),
    [currentUser?.UserId, currentUser?.id, currentUser?.email]
  );

  const [widgets, setWidgets] = useState<UserWidgetsState>(() =>
    loadWidgets(storageKey)
  );

  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() =>
    loadWidgetOrder(orderStorageKey)
  );

  useEffect(() => {
    setWidgets(loadWidgets(storageKey));
    setWidgetOrder(loadWidgetOrder(orderStorageKey));
  }, [storageKey, orderStorageKey]);

  const setWidgetVisible = useCallback(
    (id: WidgetId, visible: boolean) => {
      setWidgets((prev) => {
        const next = { ...prev, [id]: visible };
        saveWidgets(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const toggleWidget = useCallback(
    (id: WidgetId) => {
      setWidgets((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        saveWidgets(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const isVisible = useCallback(
    (id: WidgetId) => widgets[id],
    [widgets]
  );

  const reorderWidgets = useCallback(
    (newOrder: WidgetId[]) => {
      setWidgetOrder(newOrder);
      saveWidgetOrder(orderStorageKey, newOrder);
    },
    [orderStorageKey]
  );

  const moveWidget = useCallback(
    (fromIndex: number, toIndex: number) => {
      setWidgetOrder((prev) => {
        const newOrder = [...prev];
        const [moved] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, moved);
        saveWidgetOrder(orderStorageKey, newOrder);
        return newOrder;
      });
    },
    [orderStorageKey]
  );

  const value = useMemo(
    () => ({
      visibleWidgets: widgets,
      widgetOrder,
      setWidgetVisible,
      toggleWidget,
      isVisible,
      reorderWidgets,
      moveWidget,
    }),
    [widgets, widgetOrder, setWidgetVisible, toggleWidget, isVisible, reorderWidgets, moveWidget]
  );

  return (
    <UserWidgetsContext.Provider value={value}>
      {children}
    </UserWidgetsContext.Provider>
  );
};

export function useUserWidgets(): UserWidgetsContextValue {
  const ctx = useContext(UserWidgetsContext);
  if (!ctx) {
    throw new Error("useUserWidgets must be used within UserWidgetsProvider");
  }
  return ctx;
}
