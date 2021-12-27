import axios from "axios";

const SYNDICATION_URL = "https://syndication.twitter.com";

export async function fetchTweetsHtml(ids) {
  try {
    const response = await axios.get(
      `${SYNDICATION_URL}/tweets.json?ids=${ids}`
    );
    return response.status == 200 ? response.data : false;
  } catch {
    return false;
  }
}
