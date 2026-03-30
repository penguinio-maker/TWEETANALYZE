const cheerio = require("cheerio");

const cleanHandle = (value) =>
  (value || "")
    .toString()
    .trim()
    .replace(/^@/, "")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 15);

const parseStats = ($) => {
  const stats = {};
  $(".profile-stat").each((_, element) => {
    const label = $(element).find(".profile-stat-header").text().trim().toLowerCase();
    const value = $(element).find(".profile-stat-num").text().trim();
    if (label) {
      stats[label] = value;
    }
  });
  return stats;
};

module.exports = async (req, res) => {
  try {
    const handle = cleanHandle(req.query.handle) || "elonmusk";
    const url = `https://nitter.net/${handle}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      res.status(502).json({ error: "Nitter unavailable" });
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const name = $(".profile-card-fullname").first().text().trim();
    const username = $(".profile-card-username").first().text().trim();
    const avatarPath = $(".profile-card-avatar img").attr("src");
    const avatar = avatarPath ? `https://nitter.net${avatarPath}` : "";
    const bio = $(".profile-bio").first().text().trim();
    const stats = parseStats($);

    let bestTweet = "";
    const tweetContent = $(".timeline-item .tweet-content").first().text().trim();
    if (tweetContent) {
      bestTweet = tweetContent.length > 80 ? `${tweetContent.slice(0, 77)}...` : tweetContent;
    }

    res.status(200).json({
      name: name || "Unknown",
      username: username || `@${handle}`,
      avatar,
      followers: stats.followers || "",
      bestTweet: bestTweet || "",
      summary: bio || "",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to parse profile" });
  }
};
