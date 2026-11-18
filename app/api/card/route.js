import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL);
  const cards = await sql`SELECT * FROM cards LIMIT 1`;
  const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10`;
  return NextResponse.json({ card: cards[0], transactions });
}

export async function POST(request) {
  const sql = neon(process.env.DATABASE_URL);
  const body = await request.json();

  if (body.action === 'toggle_freeze') {
    await sql`UPDATE cards SET is_frozen = NOT is_frozen WHERE id = 1`;
  } else if (body.action === 'orange_deposit') {
    const amount = parseFloat(body.amount);
    await sql`UPDATE cards SET balance = balance + ${amount} WHERE id = 1`;
    await sql`INSERT INTO transactions (type, amount, phone_or_ref, status) VALUES ('شحن Orange Money', ${amount}, ${body.ref}, 'مكتمل')`;
  } else if (body.action === 'orange_withdraw') {
    const amount = parseFloat(body.amount);
    await sql`UPDATE cards SET balance = balance - ${amount} WHERE id = 1`;
    await sql`INSERT INTO transactions (type, amount, phone_or_ref, status) VALUES ('سحب إلى Orange Money', ${amount}, ${body.ref}, 'مكتمل')`;
  }

  return NextResponse.json({ success: true });
}
