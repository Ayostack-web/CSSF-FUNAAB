import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ACCOUNT_FILE = path.resolve(process.cwd(), 'account-number.json');

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
    const { accountName = '', accountNumber = '', bank = '' } = await request.json();
    await fs.writeFile(ACCOUNT_FILE, JSON.stringify({ accountName, accountNumber, bank }), 'utf-8');
    return NextResponse.json({ success: true, accountName, accountNumber, bank });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message });
  }
}