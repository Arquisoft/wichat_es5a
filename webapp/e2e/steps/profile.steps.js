const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/profile.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
      : await puppeteer.launch({ headless: false, slowMo: 2 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 });
    await page
      .goto("http://localhost:8080", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user wants to check the profile', ({given,when,then}) => {

    let username;
    let email;
    let password;

    given('A registered user', async () => {
      username = "pruebaProfile";
      email = "prueba@profile.es";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="signup-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
    });

    when('I go to the profile', async () => {
      await expect(page).toClick('[data-testid="profile-tab"]');
    });

    then('I get to see the username and email', async () => {
      await page.waitForSelector("p", { text: "Usuario: pruebaProfile" });
      await expect(page).toMatchElement("p", { text: "Usuario: pruebaProfile" });
      await expect(page).toMatchElement("p", { text: "Email: prueba@profile.es"})
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});