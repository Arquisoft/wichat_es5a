const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-form.feature');

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

  test('The user is registered in the site', ({given,when,then}) => {

    let username;
    let email;
    let password;

    given('A registered user', async () => {
      username = "pruebaLogin";
      email = "prueba@login.es";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="signup-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
      await expect(page).toClick('[data-testid="logout-tab"]');
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    then('I am redirected to /home', async () => {
      await page.waitForSelector("h1", { text: "¿Quieres echarte una partida?" });
      await expect(page).toMatchElement("h1", { text: "¿Quieres echarte una partida?" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user submits an empty form', ({given,when,then}) =>  {

    given('A registered user', async () => {
      await expect(page).toClick('[data-testid="login-tab"]');
    });

    when('I submit the empty form', async () => {
      await expect(page).toClick('[data-testid="login-button"]');
    });

    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", "Credenciales inválidas");
    });
  })

  test('The user is not registered in the site', ({ given, when, then }) => {

    let username;
    let password;
  
    given('An unregistered user', async () => {
      username = "pruebaLogin2";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="login-tab"]');
    });
  
    when('I fill the form with an unregistered username', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });
  
    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", { text: "Credenciales inválidas" });
    });
  
  })

  test('The user submits an incorrect password', ({ given, when, then }) => {

    let username;
    let email;
    let password;
  
    given('A registered user', async () => {
      username = "pruebaLogin3";
      email = "prueba@login.com";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="signup-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
      await expect(page).toClick('[data-testid="logout-tab"]');
      await expect(page).toClick('[data-testid="login-tab"]');
    });

    when('I fill the form with an incorrect password', async () => {
      password = "Prueba2"
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", { text: "Credenciales inválidas" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});