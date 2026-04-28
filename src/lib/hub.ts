/**
 * Configuração central do Hub Nexus Grid.
 *
 * Estoque Pro é um dos apps satélite do hub multi-tenant.
 * - Login/cadastro: SEMPRE acontece no hub.
 * - Compra/checkout: SEMPRE acontece no hub.
 * - Após autenticar, o hub redireciona o usuário de volta pro workspace
 *   (ou direto pra `/app/estoque` deste projeto, conforme contrato com o hub).
 *
 * Para trocar o domínio do hub no futuro (ex: comprar nexusgrid.com.br),
 * basta alterar HUB_BASE_URL aqui.
 */

export const HUB_NAME = "Nexus Grid";
export const HUB_TAGLINE = "Hub de operações para o seu negócio";

export const HUB_BASE_URL = "https://hubnexusgrid.lovable.app";

/** Identificador deste app dentro do hub (usado em querystring). */
export const APP_SLUG = "estoque";
export const APP_NAME = "Estoque Pro";

/** Para onde o hub deve mandar o usuário depois do login bem-sucedido. */
const RETURN_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/app/estoque`
    : "/app/estoque";

/** URL da landing do hub (apresentação institucional). */
export const hubLandingUrl = () => HUB_BASE_URL;

/** URL de login no hub, com contexto deste app + redirect de retorno. */
export const hubLoginUrl = () => {
  const params = new URLSearchParams({
    app: APP_SLUG,
    redirect: RETURN_URL,
  });
  return `${HUB_BASE_URL}/login?${params.toString()}`;
};

/** URL de cadastro / início do trial deste app no hub. */
export const hubSignupUrl = (plan: string = "estoque-pro") => {
  const params = new URLSearchParams({
    app: APP_SLUG,
    plan,
    redirect: RETURN_URL,
  });
  return `${HUB_BASE_URL}/login?${params.toString()}`;
};

/** Página do app dentro do hub (catálogo / detalhe / compra). */
export const hubAppUrl = () => `${HUB_BASE_URL}/apps/${APP_SLUG}`;
