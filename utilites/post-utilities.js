
const axios = require("axios");

const baseUrl = "https://www.instagram.com/graphql/query/";
const queryHash = process.env.QUERY_HASH;

const initialVariables = {
    "child_comment_count": 2,
    "fetch_comment_count": 9999,
    "has_threaded_comments": true,
    "parent_comment_count": 24,
    "shortcode": null,
    "first": 10,
    "after": null,
  };
  
async function getPostId(postLink){
    shortcode= extractShortcode(postLink);
    initialVariables.shortcode=shortcode;
    const url = `${baseUrl}?query_hash=${queryHash}&variables=${encodeURIComponent(JSON.stringify(initialVariables))}`;

    const resp=await axios.get(url);
    const data = resp.data.data;
    return data.shortcode_media.id;
}

function extractShortcode(link) {
    const regex = /\/p\/([A-Za-z0-9_-]+)/;
    const match = link.match(regex);
    if (match && match.length > 1) {
        console.log(`[+] short code is ${match[1]}` );
      return match[1];
    }
    return null;
  }

module.exports ={
    getPostId
}
