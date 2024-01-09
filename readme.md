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
<svg viewBox="0 0 183 183" fill="none" class="img-fluid view-animation animated"><circle opacity="0.2" cx="91.6048" cy="91.2669" r="91.0989" fill="#4AC186"></circle><circle cx="91.6051" cy="91.2662" r="62.1129" fill="#4AC186"></circle><path d="M112.311 92.302L81.2541 110.232L81.2541 74.3715L112.311 92.302Z" fill="white"></path></svg>
```