import Walk from "./Walk.js";

export default function index(json: any): any {
  const dict = Object.create(null);
  Walk(json, (value, pointer) => {
    if (typeof value !== "object" || value === null) {
      dict[pointer] = value;
    }
  });
  return dict;
}
