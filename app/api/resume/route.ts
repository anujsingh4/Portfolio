import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = "resume";
const FILE = "resume.pdf";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDF file required." }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE, buffer, { contentType: "application/pdf", upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(FILE);

  return NextResponse.json({ url: data.publicUrl });
}

export async function DELETE() {
  const { error } = await supabase.storage.from(BUCKET).remove([FILE]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
