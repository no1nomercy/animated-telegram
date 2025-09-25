import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 1x1 PNG dosyası
    const pixelPath = path.join(process.cwd(), "public/pixel.png");
    const img = fs.readFileSync(pixelPath);

    // Cheerio ile Neocities sayfasını çek
    const response = await fetch("https://neocities.org/site/mercylauncher");
    if (!response.ok) throw new Error(`Neocities status: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const stats = {};
    $("ul.stats li").each((i, el) => {
      const text = $(el).text().trim().toLowerCase();
      const value = $(el).find("strong").text().trim();
      if (text.includes("views")) stats.views = value;
      if (text.includes("updates")) stats.updates = value;
    });

    // İstersen burada stats’i kendi DB’ye kaydedebilirsin

    // Tarayıcıya görsel döndür
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");
    res.send(img);

    // Konsolda görebilmek için log
    console.log("Stats:", stats);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}
