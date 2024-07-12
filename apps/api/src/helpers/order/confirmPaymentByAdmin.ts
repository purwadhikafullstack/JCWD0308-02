import { prisma } from "@/db.js";
import { transporter } from "@/helpers/nodemailers.js";
import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { OrderStatus } from "@prisma/client";
import { fileURLToPath } from "url";

type ISendEmailVerifyProps = { id?: number; isActive?: boolean; displayName?: string; email: string; token: String };
type ISendEmailVerify = (props: ISendEmailVerifyProps) => Promise<void>;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const getOrderWithUser = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { stock: { include: { product: true } } } }, user: true },
  });
};

export const getEmailTemplate = (templateName: string, context: any) => {
  const templatePath = path.join(__dirname, "../../template", templateName);
  console.log("template path:", templatePath);
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateSource);
  return compiledTemplate(context);
};

export const sendConfirmationEmail = async (userEmail: any, subject: string, html: string) => {
  console.log("userEmail:", userEmail);
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: userEmail,
    subject,
    html,
  });
};

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: newStatus },
  });
};
