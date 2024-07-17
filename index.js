const fs = require('fs').promises;
const path = require('path');
const nodeHtmlParser = require('node-html-parser');
const { optimize } = require('svgo');

module.exports = (options) => {
  return {
    name: 'vite-plugin-svg-inline',
    async transformIndexHtml(html) {
      try {
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

        const nodes = root.querySelectorAll(tag);
        // console.log(`Found ${nodes.length} ${tag} tags`);

        await Promise.all(nodes.map(async (node) => {
          const src = node.getAttribute(attr);
          if (!src) {
            console.log(`Skipping node without ${attr} attribute`);
            return;
          }

          const filePath = path.join(cwd, src);
          try {
            const svgContent = await fs.readFile(filePath, 'utf-8');

            // Optimize the SVG content
            const optimizedSvg = await optimize(svgContent, svgoOptions);

            const svgRoot = nodeHtmlParser.parse(optimizedSvg.data, { script: true });
            const svgElement = svgRoot.querySelector('svg');

            if (svgElement) {
              // Set the original class attribute if it exists
              const originalClass = node.getAttribute('class');
              if (originalClass) {
                svgElement.setAttribute('class', originalClass);
              }

              // Capture and set width and height attributes
              const width = node.getAttribute('width');
              const height = node.getAttribute('height');
              if (width) svgElement.setAttribute('width', width);
              if (height) svgElement.setAttribute('height', height);

              node.replaceWith(svgElement.toString());
              // console.log(`Replaced SVG content from ${filePath}`);
            } else {
              console.error(`SVG element not found in optimized content for file at ${filePath}`);
            }
          } catch (error) {
            console.error(`Error processing SVG file at ${filePath}:`, error);
          }
        }));

        return root.toString();
      } catch (error) {
        console.error('Error during transformIndexHtml:', error);
        throw error;
      }
    }
  };
};
