import 'dotenv/config';
import nodemailer from 'nodemailer';
import { IUserOrderForEmail } from '../types';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmails = ({
  userEmail,
  name,
  orders,
}: {
  userEmail: string;
  name: string;
  orders: IUserOrderForEmail[];
}) => {
  if (!Array.isArray(orders)) {
    console.error('Error: orders is not an array', orders);
    return;
  }

  const orderDetailsHtml = orders
    .map((order) => {
      const imageTags = order.images
        .map((url) => `<img src="${url}" alt="Product Image" width="200"/>`)
        .join('<br>');

      return `
        <h3>Товар: ${order.productName}</h3>
        <ul>
          <li>Цена за единицу: ${order.productPrice} руб.</li>
          <li>Количество: ${order.quantity} шт.</li>
          <li>Общая сумма: ${order.total_price} руб.</li>
          <li>ID продукта: ${order.productId}</li>
        </ul>
        <h4>Изображения товара:</h4>
        ${imageTags}
        <hr/>
      `;
    })
    .join('');

  const totalAmount = orders.reduce((sum, order) => sum + order.total_price, 0);

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || 'defaultAdmin@example.com', // Configurable admin email
    subject: 'Новый заказ',
    html: `
      <h2>Заказ от пользователя: ${userEmail} - ${name.toUpperCase()}</h2>
      <p><strong>Суммарные подробности заказа:</strong></p>
      ${orderDetailsHtml}
      <p><strong>Итоговая сумма всех заказов:</strong> ${totalAmount} руб.</p>
    `,
  };

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Ваш заказ принят',
    html: `
      <h1>Electronic Elephant :)</h1>
      <p>Спасибо за ваш заказ, ${name.toUpperCase()}!</p>
      ${orderDetailsHtml}
      <p><strong>Итоговая сумма всех заказов:</strong> ${totalAmount} руб.</p>
      <p>Мы свяжемся с вами для подтверждения заказа.</p>
    `,
  };

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error(`Ошибка отправки письма админу: ${error}`);
    } else {
      console.log(`Письмо админу отправлено: ${info.response}`);
    }
  });

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error(`Ошибка отправки письма пользователю: ${error}`);
    } else {
      console.log(`Письмо пользователю отправлено: ${info.response}`);
    }
  });
};

export default sendOrderEmails;
