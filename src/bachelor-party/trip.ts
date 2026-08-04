// ---------------------------------------------------------------------------
// Everything on the bachelor party page comes from this file.
// Edit here, not in Page.tsx.
//
// Anything still marked TBD renders as a muted "TBD" chip on the page, so it is
// obvious to everyone that it hasn't been decided yet. Search for "TBD" to find
// what's left to fill in.
// ---------------------------------------------------------------------------

export const TBD = "TBD" as const;

export type Maybe = string | typeof TBD;

export type Car = {
  driver: Maybe;
  leavingFrom: Maybe;
  leavingAt: Maybe;
  seatsOpen: number | null;
  riders: string[];
};

export type ItineraryItem = {
  time?: string;
  text: Maybe;
};

export type Day = {
  label: string;
  date: string;
  items: ItineraryItem[];
};

export type Activity = {
  name: string;
  blurb: string;
  drive: string;
  tag: "Hike" | "Drinks" | "Town" | "On site";
  url?: string;
};

export type Photo = {
  src: string;
  alt: string;
};

export const trip = {
  title: "Bachelor Party",
  house: {
    name: "Copper Canyon",
    address: "294 Nora Lane, Cleveland, GA 30528",
    listingUrl: "https://www.georgiamtnrentals.com/rentals/copper-canyon",
    bookedThrough: "VRBO",
    bedrooms: 5,
    bathrooms: "3.5",
    sleeps: 12,
    phone: "(706) 878-8400",
  },

  dates: {
    checkIn: { date: "2026-09-04T16:00:00", label: "Fri, Sep 4", time: "4:00 PM" },
    checkOut: { date: "2026-09-07T11:00:00", label: "Mon, Sep 7", time: "11:00 AM" },
    nights: 3,
    // Sep 7, 2026 is Labor Day — worth knowing, Helen gets busy.
    note: "Labor Day weekend",
  },

  cost: {
    total: 3205.45,
    headcount: 12,
    note: "Full VRBO charge for the house, taxes and fees included. Split evenly.",
  },

  photos: {
    hero: "/bachelor-party/house.jpg",
    gallery: [
      { src: "/bachelor-party/lake.jpg", alt: "The lake and fire pit below the deck" },
      { src: "/bachelor-party/hot-tub.jpg", alt: "Covered hot tub overlooking the lake" },
      { src: "/bachelor-party/dock.jpg", alt: "Private dock with table and umbrella" },
      { src: "/bachelor-party/great-room.jpg", alt: "Great room with stone fireplace" },
      { src: "/bachelor-party/pool-table.jpg", alt: "Pool table on the lower level" },
      { src: "/bachelor-party/deck.jpg", alt: "Covered deck looking out over the water" },
      { src: "/bachelor-party/loft.jpg", alt: "Looking down into the great room from the loft" },
      { src: "/bachelor-party/kitchen.jpg", alt: "Main kitchen" },
      { src: "/bachelor-party/patio.jpg", alt: "Stone patio and lakeside seating" },
      { src: "/bachelor-party/exterior.jpg", alt: "The lodge from the lawn" },
      { src: "/bachelor-party/dining.jpg", alt: "Dining table that seats the group" },
      { src: "/bachelor-party/bedroom.jpg", alt: "One of the upstairs bedrooms" },
    ] as Photo[],
  },

  amenities: [
    "Private 15-acre lake",
    "Hot tub",
    "Pool table",
    "Fire pit",
    "Private dock",
    "Two full kitchens",
    "Gas grill",
    "Stone fireplace",
    "Foosball + arcade hoops",
    "Wi-Fi",
    "Washer / dryer",
    "Satellite TV",
  ],

  // TBD: fill in drivers, times, meeting points, and who's riding with who.
  // Hard cap of 6 vehicles in the driveway — that is the whole reason this
  // section exists. Add or remove cars as plans firm up.
  carpool: [
    { driver: TBD, leavingFrom: TBD, leavingAt: TBD, seatsOpen: null, riders: [] },
    { driver: TBD, leavingFrom: TBD, leavingAt: TBD, seatsOpen: null, riders: [] },
    { driver: TBD, leavingFrom: TBD, leavingAt: TBD, seatsOpen: null, riders: [] },
  ] as Car[],

  maxVehicles: 6,

  // TBD: the anchors below are real (check-in, checkout). Everything else is a
  // placeholder — swap in actual plans.
  itinerary: [
    {
      label: "Friday",
      date: "Sep 4",
      items: [
        { time: "4:00 PM", text: "Check in, claim beds, unload the coolers" },
        { time: "Evening", text: TBD },
      ],
    },
    {
      label: "Saturday",
      date: "Sep 5",
      items: [
        { time: "Morning", text: TBD },
        { time: "Afternoon", text: TBD },
        { time: "Evening", text: TBD },
      ],
    },
    {
      label: "Sunday",
      date: "Sep 6",
      items: [
        { time: "Day", text: TBD },
        { time: "Evening", text: TBD },
      ],
    },
    {
      label: "Monday",
      date: "Sep 7",
      items: [
        { time: "Morning", text: "Clean up, pack out" },
        { time: "11:00 AM", text: "Check out" },
      ],
    },
  ] as Day[],

  activities: [
    {
      name: "Raven Cliff Falls",
      blurb:
        "5.1-mile out-and-back along Dodd Creek, past a string of smaller falls, ending at a waterfall that splits a rock face. Moderate, with a steep last pitch. Lot fills up by late morning on holiday weekends.",
      drive: "~40 min",
      tag: "Hike",
      url: "https://www.alltrails.com/trail/us/georgia/raven-cliff-falls-trail",
    },
    {
      name: "Yonah Mountain Vineyards",
      blurb: "Tastings and cave tours, with Yonah Mountain right behind it. Closest real outing to the house.",
      drive: "~7 min",
      tag: "Drinks",
      url: "https://yonahmountainvineyards.com/",
    },
    {
      name: "CeNita Vineyards",
      blurb: "Basically next door. Tasting room and a lawn with a view — an easy first stop or a low-effort afternoon.",
      drive: "~3 min",
      tag: "Drinks",
      url: "https://cenitavineyards.com/",
    },
    {
      name: "Downtown Helen",
      blurb: "Bavarian-themed river town — bars, German food, shops. Expect it to be packed over Labor Day weekend.",
      drive: "~20 min",
      tag: "Town",
      url: "https://explorehelen.com/",
    },
    {
      name: "Tubing the Chattahoochee",
      blurb:
        "Helen's signature activity. Operators run through Labor Day Monday, so this weekend is the tail end of the season — worth booking ahead.",
      drive: "~20 min",
      tag: "Town",
      url: "https://helentubing.com/",
    },
    {
      name: "Mount Yonah summit",
      blurb: "Shorter and steeper than Raven Cliff — about 4.5 miles round trip to big granite ledges and a wide view.",
      drive: "~15 min",
      tag: "Hike",
      url: "https://www.alltrails.com/trail/us/georgia/mount-yonah-trail",
    },
    {
      name: "The lake",
      blurb:
        "Private 15-acre lake with a dock. Catch-and-release fishing, and you can bring kayaks, canoes, or paddle boards. No motorboats.",
      drive: "Out the back door",
      tag: "On site",
    },
    {
      name: "Hot tub, fire pit, pool table",
      blurb: "The default plan when nobody wants to drive anywhere. Which will happen.",
      drive: "Out the back door",
      tag: "On site",
    },
  ] as Activity[],

  goodToKnow: [
    "12 guests max, strictly enforced — no extras, no day visitors.",
    "6 vehicles max in the driveway. No trailers, RVs, or motorcycles.",
    "Everyone needs to be 25 or older.",
    "No pets.",
    "No motorized boats on the lake.",
    "Nearest real grocery run is in Cleveland, about 15 minutes out. Stock up on the way in.",
    "It's Labor Day weekend, so Helen and the trailheads will be busy. Start early.",
  ],
};

export const perPerson = trip.cost.total / trip.cost.headcount;
