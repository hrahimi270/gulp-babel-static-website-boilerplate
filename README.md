# Gulp static site-generator

With this project, you can create stunning website with modern Javascript (ES6) and CSS or SCSS.

# Features

  - Live server (auto reload the page)
  - tree-shaking (What is tree-shaking?)
  - Using CSS or SCSS
  - autoprefix and preprocessor styles
  - import modules or packages from node_modules
  - hash the filenames after final build
  - watching files for any change
  - inject css and js to html pages

I used browserify for bundle the Javsscript and Gulp.js for managing tasks.

## How to use

It's easy! Clone the project in first step.
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

