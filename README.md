# sell-your-ebook

Simple landing page with Stripe connection to sell your ebook.

> To actually create an ebook (with code), see [this other repo](https://github.com/JAlcocerT/ebooks).


✨ Acknowledgment

1. Thanks to: https://github.com/candidosales/landing-page-book-astro-tailwind and https://github.com/zenorocha/14habits.comfrom which this repo is based

>  MIT | Simple landing page to sell your book - Astro + Tailwind 

```sh
#git clone https://github.com/JAlcocerT/sell-your-ebook
#npm install
npm run dev -- --host 0.0.0.0 --port 4321 #http://192.168.1.11:4321/
#npm run build
#npm install -g serve #serve with npm
#serve -s dist #http://localhost:3000

```

Deploy with containers:

```sh
make quick-dev
# Access at: http://localhost:4321
```

```sh
make quick-prod  
# Access at: http://localhost:8090
```