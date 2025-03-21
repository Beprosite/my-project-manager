import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // בדיקת המשתמש בדאטהבייס
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // אם המשתמש לא נמצא או הסיסמה לא תואמת
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'שם משתמש או סיסמה שגויים' },
        { status: 401 }
      );
    }

    // יצירת אובייקט המשתמש לשמירה בקוקי (ללא הסיסמה)
    const userForCookie = {
      id: user.id,
      username: user.username,
      companyName: user.companyName
    };

    // החזרת תשובה חיובית עם פרטי המשתמש
    const response = NextResponse.json(
      { success: true, user: userForCookie },
      { status: 200 }
    );

    // הגדרת הקוקי
    response.cookies.set('user', JSON.stringify(userForCookie), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    });

    return response;

  } catch (error) {
    console.error('שגיאה בהתחברות:', error);
    return NextResponse.json(
      { error: 'שגיאת שרת פנימית' },
      { status: 500 }
    );
  }
}