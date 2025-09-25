import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const pixelBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBAQEAk1UAAAAASUVORK5CYII=";
  const imgBuffer = Buffer.from(pixelBase64, "base64");

  try {
    const response = await fetch("https://neocities.org/site/mercylauncher");
    if (!response.ok) throw new Error(`Neocities status: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    const stats = {};
    $("ul.stats li").each((_, el) => {
      const text = $(el).text().trim().toLowerCase();
      const value = $(el).find("strong").text().trim();
      if (text.includes("views")) stats.views = value;
      if (text.includes("updates")) stats.updates = value;
    });

    console.log("Stats:", stats);
  } catch (err) {
    console.error("Fetch veya Cheerio Hatası:", err);
    // Hata olsa bile tarayıcıya pixel gönderiyoruz
  }

  // Her durumda 1x1 PNG gönder
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache");
  res.send(imgBuffer);
}
