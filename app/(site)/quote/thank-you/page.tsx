import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings, whatsappLink } from "@/lib/data";
import { getCheckoutStatus } from "@/lib/stripe";
import { sendPaymentReceivedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment received",
  robots: { index: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; session_id?: string }>;
}) {
  const { id, session_id } = await searchParams;
  const settings = await getSettings();

  let paid = false;
  let enquiry: {
    id: string;
    name: string;
    quotePrice: string;
    paidAt: Date | null;
    status: string;
  } | null = null;

  if (id) {
    enquiry = await prisma.enquiry.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        quotePrice: true,
        paidAt: true,
        status: true,
      },
    });
  }

  if (session_id && enquiry) {
    const status = await getCheckoutStatus(session_id);
    if (status === "paid") {
      paid = true;
      if (!enquiry.paidAt) {
        await prisma.enquiry.update({
          where: { id: enquiry.id },
          data: {
            paidAt: new Date(),
            stripeSessionId: session_id,
            status: enquiry.status === "closed" ? "closed" : "booked",
          },
        });
        await sendPaymentReceivedEmail({
          name: enquiry.name,
          ref: `ZA-${enquiry.id.slice(-6).toUpperCase()}`,
          price: enquiry.quotePrice,
          enquiryId: enquiry.id,
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-mint text-3xl">
        {paid ? "✅" : "🎉"}
      </span>
      <h1 className="font-display mt-6 text-3xl font-extrabold text-navy md:text-4xl">
        {paid ? "Payment received — thank you!" : "Thank you!"}
      </h1>
      <p className="mt-4 leading-7 text-slate-600">
        {paid
          ? `Your payment of ${enquiry?.quotePrice || "the quote"} has been received. We will be in touch shortly to arrange your clean. A receipt is on its way from Stripe.`
          : "We have received your request and will be in touch shortly to arrange everything."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-navy">
          Back to home
        </Link>
        <a
          href={whatsappLink(
            settings,
            "Hello ZA Cleaning, I have a question about my quote."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Message us on WhatsApp
        </a>
      </div>

      <p className="mt-8 text-sm font-semibold text-mint-dark">
        {settings.responseTime}
      </p>
    </div>
  );
}
