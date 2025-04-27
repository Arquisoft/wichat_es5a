const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

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

  test('The user is not registered in the site', ({given,when,then}) => {

    let username;
    let email;
    let password;

    given('An unregistered user', async () => {
      username = "prueba";
      email = "prueba@prueba.es"
      password = "Prueba1";
      await expect(page).toClick('[data-testid="signup-tab"]');
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
    });

    then('I am redirected to /home', async () => {
      await page.waitForSelector("h1", { text: "¿Quieres echarte una partida?" });
      await expect(page).toMatchElement("h1", { text: "¿Quieres echarte una partida?" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user submits an empty form', ({given,when,then}) =>  {

    given('An unregistered user', async () => {
      await expect(page).toClick('[data-testid="signup-tab"]');
    });

    when('I submit the empty form', async () => {
      await expect(page).toClick('[data-testid="signup-button"]');
    });

    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", "El nombre de usuario debe tener al menos 4 caracteres");
    });
  })

  test('The user submits an already registered email', ({ given, when, then }) => {

    let username;
    let email;
    let password;
  
    given('A user with an email that is already registered', async () => {
      username = "prueba2";
      email = "prueba@prueba.com"
      password = "Prueba1";
      await expect(page).toClick('[data-testid="signup-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  
    when('I fill the form with a repeated email', async () => {
      await expect(page).toClick('[data-testid="signup-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
    });
  
    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", { text: "Ya hay un usuario registrado con ese email" });
    });
  
  })

  test('The user submits an invalid password', ({ given, when, then }) => {

    let username;
    let email;
    let password;
  
    given('An unregistered user', async () => {
      username = "prueba3";
      email = "prueba@prueba.org"
      password = "password";
      await expect(page).toClick('[data-testid="signup-tab"]');
    });

    when('I fill the form with an invalid password', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
    });

    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", { text: "La contraseña debe tener al menos 7 caracteres, uno de ellos mayúscula y otro un número" });
    });
  })

  test('The user submits two passwords that do not match', ({ given, when, then }) => {

    let username;
    let email;
    let password1;
    let password2;
  
    given('An unregistered user', async () => {
      username = "prueba3";
      email = "prueba@prueba.org"
      password1 = "Password1";
      password2 = "Password2";
      await expect(page).toClick('[data-testid="signup-tab"]');
    });

    when('I fill the form with two passwords that do not match', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password1);
      await expect(page).toFill('input[name="confirmPassword"]', password2);
      await expect(page).toClick('[data-testid="signup-button"]');
    });

    then('An error message should be shown', async () => {
      await expect(page).toMatchElement("p", { text: "Las contraseñas no coinciden" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});