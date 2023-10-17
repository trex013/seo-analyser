import axios from "axios";
import cheerio from "cheerio";

async function getSEOInfo(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $("title").text();
    const headers = {};
    for (let i = 1; i <= 6; i++) {
      headers[`h${i}`] = $(`h${i}`).length;
    }

    const metaDescription = $("meta[name=description]").attr("content") || "";
    const metaKeywords = $("meta[name=keywords]").attr("content") || "";
    const images = $("img").length;
    const canonicalURL = $("link[rel=canonical]").attr("href") || "";
    const internalLinks = $('a[href^="/"]').length;
    const externalLinks = $('a[href^="http"]').length;

    return {
      title,
      headers,
      metaDescription,
      metaKeywords,
      images,
      canonicalURL,
      internalLinks,
      externalLinks,
    };
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
}

export default async ({ req, res, log, error }) => {
  if (req.method !== "GET") {
    return error("Request method not supported");
  }
  const info = await getSEOInfo(req.query.url);
  if (!info) return error("failed to get SEO information");
  log(info);
  return res.json(info);
};
