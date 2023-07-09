const CONSTANTS = require("../CONSTANTS");
const {processFetchingComments } = require("../utilites/fetch-comments");
const { loginToInstagram } = require("../utilites/puppeteer-login");

module.exports = {
    getPostCommentsByLink: getPostCommentsByLink
}

async function getPostCommentsByLink(req, res) {
    
    let postLink = req.params.encodedUrl;
    if (!postLink) return res.status(400).send("[!] please provide valid data!");
    postLink= decodeURIComponent(postLink);
    console.log(postLink);

    try {
        
        const result = await processFetchingComments(postLink,CONSTANTS.getHeaders());
        
        
        return res.status(200).send(result);
        
    } catch (err) {
        console.log(err);
        let updatedHeaders = await prepareHeaders();
        const result = await processFetchingComments(postLink,updatedHeaders);
        if(result){
            return res.status(200).send(result);
        }else{
            return res.status(400).send(`[!] an error ocurred ${err}`);
        }

    }
}

async function prepareHeaders() {
    const res = await loginToInstagram("wealthinesscity", "Raye73albet.");
    let h = CONSTANTS.headers;
    h.cookie = res.cookies;
    h["x-csrftoken"] = res.csrftoken;
    return h;
}