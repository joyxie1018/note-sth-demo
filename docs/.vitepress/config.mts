import { defineConfig } from 'vitepress'
import { nav } from './configs/navbar'
import { sidebar } from './configs/sidebar'
import { head } from './configs/head'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/note-sth/',
  title: "讀書筆記",
  description: "記錄一些小東西",
  head,
  themeConfig: {
    logo: '/kirby_icon.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/joyxie1018' }
    ],
    footer: {
      copyright: 'MIT Lincensed | Copyright © 2023-present JoyXie',
    }
  }
})
