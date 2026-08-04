import React, { useCallback, useEffect, useState } from "react";
import {
  FaBed,
  FaBath,
  FaCarSide,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaMoon,
  FaSignInAlt,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { TBD, perPerson, trip } from "./trip";
import type { Activity, Car, Day, Maybe, Photo } from "./trip";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const isTbd = (value: Maybe): boolean => value === TBD;

const Tbd: React.FC = () => (
  <span className="inline-block rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium tracking-wide text-stone-500">
    TBD
  </span>
);

const Section: React.FC<{
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tone?: "light" | "warm";
}> = ({ id, eyebrow, title, children, tone = "light" }) => (
  <section
    id={id}
    className={`w-full px-6 py-14 sm:py-20 ${tone === "warm" ? "bg-amber-50/60" : "bg-stone-50"}`}
  >
    <div className="mx-auto w-full max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl text-stone-900 sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

const Countdown: React.FC = () => {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const start = new Date(trip.dates.checkIn.date).getTime();
    const end = new Date(trip.dates.checkOut.date).getTime();
    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        setDays(-1);
      } else if (now >= start) {
        setDays(0);
      } else {
        setDays(Math.max(1, Math.round((start - now) / 86_400_000)));
      }
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (days === null) return null;

  const label =
    days === -1
      ? "That's a wrap"
      : days === 0
        ? "Happening now"
        : `${days} ${days === 1 ? "day" : "days"} out`;

  return (
    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
      {label}
    </span>
  );
};

const Hero: React.FC = () => (
  <header className="relative isolate flex min-h-[78vh] items-end overflow-hidden">
    <img
      src={trip.photos.hero}
      alt={`${trip.house.name}, seen from across the lake`}
      className="absolute inset-0 -z-10 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950/92 via-stone-950/55 to-stone-950/25" />

    <div className="mx-auto w-full max-w-4xl px-6 pb-14 pt-32 sm:pb-20">
      <div className="h-1 w-16 bg-amber-500" />
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
        {trip.title}
      </p>
      <h1 className="mt-3 font-display text-5xl leading-[1.05] text-white sm:text-7xl">
        {trip.house.name}
      </h1>
      <p className="mt-4 text-lg text-stone-200 sm:text-xl">
        Sep 4&ndash;7, 2026 &middot; Cleveland, GA
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Countdown />
        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          <FaMoon className="mr-2 h-3 w-3" aria-hidden="true" />
          {trip.dates.nights} nights
        </span>
      </div>
    </div>
  </header>
);

const StayCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  day: string;
  time: string;
}> = ({ icon, label, day, time }) => (
  <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-2 text-stone-500">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="mt-2 font-display text-3xl text-stone-900">{day}</p>
    <p className="mt-1 text-stone-600">{time}</p>
  </div>
);

