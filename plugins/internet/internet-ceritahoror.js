import * as cheerio from "cheerio";
import axios from "axios";

let Lann4youofc = async (m, { conn }) => {
  try {
    const stories = await fetchHorrorStories();

    if (!stories.length) {
      return m.reply("No stories found. Please try a different query.");
    }
    const selectedStory = stories[Math.floor(Math.random() * stories.length)];

    const storyMessage = `
- *Title:* ${selectedStory.title}

- *Story:*
${selectedStory.snippet}

- *Read More:* ${selectedStory.url}
    `;

    await conn.sendFile(m.chat, selectedStory.image, null, storyMessage, m);
  } catch (error) {
    console.error(error);
    m.reply("[!] An error occurred while fetching the story.");
  }
};

Lann4youofc.help = ["ceritahoror"];
Lann4youofc.tags = ["internet"];
Lann4youofc.command = ["ceritahoror"];

export default Lann4youofc;

async function fetchHorrorStories() {
  try {
    const response = await axios.get(
      `https://cerita-hantu-nyata.blogspot.com/search?q=Lann4youOfc&m=1`
    );

    const $ = cheerio.load(response.data);
    const stories = [];

    $(".item-content").each((index, element) => {
      const story = {
        title: $(element).find(".item-title a").text(),
        snippet: $(element).find(".item-snippet").text().trim(),
        image: $(element).find(".item-thumbnail img").attr("src"),
        url: $(element).find(".item-title a").attr("href"),
      };

      if (story.title && story.snippet && story.image && story.url) {
        stories.push(story);
      }
    });

    return stories;
  } catch (error) {
    console.error(error);
    return [];
  }
}