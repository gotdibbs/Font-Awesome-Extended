## Font Awesome Extended

### Background
This repository was created as a result of my [PR#6950](/FortAwesome/Font-Awesome/pull/6950) against Font-Awesome being closed for completely valid reasons. That crew clearly knows their stuff.

However, I decided that in case anyone else needed access to the palm tree icon or any other icon in the [Miscellaneous Symbols and Pictographs](http://unicode.org/charts/PDF/U1F300.pdf) unicode block that I would whip up a quick repository to contain a complete set of extension classes for Font Awesome that would allow users to utilize this extended set of icons.

Please note that these icons and classes are **untested** by yours truly and therefore they may not work in some and/or all browsers. 

### Usage

1. Download the CSS file `css\font-awesome-x.css` or `css\font-awesome-x.min.css` from this repository.
2. Reference it after Font Awesome.
3. Use the extension classes as you would any other Font Awesome class such as `<i class="fa fax-palm-tree"></i>`. All the names will be as per the unicode spec but with spaces replaced with hyphens.
4. Profit.

### Build

The build is setup to run on invocation of Visual Studio Code's build command, but you can also just run `node src\scrape.js`. 

### Contributing

Pull requests speak louder than issues, but feel free to submit either and we'll talk it out.

