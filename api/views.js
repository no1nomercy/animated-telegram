import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://neocities.org/site/mercylauncher"); // URL’yi kendin değiştir
    if (!response.ok) {
      return res.status(500).json({ error: `Neocities status: ${response.status}` });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const stats = {};
    $(".stats .stat").each((i, el) => {
      const key = $(el).find("span").text().trim();
      const value = $(el).find("strong").text().trim();
      if (key === "views" || key === "updates") {
        stats[key] = value;
      }
    });

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
