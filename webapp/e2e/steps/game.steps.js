const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
      : await puppeteer.launch({ headless: false, slowMo: 2 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 30000 });
    await page
      .goto("http://localhost:8080", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user wants to play an easy game', ({given,when,then}) => {

    let username;
    let email;
    let password;

    given('A registered user', async () => {
      username = "pruebaGame";
      email = "prueba@game.es";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="signup-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="email"]', email);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toFill('input[name="confirmPassword"]', password);
      await expect(page).toClick('[data-testid="signup-button"]');
    });

    when('I set the game mode to cities and the difficulty easy', async () => {
      await expect(page).toClick('[data-testid="play-tab"]');
      await expect(page).toClick('[data-testid="city"]');
      await expect(page).toClick('[data-testid="easy"]');
      await expect(page).toClick('button[id="button-start"]');
    });

    then('I get to play an easy cities game', async () => {
      await page.waitForSelector("h2", { text: "¿Qué ciudad es esta?" });
      await expect(page).toMatchElement("h2", { text: "¿Qué ciudad es esta?" });
      await expect(page).toMatchElement("div", { text: "Pregunta: 1 / 5" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user wants to play a medium game', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "pruebaGame";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="login-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    when('I set the game mode to flags and the difficulty medium', async () => {
      await expect(page).toClick('[data-testid="play-tab"]');
      await expect(page).toClick('[data-testid="flag"]');
      await expect(page).toClick('[data-testid="medium"]');
      await expect(page).toClick('button[id="button-start"]');
    });

    then('I get to play a medium flags game', async () => {
      await page.waitForSelector("h2", { text: "¿De qué país es esta bandera?" });
      await expect(page).toMatchElement("h2", { text: "¿De qué país es esta bandera?" });
      await expect(page).toMatchElement("div", { text: "Pregunta: 1 / 10" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user wants to play a difficult game', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "pruebaGame";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="login-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    when('I set the game mode to football and the difficulty difficult', async () => {
      await expect(page).toClick('[data-testid="play-tab"]');
      await expect(page).toClick('[data-testid="football"]');
      await expect(page).toClick('[data-testid="difficult"]');
      await expect(page).toClick('button[id="button-start"]');
    });

    then('I get to play a difficult football game', async () => {
      await page.waitForSelector("h2", { text: "¿Qué equipo de fútbol es este?" });
      await expect(page).toMatchElement("h2", { text: "¿Qué equipo de fútbol es este?" });
      await expect(page).toMatchElement("div", { text: "Pregunta: 1 / 20" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user wants to play a survival game', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "pruebaGame";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="login-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    when('I set the game mode to music and the difficulty survival', async () => {
      await expect(page).toClick('[data-testid="play-tab"]');
      await expect(page).toClick('[data-testid="music"]');
      await expect(page).toClick('[data-testid="survival"]');
      await expect(page).toClick('button[id="button-start"]');
    });

    then('I get to play a survival music game', async () => {
      await page.waitForSelector("h2", { text: "¿Qué grupo de música es?" });
      await expect(page).toMatchElement("h2", { text: "¿Qué grupo de música es?" });
      await expect(page).toMatchElement("div", { text: "Pregunta: 1" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user needs a hint during a game', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "pruebaGame";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="login-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    when('I play a game and click on the hint button', async () => {
      await expect(page).toClick('[data-testid="play-tab"]');
      await expect(page).toClick('[data-testid="flag"]');
      await expect(page).toClick('[data-testid="easy"]');
      await expect(page).toClick('button[id="button-start"]');
      await page.waitForTimeout(3000); // Espera a que el botón de pistas esté habilitado
      await expect(page).toClick('button[id="botonPista"]');
    });

    then('I get a hint from the llm', async () => {
      await page.waitForSelector("div", { text: "Respuesta del LLM:" });
      await expect(page).toMatchElement("div", { text: "Respuesta del LLM:" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  test('The user needs a chat assistant during a game', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "pruebaGame";
      password = "Prueba1";
      await expect(page).toClick('[data-testid="login-tab"]');
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');
    });

    when('I play a game and click on the chat button', async () => {
      await expect(page).toClick('[data-testid="play-tab"]');
      await expect(page).toClick('[data-testid="flag"]');
      await expect(page).toClick('[data-testid="easy"]');
      await expect(page).toClick('button[id="button-start"]');
      await page.waitForTimeout(3000); // Espera a que el botón de pistas esté habilitado
      await expect(page).toClick('button[id="botonChat"]');
    });

    then('I get to chat to the llm', async () => {
      await page.waitForSelector("div", { text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?" });
      await expect(page).toMatchElement("div", { text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?" });
      await expect(page).toClick('[data-testid="logout-tab"]');
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});