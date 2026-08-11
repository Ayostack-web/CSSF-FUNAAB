import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getRateLimitErrorResponse } from '@/lib/rate-limit';
import { requireAdmin, getSupabaseConfig } from '@/lib/admin';
import {
  validateAccountName,
  validateAccountNumber,
  validateBankName,
  sanitizeString,
} from '@/lib/validation';

const KEY_ACCOUNT_NAME = 'account_name';
const KEY_ACCOUNT_NUMBER = 'account_number';
const KEY_BANK = 'bank';

async function getSettingValue(supabase: SupabaseClient, key: string) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  return { value: data?.value || '', error };
}

async function upsertSettingValue(
  supabase: SupabaseClient,
  key: string,
  value: string
) {
  const { data: existing, error: existingError } = await supabase
    .from('site_settings')
    .select('id')
    .eq('key', key)
    .maybeSingle();

  if (existingError) return { error: existingError };

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('id', existing.id);

    return { error: updateError };
  }

  const { error: insertError } = await supabase
    .from('site_settings')
    .insert([{ key, value }]);

  return { error: insertError };
}

export async function GET() {
  try {
    const { supabaseUrl, serviceKey } = getSupabaseConfig();

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ accountName: '', accountNumber: '', bank: '', error: 'Server misconfigured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const [
      { value: accountName, error: nameError },
      { value: accountNumber, error: numberError },
      { value: bank, error: bankError },
    ] = await Promise.all([
      getSettingValue(supabase, KEY_ACCOUNT_NAME),
      getSettingValue(supabase, KEY_ACCOUNT_NUMBER),
      getSettingValue(supabase, KEY_BANK),
    ]);

    const error = nameError || numberError || bankError;
    if (error) {
      return NextResponse.json({ accountName: '', accountNumber: '', bank: '', error: error?.message || 'Failed to load settings' }, { status: 500 });
    }

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

    const body = await request.json();
    let { accountName = '', accountNumber = '', bank = '' } = body;

    // Sanitize inputs
    accountName = sanitizeString(accountName);
    accountNumber = sanitizeString(accountNumber);
    bank = sanitizeString(bank);

    // Validate inputs
    if (accountName && !validateAccountName(accountName)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account name format' },
        { status: 400 }
      );
    }

    if (accountNumber && !validateAccountNumber(accountNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account number format' },
        { status: 400 }
      );
    }

    if (bank && !validateBankName(bank)) {
      return NextResponse.json(
        { success: false, error: 'Invalid bank name format' },
        { status: 400 }
      );
    }

    const { supabaseUrl, serviceKey } = getSupabaseConfig();
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const results = await Promise.all([
      upsertSettingValue(supabase, KEY_ACCOUNT_NAME, accountName),
      upsertSettingValue(supabase, KEY_ACCOUNT_NUMBER, accountNumber),
      upsertSettingValue(supabase, KEY_BANK, bank),
    ]);

    const error = results.find((r) => r.error)?.error;
    if (error) {
      return NextResponse.json({ success: false, error: error.message || 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, accountName, accountNumber, bank });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
