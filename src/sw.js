/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "barley-break.e31bb0bc.js",
    "revision": "6eb3ce4451491524a93ecadb6b6ecc07"
  },
  {
    "url": "bg_1.141129b7.jpg",
    "revision": "3632b4b7483f07fb26cef6ed3e4be6bd"
  },
  {
    "url": "bg_1.5543566c.jpg",
    "revision": "3632b4b7483f07fb26cef6ed3e4be6bd"
  },
  {
    "url": "bg_1.e470eeb8.jpg",
    "revision": "3632b4b7483f07fb26cef6ed3e4be6bd"
  },
  {
    "url": "click.5834803e.mp3",
    "revision": "4447a24b94d37cac308a4eb17b4e3677"
  },
  {
    "url": "icon_3_final.10588865.jpg",
    "revision": "1196f89726a27b81d40eded972acba15"
  },
  {
    "url": "icon_3_final.409897e0.jpg",
    "revision": "1196f89726a27b81d40eded972acba15"
  },
  {
    "url": "icon_3_final.8310df6a.jpg",
    "revision": "1196f89726a27b81d40eded972acba15"
  },
  {
    "url": "index.html",
    "revision": "f24819bf0e2241e6ad4502d5aec3ec78"
  },
  {
    "url": "index.js",
    "revision": "fb42838e594ce14d97e37edcc0ff271a"
  },
  {
    "url": "src.116b915f.js",
    "revision": "a462b4731fc6f33e4e495ea0e4e6a783"
  },
  {
    "url": "src.e31bb0bc.js",
    "revision": "35cdcb6bbfcbeee0468948b4e9dbeb33"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
