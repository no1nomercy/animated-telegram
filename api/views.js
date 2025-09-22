// api/views.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    // Neocities sayfanızın URL'si
    const url = "https://mercylauncher.neocities.org/";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Neocities status: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // div.stat > strong > font > font zincirinden rakamı çek
    const views = $(".stat strong font font").first().text().trim();

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json({ views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
