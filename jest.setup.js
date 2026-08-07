// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Stubs required by framer-motion in jsdom
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver =
  global.IntersectionObserver || MockIntersectionObserver
global.ResizeObserver = global.ResizeObserver || MockResizeObserver
