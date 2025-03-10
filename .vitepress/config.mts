import { defineConfig } from "vitepress";
import fs from "node:fs";

export default async () => {
  const files: string[] = await fs.promises.readdir("./mds");
  const name_maps = {
    index: "Home",
  };

  const sorting = ["Home", "Installation", "Configuration", "Plugins"];

  // https://vitepress.dev/reference/site-config
  return defineConfig({
    base: "/feed.nvim-docs/",
    title: "feed.nvim",
    description: "Documentation for feed.nvim",
    srcDir: "./mds",
    head: [
      // ['link', { rel: 'icon', href: '/favicon.ico' }],
      ["meta", { name: "og:title", content: "feed.nvim" }],
      [
        "meta",
        { name: "og:description", content: "Documentation for feed.nvim" },
      ],
      // ['meta', { name: 'og:image', content: 'https://github.com/nvim-orgmode/orgmode/blob/master/assets/nvim-orgmode.svg' }],
      // ['meta', { name: 'og:url', content: 'https://nvim-orgmode.github.i' }],
    ],
    themeConfig: {
      // logo: './nvim-orgmode.svg',
      // search: {
      //   provider: 'algolia',
      //   options: {
      //     appId: 'EUVP2UF47W',
      //     apiKey: '4be90be7c304081ec37a2b44bccefad5',
      //     indexName: 'nvim-orgmodeio',
      //   }
      // },
      nav: [{ text: "Home", link: "/" }],

      sidebar: files
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
          const name = file.replace(".md", "");
          let text = name.slice(0, 1).toUpperCase() + name.slice(1);
          text = name_maps[name] || text;
          return { text, link: `/${file.replace(".md", "")}` };
        })
        .sort((a, b) => {
          if (sorting.includes(a.text) && sorting.includes(b.text)) {
            return sorting.indexOf(a.text) - sorting.indexOf(b.text);
          }
          if (sorting.includes(a.text)) return -1;
          if (sorting.includes(b.text)) return 1;

          // Push changelog to the bottom
          if (a.text === "Changelog") return 1;
          if (b.text === "Changelog") return -1;

          return a.text.localeCompare(b.text);
        }),

      socialLinks: [
        { icon: "github", link: "https://github.com/neo451/feed.nvim" },
      ],
      outline: {
        level: [2, 3],
      },
    },
    cleanUrls: true,
    markdown: {
      anchor: {
        slugify: (s: string) =>
          s
            .replace(/\s/g, "-")
            .replace(/[\.\/]/g, "")
            .toLowerCase(),
      },
    },
    sitemap: {
      hostname: "https://neo451.github.io/feed.nvim-docs/",
    },
    lastUpdated: true,
  });
};
