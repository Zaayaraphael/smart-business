# SmartBiz

SmartBiz helps small-business owners keep track of their daily sales and expenses, see their profit at a glance, and build better money habits. It is designed to make everyday business numbers feel clear, useful, and easy to act on.

## Features

- Record and filter sales and expenses
- See sales, expenses, net profit, and recent cash flow in one dashboard
- Keep transaction data in the browser with local storage
- Print a simple transaction report
- Set a savings percentage against recorded profit
- Browse practical business tips
- Ask the AI business mentor for general guidance and activity insights
- Responsive dashboard and navigation for mobile and desktop

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or check the project with `npm run lint`.

## AI features

AI insights, the startup guide, and chat use the Netlify function in `netlify/functions/openai.js`. Configure the OpenAI API key as a Netlify environment variable before deploying. AI responses are general guidance and should not be treated as professional financial advice.

## Data

Transactions are stored in the browser's local storage. Clearing browser data will remove saved transactions; data is not synchronized between devices.
