import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const ITEM_TYPES = ['note', 'pyq', 'link'];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { itemId: true, itemType: true },
  });

  return NextResponse.json({ success: true, favorites });
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, itemId, itemType } = await req.json();

  if (!action || !itemId || !itemType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!['add', 'remove'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  if (!ITEM_TYPES.includes(itemType)) {
    return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
  }

  const where = {
    userId_itemId_itemType: { userId: session.user.id, itemId, itemType },
  };

  if (action === 'add') {
    await prisma.favorite.upsert({
      where,
      create: { userId: session.user.id, itemId, itemType },
      update: {},
    });
  } else {
    await prisma.favorite.deleteMany({
      where: { userId: session.user.id, itemId, itemType },
    });
  }

  return NextResponse.json({ success: true, isFavorited: action === 'add' });
}
