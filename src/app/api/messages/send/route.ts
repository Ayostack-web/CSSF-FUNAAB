import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

let lastPrune = Date.now();
function prune() {
  const now = Date.now();
  if (now - lastPrune < 60 * 1000) return;
  lastPrune = now;
  for (const [ip, arr] of hits) {
    const alive = arr.filter((t) => now - t < WINDOW_MS);
    if (alive.length === 0) hits.delete(ip);
    else hits.set(ip, alive);
  }
}

function isRateLimited(ip: string): boolean {
  prune();
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for') || '';
    const ip = forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please try again later.' },
        { status: 429 }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, contact, body, honeypot } = (payload || {}) as {
      name?: unknown;
      contact?: unknown;
      body?: unknown;
      honeypot?: unknown;
    };

    if (typeof honeypot === 'string' && honeypot.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanContact = typeof contact === 'string' ? contact.trim() : '';
    const cleanBody = typeof body === 'string' ? body.trim() : '';

    if (
      cleanName.length < 1 ||
      cleanName.length > 80 ||
      cleanContact.length > 120 ||
      cleanBody.length < 1 ||
      cleanBody.length > 1000
    ) {
      return NextResponse.json({ error: 'Please check the message fields and try again.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase.from('messages').insert({
      name: cleanName,
      contact: cleanContact || null,
      body: cleanBody,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
