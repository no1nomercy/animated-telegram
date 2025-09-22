import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    // Neocities sitenizin güncel URL’si
    const response = await fetch("https://neocities.org/site/mercylauncher");
    if (!response.ok) throw new Error(`Neocities status: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // stats div’i içinden sadece views ve updates
    const stats = {};
    $(".stats .stat").each((i, el) => {
      const key = $(el).find("span").text().trim().toLowerCase();
      const value = $(el).find("strong").text().trim();
      if (key === "views" || key === "updates") stats[key] = value;
    });

    // Cache devre dışı
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    console.log("Stats fetched:", stats); // Log ile doğrulama
    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
