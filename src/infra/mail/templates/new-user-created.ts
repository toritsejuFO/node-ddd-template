export default (data: any): string => {
  const activationLink = `http://localhost:4300/user/activate?token=${
    data.activationToken || 'dummytoken'
  }`

  return `
  <p>Hi ${data.firstname},</p>

  <p>Use the link below to activate your account</p>

  <a href="${activationLink}">${activationLink}</a>

  <p>Yours faithfully,</p>
  <p>${process.env.APP_NAME} Team</p>
  `
}
