import 'dotenv/config'
import nodemailer from 'nodemailer';

interface IOrderDetails {
  quantity: number, 
  total_price: number, 
  userId: number,
  productId: number,
}

interface IUserOrder {
  orderDetails: IOrderDetails
  userEmail: string
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderEmails = ({userEmail, orderDetails }: IUserOrder) => {

  const formattedOrderDetails = `
    Заказ от пользователя: ${userEmail}

    Подробности заказа:
    - Количество: ${orderDetails.quantity}
    - Общая сумма: ${orderDetails.total_price} руб.
    - ID пользователя: ${orderDetails.userId}
    - ID продукта: ${orderDetails.productId}
  `;

  const adminMailOptions = {
    from: 'your-shop-email@gmail.com',
    to: 'temir1201@gmail.com',
    subject: 'Новый заказ',
    text: formattedOrderDetails
  };

  const userMailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Ваш заказ принят',
    text: `
      Electronic Elephant:)
      
      Спасибо за ваш заказ!

      Подробности заказа:
      - Количество: ${orderDetails.quantity}
      - Общая сумма: ${orderDetails.total_price} руб.
      - ID продукта: ${orderDetails.productId}
      
      Мы свяжемся с вами для подтверждения заказа.
    `
  };

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to admin: ${error}`);
    } else {
      console.log(`Admin email sent: ${info.response}`);
    }
  });

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to user: ${error}`);
    } else {
      console.log(`User email sent: ${info.response}`);
    }
  });
};


export default sendOrderEmails;