import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // Save to Supabase
  const { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({ name, email, message });

  if (dbError) {
    console.error("Supabase insert error:", dbError.message);
    return NextResponse.json({ error: "Failed to save message." }, { status: 500 });
  }

  // Send email notification
  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.NOTIFY_EMAIL ?? "anujswork1@gmail.com",
      subject: `New message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });
  }

  return NextResponse.json({ ok: true });
}
