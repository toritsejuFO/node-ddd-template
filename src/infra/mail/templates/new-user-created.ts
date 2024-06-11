export default (data: any) => {
  const activationLink = `http://localhost:4300/user/activate?token=${
    data.token || 'dummytoken'
  }`

  return `
  <p>Hi ${data.firstName},</p>

  <p>Use the link below to reset your mail</p>

  <a href="${activationLink}">${activationLink}</a>

  <p>Yours faithfully,</p>
  <p>node-ddd-template team</p>
  `
}
