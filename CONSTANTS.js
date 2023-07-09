
module.exports = {
getHeaders,
updateHeaders
};


let headers ={
  "accept": "*/*",
  "accept-language": "en-US,en;q=0.9",
  "sec-ch-prefers-color-scheme": "dark",
  "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Microsoft Edge\";v=\"114\"",
  "sec-ch-ua-full-version-list": "\"Not.A/Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"114.0.5735.201\", \"Microsoft Edge\";v=\"114.0.1823.67\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-ch-ua-platform-version": "\"15.0.0\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-asbd-id": "129477",
  "x-csrftoken": "", //
  "x-ig-app-id": "936619743392459",
  "x-ig-www-claim": "hmac.AR0o33mZthLTRPA-F--rD67a90hlwX3VlHtCRW875eENFhD-",
  "x-requested-with": "XMLHttpRequest",
  "cookie": "",
  "Referer": "https://www.instagram.com/p/CtrwWbRPqTI/",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}

  
  function getHeaders(){
    return headers;
  }
  function updateHeaders(cookies,token){
    headers.cookie=cookies;
    headers["x-csrftoken"]=token;
  }