import Image from "next/image";
import Link from "next/link";

export type ServiceCardData = {
  slug: string;
  name: string;
  summary: string;
  priceLabel: string;
  priceNote?: string;
  image?: string;
};

export default function ServiceCard({
  service,
}: {
  service: ServiceCardData;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {service.image ? (
        <div className="relative h-44 w-full overflow-hidden bg-mint-soft">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-mint-soft text-4xl">
          ✨
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
          {service.summary}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="rounded-full bg-mint-soft px-3 py-1.5 text-sm font-bold text-navy">
            {service.priceLabel}
            {service.priceNote ? (
              <span className="ml-1 font-medium text-navy/70">
                · {service.priceNote}
              </span>
            ) : null}
          </p>
          <Link
            href={`/quote?service=${encodeURIComponent(service.slug)}`}
            className="text-sm font-bold text-navy underline decoration-mint decoration-2 underline-offset-4 hover:text-navy-light"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </article>
  );
}
