export default (template: string, data: any) => {
  return require(`./templates/${template}`)(data)
}
