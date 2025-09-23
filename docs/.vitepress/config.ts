import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: "en-US",
  title: "Laravel",
  description: "Laravel Alif Private Documentation.",

  themeConfig: {
    darkModeSwitchLabel: "Mode Gelap",

    // Menambahkan sosial link di header
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/alifmusthofa354/laravel-alif-documentation",
      },
      // Anda bisa menambahkan ikon lain seperti 'twitter', 'linkedin', dll.
    ],

    // Tombol untuk mengedit halaman
    editLink: {
      pattern:
        "https://github.com/alifmusthofa354/laravel-alif-documentation/edit/main/docs/:path",
      text: "Edit halaman ini di GitHub",
    },

    sidebar: [
      {
        text: "Get Started",
        collapsed: true,
        items: [
          { text: "Installation", link: "/document/getstarted/Installation" },
          {
            text: "Extention VScode",
            link: "/document/getstarted/ExtentionVScode",
          },
          //{ text: "Installation", link: "/document/getstarted/Installation" },
        ],
      },
      {
        text: "Basic",
        collapsed: true,
        items: [
          { text: "Routing", link: "/document/basic/routing" },
          { text: "Controller", link: "/document/basic/controller" },
          { text: "View", link: "/document/basic/view" },
          { text: "Blade", link: "/document/basic/blade" },
          { text: "Request", link: "/document/basic/request" },
          { text: "Response", link: "/document/basic/response" },
          { text: "Middleware", link: "/document/basic/middleware" },
          { text: "CSRF Token", link: "/document/basic/csrf" },
          { text: "Validation", link: "/document/basic/validation" },
          { text: "Error Handling", link: "/document/basic/errorHandling" },
          { text: "Logging", link: "/document/basic/logging" },
          { text: "Session", link: "/document/basic/session" },
          { text: "Url Regeneration", link: "/document/basic/urlRegeneration" },
          { text: "Asset Building", link: "/document/basic/AssetBuilding" },
        ],
      },
      {
        text: "Deeper",
        collapsed: true,
        items: [
          { text: "Artisan Console", link: "/document/deeper/artisanConsole" },
          { text: "Broadcasting", link: "/document/deeper/broadcasting" },
          { text: "Cache", link: "/document/deeper/cache" },
          { text: "Collection", link: "/document/deeper/collection" },
          { text: "Concurrency", link: "/document/deeper/Concurrency" },
          { text: "Context", link: "/document/deeper/context" },
          { text: "Contracts", link: "/document/deeper/contracts" },
          { text: "Event", link: "/document/deeper/event" },
          { text: "File Storage", link: "/document/deeper/filestorage" },
          { text: "Helper", link: "/document/deeper/helper" },
          { text: "Http Client", link: "/document/deeper/httpClient" },
          { text: "Localization", link: "/document/deeper/localization" },
          { text: "Mail", link: "/document/deeper/mail" },
          { text: "Notification", link: "/document/deeper/notification" },
          {
            text: "package Development",
            link: "/document/deeper/packageDevelopment",
          },
          { text: "Process", link: "/document/deeper/process" },
          { text: "Queue", link: "/document/deeper/queue" },
          { text: "Rate Limiting", link: "/document/deeper/rateLimiting" },
          { text: "String", link: "/document/deeper/string" },
          { text: "Task Schedule", link: "/document/deeper/taskSchedule" },
        ],
      },
      {
        text: "Databse",
        collapsed: true,
        items: [
          {
            text: "Getting Started",
            link: "/document/database/getting-started",
          },
          { text: "Query Builder", link: "/document/database/query-builder" },
          { text: "Pagination", link: "/document/database/pagination" },
          { text: "Migration", link: "/document/database/migration" },
          { text: "Seeder", link: "/document/database/seeding" },
          { text: "Redis", link: "/document/database/redis" },
          { text: "MongoDB", link: "/document/database/mongoDB" },
        ],
      },
      {
        text: "Eloquent",
        collapsed: true,
        items: [
          { text: "Eloquent", link: "/document/eloquent/get-started" },
          { text: "Relationships", link: "/document/eloquent/relationships" },
          { text: "Collection", link: "/document/eloquent/collection" },
          { text: "Mutator", link: "/document/eloquent/mutator" },
          { text: "API Resources", link: "/document/eloquent/api-resources" },
          { text: "Serialization", link: "/document/eloquent/serialization" },
          { text: "Factories", link: "/document/eloquent/factories" },
        ],
      },
      {
        text: "Testing",
        collapsed: true,
        items: [],
      },
    ],

    // Konfigurasi sidebar kanan (outline/daftar isi) yang diperbaiki
    outline: {
      level: [2, 6], // <--- 'level' harus berada di dalam objek
      label: "Daftar Isi Halaman",
    },

    search: {
      provider: "local",
    },

    footer: {
      message: "Dirilis di bawah Lisensi MIT.",
      copyright: "Hak Cipta © 2025, Muhammad Alif Musthofa - Chat GPT",
    },
  },
});
