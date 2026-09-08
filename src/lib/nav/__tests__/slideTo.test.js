import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { slideTo } from '@/lib/nav/slideTo';

const push = vi.fn();
const router = { push };

// happy-dom has no View Transitions API, so the direction is never written
// there — the function leaves early and just navigates. Any test about the
// direction has to stand up a browser that can animate.
const canAnimate = () => {
  document.startViewTransition = (cb) => { cb(); return { finished: Promise.resolve() }; };
};

beforeEach(() => {
  push.mockClear();
  delete document.startViewTransition;
  delete document.documentElement.dataset.nav;
});

afterEach(() => {
  delete document.startViewTransition;
});

describe('slideTo', () => {
  it('navigates plainly when the browser has no view transitions', () => {
    slideTo(router, '/sistem', 'down');
    expect(push).toHaveBeenCalledWith('/sistem');
  });

  it('marks the direction on the root element, so the CSS can pick a keyframe', () => {
    canAnimate();
    slideTo(router, '/', 'up');
    expect(document.documentElement.dataset.nav).toBe('up');
  });

  it('marks the other direction too', () => {
    canAnimate();
    slideTo(router, '/sistem', 'down');
    expect(document.documentElement.dataset.nav).toBe('down');
  });

  it('hands the navigation to the browser when it can animate it', () => {
    const run = vi.fn((cb) => { cb(); return { finished: Promise.resolve() }; });
    document.startViewTransition = run;
    slideTo(router, '/', 'up');
    expect(run).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/');
  });

  it('sets the direction before the transition starts, not after', () => {
    // The pseudo-elements are created the moment startViewTransition runs. A
    // direction written afterwards arrives too late and the wrong keyframe runs.
    const seen = { nav: null };
    document.startViewTransition = (cb) => {
      seen.nav = document.documentElement.dataset.nav;
      cb();
      return { finished: Promise.resolve() };
    };
    slideTo(router, '/', 'up');
    expect(seen.nav).toBe('up');
  });

  it('leaves no direction behind when it cannot animate anyway', () => {
    slideTo(router, '/sistem', 'down');
    expect(push).toHaveBeenCalledWith('/sistem');
    expect(document.documentElement.dataset.nav).toBeUndefined();
  });

  it('refuses a direction it does not know, and still navigates', () => {
    canAnimate();
    slideTo(router, '/sistem', 'sideways');
    expect(push).toHaveBeenCalledWith('/sistem');
    expect(document.documentElement.dataset.nav).toBeUndefined();
  });
});
