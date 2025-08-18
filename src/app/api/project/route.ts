/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { user: null, message: "Unauthorized", success: false },
        { status: 403 }
      );
    }

    const values = await req.json();
    if (!values.domain || !values.name || !values.description) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }





  } catch (error: any) {
    console.error("Error creating project", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 403 }
      );
    }



  } catch (error) {
    console.error("Error fetching projects", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
