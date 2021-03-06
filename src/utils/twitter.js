import { fetchTweetsHtml } from "../services/twitter";
import cheerio from "react-native-cheerio";

function getTweetContent($) {
  const container = $(".EmbeddedTweet-tweetContainer");

  if (!container.length) return;

  const meta = {};
  const content = { meta };

  // This is the blockquote with the tweet
  const subject = container.find('[data-scribe="section:subject"]');

  // Tweet header with the author info
  const header = subject.children(".Tweet-header");
  const avatar = header.find('[data-scribe="element:avatar"]');
  const author = header.find('[data-scribe="component:author"]');
  const name = author.find('[data-scribe="element:name"]');
  const screenName = author.find('[data-scribe="element:screen_name"]');

  // Tweet body
  const tweet = subject.children('[data-scribe="component:tweet"]');
  const tweetContent = tweet.children("p");
  const card = tweet.children(".Tweet-card");
  const tweetInfo = tweet.children(".TweetInfo");
  const fullTimestamp = tweetInfo.find(
    '[data-scribe="element:full_timestamp"]'
  );
  const heartCount = tweetInfo.find('[data-scribe="element:heart_count"]');

  // Tweet footer
  const callToAction = container.children(
    '[data-scribe="section:cta component:news"]'
  );
  const profileText = callToAction.children(
    '[data-scribe="element:profile_text"]'
  );
  const conversationText = callToAction.children(
    '[data-scribe="element:conversation_text"]'
  );

  let quotedTweet;
  let mediaHtml;

  meta.id = subject.attr("data-tweet-id");
  meta.avatar = {
    normal: avatar.attr("data-src-1x"),
  };
  meta.name = name.text();
  meta.username = screenName.text().substring(1); // Omit the initial @
  meta.createdAt = new Date(fullTimestamp.attr("data-datetime")).getTime();
  meta.heartCount = heartCount.text();
  meta.ctaType = profileText.length ? "profile" : "conversation";

  if (conversationText.length) {
    // Get the formatted count and skip the rest
    meta.ctaCount = conversationText.text().match(/^[^\s]+/)[0];
  }

  // If some text ends without a trailing space, it's missing a <br>
  tweetContent.contents().each(function () {
    const el = $(this);
    const type = el[0].type;

    if (type !== "text") return;

    const text = el.text();

    if (text.length && text.trim() === "") {
      if (el.next().children().length) {
        el.after($("<br>"));
      }
    } else if (!/\s$/.test(el.text()) && el.next().children().length) {
      el.after($("<br>"));
    }
  });

  card.children().each(function () {
    const props = this.attribs;
    const scribe = props["data-scribe"];
    const el = $(this);

    if (scribe === "section:quote") {
      const tweetCard = el.children("a");
      const id = tweetCard.attr("data-tweet-id");
      const url = tweetCard.attr("href");

      quotedTweet = { id, url };
      return;
    }

    const media = $("<div>");
    const urls = [];

    if (scribe === "component:card") {
      const photo = el.children('[data-scribe="element:photo"]');
      const photoGrid = el.children('[data-scribe="element:photo_grid"]');
      const photos = photo.length ? photo : photoGrid;

      if (photos.length) {
        const images = photos.find("img");

        // get all images url using cheerio
        images.each(function () {
          const image = $(this);
          const url = image.attr("data-image");
          const format = image.attr("data-image-format");
          const height = image.attr("height");
          const width = image.attr("width");

          urls.push({ src: `${url}?format=${format}`, height, width });
        });

        media.attr("data-type", `image-container ${images.length}`);
        mediaHtml = urls;
      }
    }
  });

  let emojis = [];

  tweetContent.children("img").each(function () {
    const props = this.attribs;

    // Handle emojis inside the text
    if (props.class?.includes("Emoji--forText")) {
      this.attribs = {
        alt: props.alt,
      };
      emojis.push(props.alt);
      return;
    }

    console.error(
      "An image with the following props is not being handled:",
      props
    );
  });

  let mentions = [];

  tweetContent.children("a").each(function () {
    let string = "";
    const el = $(this);
    const props = this.attribs;
    const scribe = props["data-scribe"];
    const asTwitterLink = () => {
      this.attribs = {};
      string = el.text(el.text());
      mentions.push(el.text());
      return string;
    };

    // @mention
    if (scribe === "element:mention") {
      return asTwitterLink();
    }

    // #hashtag
    if (scribe === "element:hashtag") {
      // A hashtag may be a $cashtag too
      return asTwitterLink();
    }

    if (scribe === "element:url") {
      const url = props["data-expanded-url"];
      const quotedTweetId = props["data-tweet-id"];

      // Remove link to quoted tweet to leave the card only
      // if (quotedTweetId && quotedTweetId === quotedTweet?.id) {
      //   el.remove();
      //   return;
      // }

      // Handle normal links
      const text = { type: "text", data: url };
      // Replace the link with plain text and markdown will take care of it
      el.replaceWith(text);
    }
  });

  content.html = tweetContent.html();

  if (quotedTweet) content.quotedTweet = quotedTweet;
  if (mediaHtml) content.mediaHtml = mediaHtml;
  if (mentions) content.mentions = mentions;
  if (emojis) content.emojis = emojis;

  return content;
}

export async function fetchTweetHtml(id) {
  const html = await fetchTweetsHtml(id);
  return html[id];
}

export function getTweetData(html) {
  const $ = cheerio.load(html, {
    decodeEntities: false,
    xmlMode: false,
  });
  const tweetContent = getTweetContent($);

  return tweetContent;
}

export async function fetchTweet(tweetId) {
  const tweetHtml = await fetchTweetHtml(tweetId);
  let tweet = !!tweetHtml && getTweetData(tweetHtml);

  if (!tweet) return;

  tweet.html = tweet.html.replace(/<br>/g, "\n");

  //remove all img tags leaving only alt prop
  tweet.html = tweet.html.replace(/<img[^>]*>/g, "");

  return tweet;
}

export async function fetchTweets(ids) {
  const tweets = [];
  for (let i = 0; i < ids.length; i++) {
    const tweet = await fetchTweet(ids[i]);
    if (tweet) tweets.push(tweet);
  }

  return tweets;
}
