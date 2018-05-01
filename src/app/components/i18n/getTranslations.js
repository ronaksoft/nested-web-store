const fs = require('fs');
const glob = require('glob');

const openTag = '<Translate>'
const closeTag = '</Translate>'
const openFunction = '_getText(\'';
const closeFunction = '\'\)';

module.exports = {
    extract: (regexp, output, languages) => {
        glob(regexp, (err, files) => {
          if (err) console.log(err)
          files.map(file => {
            let data = fs.readFileSync(file, 'utf8')
            let regexp = /<Translate>.[^<>]*<\/Translate>/g
            let regexp2 = /_getText\(\'.*\'\)/g
            let results = data.match(regexp)
            let results2 = data.match(regexp2)
            if (results) {
              let texts = getTexts(results, languages)
              if (fs.existsSync(output)) {
                addNewTranslations(output, texts)
              } else {
                createTranslationsFile(output, texts)
              }
            }
            if (results2) {
              let texts = getTextsFunctions(results2, languages);
              if (fs.existsSync(output)) {
                addNewTranslations(output, texts)
              } else {
                createTranslationsFile(output, texts)
              }
            }
          })
        })
    }
} 

function getTexts(results, languages){
  let texts = {}
  results.map(result => {
    let openTagPosition = result.indexOf(openTag)
    let closeTagPosition = result.indexOf(closeTag)
    let text = result.substr(openTagPosition + openTag.length, closeTagPosition - (closeTag.length - 1))
    texts[text] = addLanguages(languages)
  })
  return texts
}

function getTextsFunctions(results, languages){
  let texts = {}
  results.map(result => {
    let openTagPosition = result.indexOf(openFunction)
    let closeTagPosition = result.indexOf(closeFunction);
    let text = result.substr(openTagPosition + openFunction.length, closeTagPosition - 10)
    texts[text] = addLanguages(languages);
  })
  return texts
}

function addLanguages(languages) {
  if (languages && languages.length) {
    let object = {}
    languages.map(language => {
      object[language] = ""
    })
    return object
  } else {
    return {}
  }
}

function createTranslationsFile(output, texts) {
  const template = JSON.stringify(texts, null, 2)
  fs.writeFileSync(output, template)
  console.log('Translations file created!')
}

function addNewTranslations(output, texts) {
  let data = fs.readFileSync(output, 'utf8')
  const translationsFile = JSON.parse(data);
  let newKeysText = Object.keys(texts)
  newKeysText.map(key => {
    if (!translationsFile[key]) {
      translationsFile[key] = texts[key]
    }
  })
  const template = JSON.stringify(translationsFile, null, 2)
  fs.writeFileSync(output, template)
  console.log('New translations added to translation file!')
}