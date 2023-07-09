const puppeteer = require('puppeteer');

async function loginToInstagram(username, password) {
  try {
    const browser = await puppeteer.launch({   headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2'});

    // Check for cookies allowance popup
    const allowCookiesButton = await page.$('button[class="_a9-- _a9_0"]');
    if (allowCookiesButton) {
      await allowCookiesButton.click();
      await page.waitForSelector('input[name="username"]');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 1 second
    }

    // Enter username and password
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    console.log('[+] typed credentials');

    // Click the login button
    await page.click('button[type="submit"]');
    console.log('[+] submit clicked');

    // Wait for the login to complete
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Check if login was successful
    const loginError = await page.$('.eiCW-');
    if (loginError) {
      console.log('Login failed');
      await browser.close();
      return null;
    }

    console.log('[+] Login successful');
    console.log(`[+] retrieving cookies and csrftoken`);
    // Retrieve cookies
    let cookies = await page.cookies();

    // Retrieve x-csrftoken
    const csrftoken = cookies.find(cookie => cookie.name === 'csrftoken').value;

    cookies = processCookies(cookies);
    console.log(`[+] cookies and csrftoken fetched`);
    console.log(`[+] closing browser`);
    await browser.close();
    return { cookies, csrftoken, page };
  } catch (err) {
    console.log(`[!] error happened ${err}`);
    console.log(`[+] retrying....`);
    await new Promise(resolve => setTimeout(resolve,1000));
    await loginToInstagram(username, password);
  }
}

//
function processCookies(cookies) {
  console.log(`[+] processing cookies`);
  let newCookies = '';
  cookies.forEach(c => {
    const currCookieValue = `${c.name}=${c.value};`
    newCookies = newCookies + currCookieValue;
  })
  return newCookies;
}

module.exports = {
  loginToInstagram
};


