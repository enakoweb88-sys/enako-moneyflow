import { createClient, type Session } from "@supabase/supabase-js";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email?: string;
    fullName?: string;
    phone?: string;
    avatarId?: number;
  };
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "Customer authentication is not configured for this environment.",
  );
}

export const supabase = createClient(url, publishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

const toAuthSession = (session: Session): AuthSession => ({
  accessToken: session.access_token,
  refreshToken: session.refresh_token,
  expiresAt:
    (session.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000,
  user: {
    id: session.user.id,
    email: session.user.email,
    fullName: String(session.user.user_metadata.full_name || ""),
    phone: String(session.user.user_metadata.phone || ""),
    avatarId: Number(session.user.user_metadata.avatar_id || 0),
  },
});

export const restoreSession = async (): Promise<AuthSession | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) return null;

  // Validate the stored access token with Supabase before treating it as active.
  const { error: userError } = await supabase.auth.getUser();
  if (userError) {
    await supabase.auth.signOut({ scope: "local" });
    return null;
  }

  return toAuthSession(data.session);
};

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  if (!data.session) throw new Error("No active session was returned.");
  return toAuthSession(data.session);
};

export const signUpWithPassword = async (
  email: string,
  password: string,
  profile: { fullName: string; phone: string },
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        full_name: profile.fullName,
        phone: profile.phone,
      },
    },
  });
  if (error) throw error;
  return data.session ? toAuthSession(data.session) : null;
};

export const resendConfirmationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
};

export const requestPasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
};

export const signOutSession = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateAuthProfile = async (profile: {
  fullName: string;
  phone: string;
  avatarId: number;
}) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: profile.fullName,
      phone: profile.phone,
      avatar_id: profile.avatarId,
    },
  });
  if (error) throw error;
};
