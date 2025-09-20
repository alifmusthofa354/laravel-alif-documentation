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
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
      // Anda bisa menambahkan ikon lain seperti 'twitter', 'linkedin', dll.
    ],

    // Tombol untuk mengedit halaman
    editLink: {
      pattern: "https://github.com/vuejs/vitepress/edit/main/docs/:path",
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
        text: "Deeper",
        collapsed: true,
        items: [{ text: "Concurrency", link: "/document/deeper/Concurrency" }],
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
      copyright: "Hak Cipta © 2025, Muhammad Alif Musthofa",
    },
  },
});
