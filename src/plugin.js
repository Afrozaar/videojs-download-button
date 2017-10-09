import videojs from 'video.js';
const ClickableComponent = videojs.getComponent('ClickableComponent');

// Default options for the plugin.
const defaults = {
  text: 'Download',
  allDownloads: true
};

/**
 * Stack CSS class names.
 * @return {String}
 */
const buildCSSClass = () => {
  return `vjs-download-button-control ${ClickableComponent.prototype.buildCSSClass()}`;
};

/**
 * Function to invoke when the player is ready.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-download-button');

  if (!player.controlBar.childNameIndex_.hasOwnProperty('DownloadButton')) {

    let label = (src) => (options.allDownloads
                          ? `${options.text} (type: ${src.type})`
                          : options.text);

    let sources = options.allDownloads
        ? player.currentSources()
        : [{src: player.currentSrc(), type: player.currentType()}];

    let linkProps = src => ({
      className: buildCSSClass(),
      href: src.src,
      title: label(src),
      download: ''
    });

    let linkAttrs = src => ({
      'aria-live': 'polite',
      'aria-label': label(src)
    });

    sources.forEach(source => {
      player.controlBar.addChild(new ClickableComponent(this, {
        el: ClickableComponent.prototype.createEl('a', linkProps(source), linkAttrs(source))
      }));
    });
  }
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function downloadButton
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const downloadButton = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('downloadButton', downloadButton);

// Include the version number.
downloadButton.VERSION = '__VERSION__';

export default downloadButton;
