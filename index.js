import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'node-html-parser';
import { optimize } from 'svgo';

module.exports = (options) => {
  return {
    name: 'my-svg-plugin',
    async transformIndexHtml(html) {
      return new Promise(async (resolve, reject) => {
        const root = parse(html);

        const tag = options.tag || 'svg';
        const attr = options.attr || 'src';
        const cwd = options.cwd || process.cwd();
        const svgo = options.svgo || {
          plugins: [
            "removeDimensions",
            "removeXMLNS"
          ]
        };

        root.querySelectorAll(tag).forEach(node => {
          const filePath = join(cwd, node.getAttribute(attr));

          try {
            let svgContent = readFileSync(filePath, 'utf-8');

            // Optimize the SVG content
            const optimizedSvg = optimize(svgContent, svgo);

            svgContent = optimizedSvg.data;
            const svgRoot = parse(svgContent, { script: true });

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