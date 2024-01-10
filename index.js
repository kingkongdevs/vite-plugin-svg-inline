const fs = require('fs');
const path = require('path');
const nodeHtmlParser = require('node-html-parser');
const svgo = require('svgo');

module.exports = (options) => {
  return {
    name: 'vite-plugin-svg-inline',
    async transformIndexHtml(html) {
      return new Promise(async (resolve, reject) => {
        const root = nodeHtmlParser.parse(html);

        const tag = options.tag || 'svg';
        const attr = options.attr || 'src';
        const cwd = options.cwd || process.cwd();
        const svgoOptions = options.svgo || {
          plugins: [
            "removeDimensions",
            "removeXMLNS"
          ]
        };

        root.querySelectorAll(tag).forEach(node => {
          const filePath = path.join(cwd, node.getAttribute(attr));

          try {
            let svgContent = fs.readFileSync(filePath, 'utf-8');

            // Optimize the SVG content
            const optimizedSvg = svgo.optimize(svgContent, svgoOptions);

            svgContent = optimizedSvg.data;
            const svgRoot = nodeHtmlParser.parse(svgContent, { script: true });

            const originalClass = node.getAttribute('class');
            if (originalClass) {
              svgRoot.firstChild.setAttribute('class', originalClass);
            }

            node.replaceWith(svgRoot.firstChild.toString());
          } catch (error) {
            console.error(`Error reading or optimizing SVG file at ${filePath}:`, error);
          }
        });

        resolve(root.toString());
      });
    }
  };
};
