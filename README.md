# Gulp static site-generator

With this project, you can create stunning website with modern Javascript (ES6) and CSS or SCSS.

# Features

  - Live server and auto-reload
  - tree-shaking ([What is tree-shaking?](https://medium.com/@netxm/what-is-tree-shaking-de7c6be5cadd))
  - Using CSS or SCSS
  - Autoprefix and preprocessor styles
  - Import modules or packages from node_modules
  - Hash the filenames after final build
  - Watching files for any change
  - Inject css and js to html pages

I used [browserify](http://browserify.org/) for bundle the Javsscript and [Gulp.js](https://gulpjs.com/) for managing tasks.

## How to use

It's easy! Clone the project in first step.
```sh
git clone https://github.com/hrahimi270/gulp-babel-static-website-boilerplate.git
```
There is only **one** folder that you need to edit for your self, the `src` folder!
You can see the full structire below:
```
your-project
├── README.md
├── node_modules
├── package.json
├── yarn.lock
├── .babelrc
├── .eslintrc.json
├── .gitignore
├── gulpfile.js
├── build (appears after runing project!)
└── src
    ├── css
    └── scss
        ├── main.scss
        ├── other-file.scss
    └── js
```

### CSS Folder
All css files in this folder, merges into one css file that named `styles-customized.css`.
And it will placed at `build/css` folder.
You can use it as your second way to customize styles for your project.

### SCSS Folder
This folder contains a `main.scss` file.
**Note**: don't delete this file.
You can use this file for your scss styles in this file.
You can also import other scss files from `node_modules` or other `.scss` files.

### JS Folder
This file contains a `index.js` file.
**Note:** Don't delete this file.
You can write your js code in this file.
You can also import js files from `node_modules` or other `.js` files.

## License
This project is under MIT License.

