var fs = require('fs');
var path = require('path');
function CopyAssetsPlugin() {
}
CopyAssetsPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    init();
  });
};
function init() {
  createIfDoesntExist('./build');
  createIfDoesntExist('./build/public');
  copyFolderRecursiveSync('./src/app/assets/', './build/public/' )
  // copySync('./src/favicon.ico', './build/public/favicon.ico', true);
  // copySync('./src/manifest.json', './build/public/manifest.json', true);
  // copySync('./src/app/assets/images/nested-24.png', './build/public/images/nested-24.png', true);
  // copySync('./src/app/assets/images/nested-48.png', './build/public/images/nested-48.png', true);
  // copySync('./src/app/assets/images/nested-72.png', './build/public/images/nested-72.png', true);
  // copySync('./src/app/assets/images/nested-96.png', './build/public/images/nested-96.png', true);
  // copySync('./src/app/assets/images/nested-144.png', './build/public/images/nested-144.png', true);
  // copySync('./src/app/assets/images/nested-168.png', './build/public/images/nested-168.png', true);
  // copySync('./src/app/assets/images/nested-192.png', './build/public/images/nested-192.png', true);
  // copySync('./src/app/assets/images/nested-512.png', './build/public/images/nested-512.png', true);
  // copySync('./src/app/assets/images/en-logo.png', './build/public/images/en-logo.png', true);
  // copySync('./src/app/assets/images/en-logo@2x.png', './build/public/images/en-logo@2x.png', true);
  // copySync('./src/app/assets/images/fa-logo.png', './build/public/images/fa-logo.png', true);
  // copySync('./src/app/assets/images/fa-logo@2x.png', './build/public/images/fa-logo@2x.png', true);
}
function copySync(src, dest, overwrite) {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
}
function createIfDoesntExist(dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}
module.exports = CopyAssetsPlugin;
