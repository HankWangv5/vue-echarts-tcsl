import ResizeObserver from 'resize-observer-polyfill';
import Vue from 'vue';

const isServer = typeof window === 'undefined';

const resizeHandler = function (entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn(entry);
      });
    }
  }
};

const addResizeListener = function (element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

const removeResizeListener = function (element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};

Vue.prototype.addResizeListener = addResizeListener;
Vue.prototype.removeResizeListener = removeResizeListener;
