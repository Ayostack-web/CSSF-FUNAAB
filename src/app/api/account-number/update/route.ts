import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';

const ACCOUNT_FILE = path.resolve(process.cwd(), 'account-number.json');

async function requireAdmin(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return { ok: false as const, response: NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 }) };
  }

  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return { ok: false as const, response: NextResponse.json({ success: false, error: 'Unauthorized: missing access token' }, { status: 401 }) };
  }

  const authClient = createClient(supabaseUrl, anonKey);
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  const allowedAdminEmail = (
    process.env.ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    'ayokunleshittu@gmail.com'
  ).toLowerCase();
  const requesterEmail = authData.user?.email?.toLowerCase() || '';

  if (authError || !authData.user || requesterEmail !== allowedAdminEmail) {
    return { ok: false as const, response: NextResponse.json({ success: false, error: 'Forbidden: admin email required' }, { status: 403 }) };
  }

  return { ok: true as const };
}

export async function GET() {
  try {
    const data = await fs.readFile(ACCOUNT_FILE, 'utf-8');
    const { accountName = '', accountNumber = '', bank = '' } = JSON.parse(data);
    return NextResponse.json({ accountName, accountNumber, bank });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ accountName: '', accountNumber: '', bank: '', error: message });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitError = getRateLimitErrorResponse(request, 'api:account-number-update', 20, 60_000);
    if (rateLimitError) return rateLimitError;

    const authCheck = await requireAdmin(request);
    if (!authCheck.ok) return authCheck.response;

    const { accountName = '', accountNumber = '', bank = '' } = await request.json();
    await fs.writeFile(ACCOUNT_FILE, JSON.stringify({ accountName, accountNumber, bank }), 'utf-8');
    return NextResponse.json({ success: true, accountName, accountNumber, bank });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message });
  }
}