import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  const body = await req.json();

  const banner = await prisma.banner.create({
    data: {
      title: body.title,
      subtitle: body.subtitle,
      image: body.image,
      buttonText: body.buttonText,
      buttonLink: body.buttonLink,
    },
  });

  return NextResponse.json(banner);
}