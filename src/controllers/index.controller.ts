const CoinGecko = require('coingecko-api');
import { Client } from '@notionhq/client/build/src';
import { NextFunction, Request, Response } from 'express';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getDatabase() {
  const response = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  console.log(response);
}

async function getPage() {
  const response = await notion.pages.retrieve({
    page_id: process.env.NOTION_PAGE_ID,
  });
  console.log(response);
}

async function getBlock() {
  const response = await notion.blocks.retrieve({
    block_id: process.env.NOTION_BLOCK_ID,
  });
  console.log(response);
}

let btcPrice;

async function getBTCPrice() {
  const CoinGeckoClient = new CoinGecko();
  let data = await CoinGeckoClient.simple.price({
    ids: ['bitcoin'],
    vs_currencies: ['usd'],
  });

  let price = data.data.bitcoin.usd;
  btcPrice = price
  console.log(data.data.bitcoin.usd);

}

async function updateBlock() {
  const response = await notion.blocks.update({
    block_id: process.env.NOTION_BLOCK_ID,
    heading_1: {
      text: [
        {
          type: 'text',
          text: {
            content: 'BTC' + ' -> ' + btcPrice,
            link: null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: 'default',
          },
        },
      ],
    },
  });
  console.log(response);
}

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      // getDatabase();
      // getPage();
      // getBlock();
      getBTCPrice();
      updateBlock();
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
