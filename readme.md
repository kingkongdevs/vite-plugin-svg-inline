# Vite Plugin SVG Inline

## What it does
Replaces tags referencing your SVG files, with the optimized inlined contents of the SVG. Set the folder your SVGs can be found in, select the tag type and attribute for the svg file url, and the plugin will do the rest.

Keep your HTML clean by only needing to use `<icon src="mysvg.svg">` instead of pasting the entire contents into your project.

Uses [svgo](https://github.com/svg/svgo) to optimize your SVGs.


## Usage
Import `viteInlineSVG` from `@kingkongdevs/vite-plugin-svg-inline`

```
import viteInlineSVG from @kingkongdevs/vite-plugin-svg-inline'
```


Add the viteInlineSVG to your `vite.config.js` file's plugins array:
```
plugins: [
  viteInlineSVG({
    cwd: 'src/assets/images',
    tag: 'icon', 
    attr: 'src'
  })
]
```

## Plugin Options
### cwd
- #### Type: `string`
- #### Default: `'src/assets/images'`
  The directory where your svg files can be found.

### tag
- #### Type: `string`
- #### Default: `'icon'`
  The tag type you would like to use in your HTML to refer to an SVG.

### attr
- #### Type: `string`
- #### Default: `'src'`
  The attribute that contains your svg filename.

### svgo
- #### Type: `object`
- #### Default: 
```
{
  plugins: [
    { removeXMLNS: true },
    { removeViewBox: false },
    { removeDimensions: true },
  ]
}
```
  The svgo options you would like to use.



## Examples

HTML:
```
<icon src="icon-play.svg" class="img-fluid view-animation"></icon>
```

Output: 
```
<picture>
  <source data-srcset="/assets/images/placeholder-320px.webp 320w, /assets/images/placeholder-640px.webp 640w, /assets/images/placeholder-1024px.webp 1024w" type="image/webp" />
  <img data-src="assets/images/placeholder.png" alt="" width="1900" height="1200" class="lazyload" />
</picture>
```