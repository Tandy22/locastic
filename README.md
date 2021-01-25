# Locastic web shop

## Setup the project
Execute `npm install` to install packages defined in `package.json` file.

## Running the project
### Production
Execute `npm run build:css` to run CSS optimization pipeline and generate final CSS file/s.
Open `Index.html` or `Workshop.html` to see web pages using this/these file/s.
### Development
While developing (changing the code), execute `npm run watch:sass` to run SASS compiler on each `*.scss` file change and keep it running. 
It's good to have live server installed, so each execution of SASS compiler automatically refreshes web page/s.
### NPM options
Run `npm run` command to see all SASS/CSS commands that are used for optimizing and generating final CSS file/s.
