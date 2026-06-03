import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const banner = await prisma.banner.findUnique({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json(banner);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const banner = await prisma.banner.update({
    where: {
      id: Number(id),
    },
    data: body,
  });

  return NextResponse.json(banner);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.banner.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    message: "Deleted Successfully",
  });
}