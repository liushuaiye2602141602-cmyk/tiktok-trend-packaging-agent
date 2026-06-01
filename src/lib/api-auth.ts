import { NextRequest } from 'next/server';

export function checkApiAuth(req: NextRequest): { authorized: boolean; error?: string } {
  const token = process.env.API_AUTH_TOKEN;
  if (!token) return { authorized: true };

  const authHeader = req.headers.get('authorization');
  const apiKeyHeader = req.headers.get('x-api-key');

  if (authHeader === `Bearer ${token}`) return { authorized: true };
  if (apiKeyHeader === token) return { authorized: true };

  return { authorized: false, error: 'Invalid or missing API token' };
}

export function apiSuccess(data: unknown, message = 'ok') {
  return { success: true, data, message };
}

export function apiError(code: string, message: string, status = 400) {
  return Response.json({ success: false, error: { code, message } }, { status });
}
