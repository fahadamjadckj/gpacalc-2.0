import edgeChromium from 'chrome-aws-lambda';

import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {

  const executablePath = await edgeChromium.executablePath;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });

  let page = await browser.newPage();
  await page.goto('http://lms.uaf.edu.pk/login/index.php')

  await page.type('#REG', '2020-ag-8322');

  await Promise.all([
    page.click('input[value=Result]'),
    page.waitForNavigation(),
  ]);

  let data = await page.evaluate(() => {
    let values = []
    let tableRows = document.querySelectorAll('tr')

    tableRows.forEach((row) => {
      let children = {}
      let index = 0
      row.childNodes.forEach((child) => {
        if (child.innerText != null) {
          children[index] = child.innerText
          index++
        }
      })
      values.push(children)
    })

    return values
  });


  res.status(200).json({data: data});
}
