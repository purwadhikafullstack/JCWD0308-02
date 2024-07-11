import { fileURLToPath } from 'url';
import path from "path"
import fs from "fs"
import Handlebars from "handlebars";
import { transporter } from "@/helpers/nodemailers.js";
import { generateId } from "lucia";
import { API_URL, MAIL_USER, WEB_URL } from "@/config.js";

type ISendEmailVerifyProps = { id?: number, isActive?: boolean, displayName?: string, email: string, token: String }
type ISendEmailVerify = (props: ISendEmailVerifyProps) => Promise<void>


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const sendEmailVerification: ISendEmailVerify = async ({ email, token }) => {
  const link = `${WEB_URL}/auth/verify/${token}`

  const templatePath = path.join(__dirname, "../template", "register.html")
  const templateSource = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = Handlebars.compile(templateSource)
  const html = compiledTemplate({
    link
  })

  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject: "Welcome to Grosirun",
    html
  })
}

export const sendResetPassword: ISendEmailVerify = async ({ id, isActive, displayName, email, token }) => {
  const link = `${WEB_URL}/auth/reset/${token}`

  const templatePath = path.join(__dirname, "../template", "reset.html")
  const templateSource = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = Handlebars.compile(templateSource)
  const html = compiledTemplate({
    name: displayName,
    link
  })

  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject: "Reset Password - Grosirun",
    html
  })
}

export const sendChangeEmail: ISendEmailVerify = async ({ id, isActive, displayName, email, token }) => {
  const link = `${WEB_URL}/verify/email/${token}`

  const templatePath = path.join(__dirname, "../template", "change-email.html")
  const templateSource = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = Handlebars.compile(templateSource)
  const html = compiledTemplate({
    name: displayName,
    link
  })

  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject: "Change Email Link - Grosirun",
    html
  })
}