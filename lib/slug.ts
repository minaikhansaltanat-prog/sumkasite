const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", қ: "q", л: "l", м: "m", н: "n",
  ң: "ng", о: "o", ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ұ: "u",
  ү: "u", ф: "f", х: "h", һ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ы: "y", і: "i", ъ: "", э: "e", ю: "yu", я: "ya", ь: "",
};

export function slugify(input: string): string {
  const lower = input.toLowerCase();
  let out = "";
  for (const ch of lower) {
    out += CYRILLIC_TO_LATIN[ch] ?? ch;
  }
  return out
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
