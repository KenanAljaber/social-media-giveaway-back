const axios = require("axios");
const { getPostId } = require("./post-utilities");
const { loginToInstagram } = require("./puppeteer-login");
const { getHeaders, updateHeaders } = require("../CONSTANTS");

const BASE_URL = 'https://www.instagram.com/api/v1/media';
let headers;
// let postId="";


let comments = [];
const MAC_LIMIT = 100;

async function fetchComments(url) {
  console.log("[+] fetching");
  let commentsCount = '';
  try {
    const response = await axios.get(url, { headers });
    const data = response.data;
    if (data.comments) {
      // Process the comments
      const commentsWithUserPics = await Promise.all(data.comments.map(async (currComment) => {
        const userPicResponse = await axios.get(currComment.user.profile_pic_url, { responseType: 'arraybuffer' });
        const userPicBuffer = Buffer.from(userPicResponse.data, 'binary');
        const userPicBase64 = userPicBuffer.toString('base64');
        return {
          text: currComment.text,
          userName: currComment.user.username,
          userPic: `data:image/jpeg;base64,${userPicBase64}`
        };
      }));
      comments.push(...commentsWithUserPics);
      console.log(`[+] ${comments.length} comments loaded`);
      commentsCount = data.comment_count;
    }
    // Check if there is a next page
    if (data.next_min_id && comments.length < parseFloat(commentsCount) && comments.length < MAC_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log(`[+] loading more comments `);
      // Extract the next_min_id from the response
      const nextMinId = JSON.parse(data.next_min_id).cached_comments_cursor;
      const bifilterToken = JSON.parse(data.next_min_id).bifilter_token;

      // URL-encode the nextMinId and bifilterToken
      const encodedNextMinId = encodeURIComponent(nextMinId);
      const encodedBifilterToken = encodeURIComponent(bifilterToken);

      // Construct the URL for the next page
      const nextPageUrl = `${url}&min_id=%7B%22cached_comments_cursor%22%3A%20%22${encodedNextMinId}%22%2C%20%22bifilter_token%22%3A%20%22${encodedBifilterToken}%22%7D`;

      // Fetch the next page recursively
      return await fetchComments(nextPageUrl);
    } else {
      return { comments, commentsCount };
    }
  } catch (err) {
    console.log('[!] err');
    console.log(err.message);
    console.log(comments);
  }
}





async function processFetchingComments(postLink, updatedHeaders) {
  headers = getHeaders();
  if(!headers.cookie || !headers["x-csrftoken"]){
    const obj =await loginToInstagram(process.env.USER_NAME, process.env.PASS);
    updateHeaders(obj.cookies,obj.csrftoken);
    headers=getHeaders();
  }
  const postId = await getPostId(postLink);
  console.log(`[+] post id is ${postId}`);
  const url = `${BASE_URL}/${postId}/comments/?can_support_threading=true&permalink_enabled=false`;
  comments=[];
  const result = await fetchComments(url);
  
  if(!result || !result.comments){
    return null;
  }
  console.log(`[+] comments fetched ${result.comments.length}`);
  console.log('[+] Done fetching');
  return result;
  

}

module.exports = {
  processFetchingComments
}

