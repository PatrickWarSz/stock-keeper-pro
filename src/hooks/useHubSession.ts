import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  HUB_BASE_URL,
  hubLoginUrl,
  APP_SLUG,
  getActiveUnitId,
} from "@/lib/hub";

export type EffectiveStatus = "active" | "trial" | "blocked" | "unknown";

export interface HubSessionState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  fullName: string | null;
  effectiveStatus: EffectiveStatus;
  trialDaysLeft: number | null;
  unitId: string | null;
}

const PROGRAM_LANDING_URL = `${HUB_BASE_URL}/programas/${APP_SLUG}`;

/**
 * Porteiro de toda rota /app/*.
 *
 * 1. Sem credenciais Supabase configuradas → manda pro login do Hub.
 * 2. Sem sessão Supabase ativa → manda pro login do Hub (com redirect de volta).
 * 3. Com sessão mas sem entitlement no Estoque Pro → manda pra landing
 *    do programa no Hub pra contratar/ativar trial.
 * 4. Com sessão + entitlement (active|trial) → libera, expõe estado.
 *
 * Reage a logout em outras abas via onAuthStateChange.
 */
export function useHubSession(): HubSessionState {
  const [state, setState] = useState<HubSessionState>({
    loading: true,
    session: null,
    user: null,
    fullName: null,
    effectiveStatus: "unknown",
    trialDaysLeft: null,
    unitId: null,
  });

  useEffect(() => {
    let cancelled = false;

    const goToHubLogin = () => {
      if (typeof window !== "undefined") {
        window.location.href = hubLoginUrl();
      }
    };

    const goToProgramLanding = () => {
      if (typeof window !== "undefined") {
        window.location.href = PROGRAM_LANDING_URL;
      }
    };

    if (!isSupabaseConfigured) {
      goToHubLogin();
      return;
    }

    async function bootstrap(session: Session | null) {
      if (cancelled) return;

      if (!session) {
        goToHubLogin();
        return;
      }

      // Busca perfil + entitlement em paralelo.
      const [profileRes, accessRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle(),
        supabase
          .from("v_module_access_effective")
          .select("effective_status, trial_days_left")
          .eq("module_id", APP_SLUG)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      const fullName =
        (profileRes.data as { full_name?: string | null } | null)?.full_name ??
        null;

      const access = accessRes.data as
        | {
            effective_status?: string | null;
            trial_days_left?: number | null;
          }
        | null;

      const rawStatus = access?.effective_status;
      const effectiveStatus: EffectiveStatus =
        rawStatus === "active" || rawStatus === "trial" || rawStatus === "blocked"
          ? rawStatus
          : "unknown";

      if (effectiveStatus !== "active" && effectiveStatus !== "trial") {
        goToProgramLanding();
        return;
      }

      setState({
        loading: false,
        session,
        user: session.user,
        fullName,
        effectiveStatus,
        trialDaysLeft:
          effectiveStatus === "trial" ? access?.trial_days_left ?? null : null,
        unitId: getActiveUnitId(),
      });
    }

    supabase.auth.getSession().then(({ data }) => {
      bootstrap(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        goToHubLogin();
        return;
      }
      bootstrap(session);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

/** Logout: encerra sessão local e devolve o usuário pro Hub. */
export async function signOutToHub() {
  try {
    await supabase.auth.signOut();
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = HUB_BASE_URL;
    }
  }
}
