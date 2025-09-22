import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://neocities.org/site/mercylauncher");
    if (!response.ok) {
      return res.status(500).json({ error: `Neocities status: ${response.status}` });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const element = $(".stat strong font font").first();
    const views = element ? element.text().trim() : "0";

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json({ views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
