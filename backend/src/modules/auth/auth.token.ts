import { createHmac, timingSafeEqual } from 'crypto';

export type AuthUser = { id: string; name: string; username: string; role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' };
type TokenPayload = AuthUser & { exp: number };

const secret = process.env.AUTH_SECRET || 'farmatech-local-change-this-secret';

function encode(value: string) { return Buffer.from(value).toString('base64url'); }
function sign(value: string) { return createHmac('sha256', secret).update(value).digest('base64url'); }

export function createAccessToken(user: AuthUser) {
  const payload: TokenPayload = { ...user, exp: Date.now() + 8 * 60 * 60 * 1000 };
  const content = encode(JSON.stringify(payload));
  return `${content}.${sign(content)}`;
}

export function verifyAccessToken(token: string): AuthUser | null {
  const [content, signature] = token.split('.');
  if (!content || !signature) return null;
  const expectedSignature = sign(content);
  if (signature.length !== expectedSignature.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  try {
    const payload = JSON.parse(Buffer.from(content, 'base64url').toString()) as TokenPayload;
    if (!payload.id || !payload.username || !payload.role || payload.exp < Date.now()) return null;
    return { id: payload.id, name: payload.name, username: payload.username, role: payload.role };
  } catch { return null; }
}
