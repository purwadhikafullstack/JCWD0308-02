import dotenv from 'dotenv';
dotenv.config();

export async function getPaymentLink(data: any) {
  const secret = process.env.MIDTRANS_SERVER_KEY as string;
  const encededSecret = Buffer.from(secret).toString('base64');
  const basicAuth = `Basic ${encededSecret}`;
  const response = await fetch(`${process.env.MIDTRANS_PUBLIC_API}`, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': 'true',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: basicAuth,
    },
    body: JSON.stringify(data),
  });
  const paymentLink = await response.json();
  return paymentLink;
}
