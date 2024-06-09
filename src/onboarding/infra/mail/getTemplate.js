module.exports = (template, data) => {
  return require(`./templates/${template}`)(data)
}
