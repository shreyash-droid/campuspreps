import { NextResponse } from 'next/server';

// In a real app, you'd connect to your database here
// For now, we'll simulate with in-memory storage
let favorites = new Map(); // userId -> Set of favorite items

export async function POST(req) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // In a real app, you'd verify the JWT token here
    // For demo purposes, we'll simulate a user ID
    const userId = 'user_' + token.slice(-10); // Simple simulation

    const { action, itemId, itemType } = await req.json();

    if (!action || !itemId || !itemType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!['note', 'pyq', 'link'].includes(itemType)) {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
    }

    // Get or create user favorites
    if (!favorites.has(userId)) {
      favorites.set(userId, new Set());
    }

    const userFavorites = favorites.get(userId);
    const favoriteKey = `${itemType}_${itemId}`;

    if (action === 'add') {
      userFavorites.add(favoriteKey);
    } else {
      userFavorites.delete(favoriteKey);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Item ${action}ed successfully`,
      isFavorited: action === 'add'
    });

  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json({ 
      error: 'Failed to update favorites' 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = 'user_' + token.slice(-10);

    const userFavorites = favorites.get(userId) || new Set();
    
    // Convert Set to Array and parse the favorites
    const favoritesList = Array.from(userFavorites).map(fav => {
      const [itemType, itemId] = fav.split('_');
      return { itemType, itemId };
    });

    return NextResponse.json({ 
      success: true, 
      favorites: favoritesList 
    });

  } catch (error) {
    console.error('Get favorites API error:', error);
    return NextResponse.json({ 
      error: 'Failed to get favorites' 
    }, { status: 500 });
  }
}