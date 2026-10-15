export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: { id: string; email?: string };
}

const storageKey = "enako.moneyflow.auth.session";

const config = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      "Customer authentication is not configured for this environment.",
    );
  }
  return { url: url.replace(/\/$/, ""), publishableKey };
};

const sessionFromResponse = (payload: Record<string, unknown>): AuthSession => {
  const accessToken = String(payload.access_token || "");
  const refreshToken = String(payload.refresh_token || "");
  const expiresIn = Number(payload.expires_in || 0);
  const user = payload.user as { id?: string; email?: string } | undefined;
  if (!accessToken || !refreshToken || !expiresIn || !user?.id)
    throw new Error("No active session was returned.");
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    user: { id: user.id, email: user.email },
  };
};

const request = async (path: string, body: unknown) => {
  const { url, publishableKey } = config();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: publishableKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!response.ok)
    throw new Error(
      String(
        payload.msg || payload.message || "Authentication request failed.",
      ),
    );
  return payload;
};

export const saveSession = (session: AuthSession) =>
  localStorage.setItem(storageKey, JSON.stringify(session));
export const clearSession = () => localStorage.removeItem(storageKey);

export const restoreSession = async (): Promise<AuthSession | null> => {
  const callbackParams = new URLSearchParams(window.location.hash.slice(1));
  const callbackAccessToken = callbackParams.get("access_token");
  const callbackRefreshToken = callbackParams.get("refresh_token");
  const callbackExpiresIn = Number(callbackParams.get("expires_in") || 0);
  if (callbackAccessToken && callbackRefreshToken && callbackExpiresIn) {
    const [, payload = ""] = callbackAccessToken.split(".");
    try {
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      ) as {
        sub?: string;
        email?: string;
      };
      if (decoded.sub) {
        const session = {
          accessToken: callbackAccessToken,
          refreshToken: callbackRefreshToken,
          expiresAt: Date.now() + callbackExpiresIn * 1000,
          user: { id: decoded.sub, email: decoded.email },
        };
        saveSession(session);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        return session;
      }
    } catch {
      // An invalid callback is treated as no session and will not be persisted.
    }
  }
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    if (session.expiresAt > Date.now() + 30_000) return session;
    const payload = await request("token?grant_type=refresh_token", {
      refresh_token: session.refreshToken,
    });
    const refreshed = sessionFromResponse(payload);
    saveSession(refreshed);
    return refreshed;
  } catch {
    clearSession();
    return null;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  const payload = await request("token?grant_type=password", {
    email,
    password,
  });
  const session = sessionFromResponse(payload);
  saveSession(session);
  return session;
};

export const signUpWithPassword = async (email: string, password: string) => {
  const payload = await request("signup", {
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (!payload.access_token) return null;
  const session = sessionFromResponse(payload);
  saveSession(session);
  return session;
};

export const resendConfirmationEmail = async (email: string) => {
  await request("resend", {
    type: "signup",
    email,
    options: { emailRedirectTo: window.location.origin },
  });
};