const Stat: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({
  icon,
  value,
  label,
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
    <span className="text-amber-700" aria-hidden="true">
      {icon}
    </span>
    <span>
      <span className="font-semibold text-stone-900">{value}</span>{" "}
      <span className="text-sm text-stone-600">{label}</span>
    </span>
  </div>
);

const Basics: React.FC = () => (
  <Section id="basics" eyebrow="The basics" title="When and where">
    <div className="grid gap-4 sm:grid-cols-2">
      <StayCard
        icon={<FaSignInAlt className="h-4 w-4" aria-hidden="true" />}
        label="Check-in"
        day={trip.dates.checkIn.label}
        time={trip.dates.checkIn.time}
      />
      <StayCard
        icon={<FaSignOutAlt className="h-4 w-4" aria-hidden="true" />}
        label="Check-out"
        day={trip.dates.checkOut.label}
        time={trip.dates.checkOut.time}
      />
    </div>

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <Stat
        icon={<FaUsers className="h-4 w-4" />}
        value={String(trip.house.sleeps)}
        label="guests max"
      />
      <Stat
        icon={<FaBed className="h-4 w-4" />}
        value={String(trip.house.bedrooms)}
        label="bedrooms"
      />
      <Stat
        icon={<FaBath className="h-4 w-4" />}
        value={trip.house.bathrooms}
        label="baths"
      />
    </div>

    <p className="mt-6 text-stone-600">
      It's {trip.dates.note}, so Helen and the trailheads will be busier than
      usual. Worth factoring into anything that needs a reservation.
    </p>
  </Section>
);

const Lightbox: React.FC<{
  photos: Photo[];
  index: number;
  onClose: () => void;
  onStepTo: (i: number) => void;
}> = ({ photos, index, onClose, onStepTo }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStepTo((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onStepTo((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, photos.length, onClose, onStepTo]);

  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950/92 p-4"
      onClick={onClose}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="mt-4 text-center text-sm text-stone-300">{photo.alt}</p>
      <p className="mt-1 text-xs text-stone-500">
        {index + 1} of {photos.length} &middot; tap anywhere to close
      </p>
    </div>
  );
};

const House: React.FC = () => {
  const photos = trip.photos.gallery;
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const stepTo = useCallback((i: number) => setOpen(i), []);

  return (
    <Section id="house" eyebrow="The house" title={trip.house.name} tone="warm">
      <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
        A five-bedroom lodge on its own private 15-acre lake, about twelve miles
        outside Helen. Hot tub over the water, pool table downstairs, fire pit by
        the dock, and enough kitchen to feed everyone twice.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-4/3 overflow-hidden rounded-lg bg-stone-200"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={i < 3 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {trip.amenities.map((a) => (
          <li
            key={a}
            className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm text-stone-700"
          >
            {a}
          </li>
        ))}
      </ul>

      <a
        href={trip.house.listingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900"
      >
        See the full listing
        <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
      </a>

      {open !== null && (
        <Lightbox photos={photos} index={open} onClose={close} onStepTo={stepTo} />
      )}
    </Section>
  );
};

