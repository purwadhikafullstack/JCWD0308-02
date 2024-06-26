import { prisma } from '@/db.js';
import { transporter } from '@/helpers/nodemailers.js';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { OrderStatus } from '@prisma/client';
export const getOrderWithUser = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
};

export const getEmailTemplate = (templateName: string, context: any) => {
  const templatePath = path.join(__dirname, '../template', templateName);
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const compiledTemplate = handlebars.compile(templateSource);
  return compiledTemplate(context);
};

export const sendConfirmationEmail = async (
  userEmail: any,
  subject: string,
  html: string,
) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: userEmail,
    subject,
    html,
  });
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
) => {
  await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: newStatus },
  });
};
