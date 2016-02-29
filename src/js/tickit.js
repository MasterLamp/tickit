/**
 * @name tickit
 * @overview A basic ticker that uses CSS animations & vanilla JavaScript.
 * @version 0.0.0
 * @author Jon Chretien
 * @license MIT
 */
(() => {
  /**
   * @param {Object} config - Tickit configuration values.
   * @param {array} config.data - The text to display.
   * @param {string} config.selector - The id for the container element.
   * @param {number} config.duration - The animation duration.
   * @param {number} config.initialPos - The initial offset position.
   * @param {string} config.behavior - The user interaction behavior.
   */
  const Tickit = (config) => {
    const {data, duration, behavior, initialPos, selector} = config;
    const tickit = document.querySelector(selector)
    const tickitInner = tickit.querySelector('.js-tickit-inner');
    const transitionIn = 0;
    const transitionOut = -initialPos;
    const classNames = ['tickit-text', 'js-tickit-text'];

    let counter = 0;
    let hasStarted = false;
    let isAnimating = false;
    let isClickActivated = false;
    let isTickitVisible = false;
    let tickitText = null;

    /**
     * Initialize logic.
     *
     * @api private
     */
    function init() {
      attachEvents();
      addText();
      draw();
    }

    /**
     * Attaches event handlers.
     *
     * @api private
     */
    function attachEvents() {
      if (config.behavior === 'click') {
        tickitInner.addEventListener('click', handleClickEvent, false);
      }
      tickitInner.addEventListener('transitionend', handleTransitionEndEvent, false);
    }

    /**
     * Handles click events.
     *
     * @param {Object} event - The event triggered.
     */
    function handleClickEvent(event) {
      if (!isAnimating && event.target && event.target.nodeName.toLowerCase() === 'div') {
        isClickActivated = true;
        hideTickit();
        return false;
      }
    }

    /**
     * Handles transition end events.
     *
     * @param {Object} event - The event triggered.
     */
    function handleTransitionEndEvent(event) {
      if (event.target && event.target.nodeName.toLowerCase() === 'div') {
        if (!isTickitVisible) {
          removeText();
          addText();
        }

        requestAnimationFrame(draw);
      }
    }

    /**
     * Adds text element.
     */
    function addText() {
      const el = document.createElement('div');
      el.className = classNames.join(' ');
      el.style.transform = setTransform(initialPos);
      tickitInner.appendChild(el);
      tickitText = tickitInner.querySelector(`.${classNames[1]}`);
    }

    /**
     * Removes text element.
     */
    function removeText() {
      tickitInner.removeChild(tickitText);
    }

    /**
     * Hides text container.
     */
    function hideTickit() {
      isAnimating = true;
      isTickitVisible = false;
      tickitText.style.transform = setTransform(transitionOut);
    }

    /**
     * Reveals text container.
     */
    function showTickit() {
      isAnimating = true;
      isTickitVisible = true;
      tickitText.style.transform = setTransform(transitionIn);
    }

    /**
     * Sets 3D transform value on text.
     *
     * @param {Number} position - Position
     */
    function setTransform(position) {
      return `translate3d(0, ${position}px, 0)`;
    }

    /**
     * Handles animation frame based on behavior.
     */
    function draw() {
      const timer = setTimeout(() => {
        if (!isClickActivated && isTickitVisible && config.behavior === 'click' || isTickitVisible && isClickActivated) {
          isAnimating = false;
          clearTimeout(timer);
          return;
        }

        if (!isTickitVisible) {
          tickitText.textContent = data[counter++ % data.length];
          showTickit();
          return;
        }

        if (isTickitVisible) {
          hideTickit();
        }
      }, duration);
    }

    return { init };

  };

  /**
   * Expose `Tickit`.
   */
  if (typeof define === 'function' && define.amd) {
    define(Tickit);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = Tickit;
  } else {
    window.Tickit = Tickit;
  }

})();