const GettingThere: React.FC = () => {
  const q = encodeURIComponent(trip.house.address);
  return (
    <Section id="getting-there" eyebrow="Getting there" title="294 Nora Lane">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt
            className="mt-1 h-5 w-5 shrink-0 text-amber-700"
            aria-hidden="true"
          />
          <div>
            <p className="text-lg font-medium text-stone-900">
              {trip.house.address}
            </p>
            <p className="mt-1 text-stone-600">
              Roughly 1 hour 45 minutes from Atlanta. Paved road the whole way in.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`https://maps.apple.com/?q=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Apple Maps
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100"
          >
            Google Maps
          </a>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-100/70 p-5">
        <p className="flex items-start gap-3 text-stone-800">
          <FaCarSide className="mt-1 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
          <span>
            <strong className="font-semibold">
              {trip.maxVehicles} vehicles max in the driveway.
            </strong>{" "}
            The garage isn't available and there's no overflow parking, so we
            genuinely have to carpool. No trailers, RVs, or motorcycles.
          </span>
        </p>
      </div>
    </Section>
  );
};

const CarCard: React.FC<{ car: Car; n: number }> = ({ car, n }) => (
  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">
      Car {n}
    </p>
    <p className="mt-2 font-display text-2xl text-stone-900">
      {isTbd(car.driver) ? <Tbd /> : car.driver}
    </p>
    <dl className="mt-4 space-y-2 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-stone-500">Leaving from</dt>
        <dd className="text-right text-stone-800">
          {isTbd(car.leavingFrom) ? <Tbd /> : car.leavingFrom}
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-stone-500">Leaving at</dt>
        <dd className="text-right text-stone-800">
          {isTbd(car.leavingAt) ? <Tbd /> : car.leavingAt}
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-stone-500">Seats open</dt>
        <dd className="text-right text-stone-800">
          {car.seatsOpen === null ? <Tbd /> : car.seatsOpen}
        </dd>
      </div>
    </dl>
    {car.riders.length > 0 && (
      <p className="mt-4 border-t border-stone-100 pt-3 text-sm text-stone-600">
        {car.riders.join(", ")}
      </p>
    )}
  </div>
);

const Carpool: React.FC = () => (
  <Section id="carpool" eyebrow="Carpool" title="Who's driving" tone="warm">
    <p className="max-w-2xl text-stone-700">
      Still being sorted. If you can drive, or you need a seat, say so in the
      group chat and this will get updated.
    </p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trip.carpool.map((car, i) => (
        <CarCard key={i} car={car} n={i + 1} />
      ))}
    </div>
  </Section>
);

const DayColumn: React.FC<{ day: Day }> = ({ day }) => (
  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <div className="flex items-baseline justify-between">
      <h3 className="font-display text-2xl text-stone-900">{day.label}</h3>
      <span className="text-sm text-stone-500">{day.date}</span>
    </div>
    <ul className="mt-4 space-y-3">
      {day.items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm">
          {item.time && (
            <span className="w-20 shrink-0 pt-0.5 font-medium text-amber-800">
              {item.time}
            </span>
          )}
          <span className="text-stone-700">
            {isTbd(item.text) ? <Tbd /> : item.text}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const Itinerary: React.FC = () => (
  <Section id="plan" eyebrow="The plan" title="Loosely speaking">
    <div className="grid gap-4 sm:grid-cols-2">
      {trip.itinerary.map((day) => (
        <DayColumn key={day.label} day={day} />
      ))}
    </div>
  </Section>
);

const tagStyles: Record<Activity["tag"], string> = {
  Hike: "bg-emerald-100 text-emerald-800",
  Drinks: "bg-purple-100 text-purple-800",
  Town: "bg-sky-100 text-sky-800",
  "On site": "bg-amber-100 text-amber-800",
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-display text-xl text-stone-900">{activity.name}</h3>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tagStyles[activity.tag]}`}
      >
        {activity.tag}
      </span>
    </div>
    <p className="mt-1 text-sm font-medium text-stone-500">{activity.drive}</p>
    <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">
      {activity.blurb}
    </p>
    {activity.url && (
      <a
        href={activity.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900"
      >
        More info
        <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
      </a>
    )}
  </div>
);

const Activities: React.FC = () => (
  <Section id="things-to-do" eyebrow="Things to do" title="If we leave the house" tone="warm">
    <div className="grid gap-4 sm:grid-cols-2">
      {trip.activities.map((a) => (
        <ActivityCard key={a.name} activity={a} />
      ))}
    </div>
  </Section>
);

const Cost: React.FC = () => (
  <Section id="cost" eyebrow="The damage" title="What you owe">
    <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
        Per person
      </p>
      <p className="mt-2 font-display text-6xl text-stone-900">
        {money(perPerson)}
      </p>
      <p className="mt-4 text-stone-600">
        {money(trip.cost.total)} &divide; {trip.cost.headcount} people
      </p>
      <p className="mx-auto mt-4 max-w-md text-sm text-stone-500">
        {trip.cost.note} Booked through {trip.house.bookedThrough}. If the
        headcount moves, so does this number.
      </p>
    </div>
  </Section>
);

const GoodToKnow: React.FC = () => (
  <Section id="good-to-know" eyebrow="Good to know" title="House rules and odds and ends" tone="warm">
    <ul className="space-y-3">
      {trip.goodToKnow.map((item) => (
        <li key={item} className="flex gap-3 text-stone-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </Section>
);

const Footer: React.FC = () => (
  <footer className="bg-stone-900 px-6 py-12 text-center text-stone-400">
    <p className="font-display text-xl text-white">{trip.house.name}</p>
    <p className="mt-1 text-sm">{trip.house.address}</p>
    <p className="mt-4 text-sm">
      Property management:{" "}
      <a href={`tel:${trip.house.phone.replace(/\D/g, "")}`} className="text-amber-400 hover:text-amber-300">
        {trip.house.phone}
      </a>
    </p>
  </footer>
);

const Page: React.FC = () => (
  <div className="min-h-screen bg-stone-50 text-stone-900">
    <Hero />
    <Basics />
    <House />
    <GettingThere />
    <Carpool />
    <Itinerary />
    <Activities />
    <Cost />
    <GoodToKnow />
    <Footer />
  </div>
);

export default Page;
