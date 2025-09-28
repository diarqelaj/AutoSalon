// src/lib/imagin.ts
export type ImaginOpts = {
  make: string;
  modelFamily: string;
  angle: string | number;
  width?: number;
  modelYear?: number;
  trim?: string;
  bodySize?: string;
  powerTrain?: string;
  paintId?: string;             // still supported
  paintDescription?: string;    // <-- new (works with public "img" customer)
};

export function imaginImageUrl(o: ImaginOpts) {
  const u = new URL("https://cdn.imagin.studio/getimage");
  // works fine with the public demo customer
  u.searchParams.set("customer", process.env.NEXT_PUBLIC_IMAGIN_CUSTOMER || "img");

  u.searchParams.set("make", o.make);
  u.searchParams.set("modelFamily", o.modelFamily);
  u.searchParams.set("angle", String(o.angle));
  u.searchParams.set("zoomType", "fullscreen");

  if (o.width) u.searchParams.set("width", String(o.width));
  if (o.modelYear) u.searchParams.set("modelYear", String(o.modelYear));
  if (o.trim) u.searchParams.set("trim", o.trim);
  if (o.bodySize) u.searchParams.set("bodySize", o.bodySize);
  if (o.powerTrain) u.searchParams.set("powerTrain", o.powerTrain);

  if (o.paintId) {
    u.searchParams.set("paintId", o.paintId);
  } else if (o.paintDescription) {
    u.searchParams.set("paintDescription", o.paintDescription);
  }

  return u.toString();
}

export const IMAGIN_SWATCHES: { label: string; q: string; hex: string }[] = [
  { label: "Silver",          q: "Silver",          hex: "#C0C0C0" },
  { label: "Black metallic",  q: "Black metallic",  hex: "#1B1B1B" },
  { label: "White",           q: "White",           hex: "#FFFFFF" },
  { label: "Grey",            q: "Grey",            hex: "#8D8D8D" },
  { label: "Red",             q: "Red",             hex: "#C62828" },
  { label: "Blue",            q: "Blue",            hex: "#1E5AA8" },
  { label: "Green",           q: "Green",           hex: "#1B5E20" },
];
