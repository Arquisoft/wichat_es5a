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
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 })

    await page
      .goto("http://localhost:8080", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "pablo"
      password = "pabloasw"
      // Hay que tener cuidao con este test. Si cambiamos el elemento link esto se va a la basura
      await expect(page).toClick("a", { text: "¿No tienes una cuenta todavía? ¡Regístrate aquí!" });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Registrarse' })
    });

    then('A confirmation message should be shown in the screen', async () => {
      await page.waitForSelector("p", { text: "Usuario añadido con éxito" });
        await expect(page).toMatchElement("p", { text: "Usuario añadido con éxito" });
    });
  })

  afterAll(async ()=>{
    browser.close()
  })

});