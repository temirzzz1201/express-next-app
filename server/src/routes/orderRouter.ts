import { Router, Request, Response } from 'express';
import { Order, User, Product, Images } from '../models/index';
import sendOrderEmails from '../utils/nodemailer';

const router = Router();

router.get('/get-all', async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

router.get('/get-user-order', async (req: Request, res: Response) => {
  const { userId } = req.query;
  console.log('User ID: ', userId);

  try {
    const userOrders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'description'],
          include: [
            {
              model: Images,
              as: 'images',
              attributes: ['imageUrl'],
            },
          ],
        },
      ],
    });

    res.json(userOrders);
  } catch (error) {
    console.error(`Error: ${error}`);
    res
      .status(500)
      .json({ message: 'Ошибка при получении заказов пользователя' });
  }
});

// router.post('/create-order', async (req: any, res: any) => {
//   try {
//     const { quantity, total_price, userId, productId } = req.body;

//     const user = await User.findOne({ where: { id: userId } });
//     const product = await Product.findOne({
//       where: { id: productId },
//       include: [
//         {
//           model: Images,
//           as: 'images',
//           attributes: ['imageUrl'],
//         },
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     if (product.stock < quantity) {
//       return res.status(400).json({ error: 'Not enough stock available' });
//     }

//     const newOrder = await Order.create({
//       quantity,
//       total_price,
//       userId,
//       productId,
//     });

//     await product.update({ stock: product.stock - quantity });

//     const orderDetails = {
//       quantity,
//       total_price,
//       userId,
//       productId,
//       productName: product.name,
//       productPrice: product.price,
//       // @ts-ignore:next-line
//       images: product.images.map((image: any) => image.imageUrl),
//     };

//     sendOrderEmails({
//       userEmail: user!.email,
//       name: user!.username,
//       orderDetails,
//     });

//     res.json(newOrder);
//   } catch (error) {
//     console.error(`Error: ${error}`);
//     res.status(500).json({ error: 'Failed to create order' });
//   }
// });

router.post('/create-order', async (req: any, res: any) => {
  try {
    const { quantity, total_price, userId, productId } = req.body;

    // Проверка, существует ли пользователь
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Проверка, существует ли продукт
    const product = await Product.findOne({
      where: { id: productId },
      include: [
        {
          model: Images,
          as: 'images',
          attributes: ['imageUrl'],
        },
      ],
    });
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product with ID ${productId} not found` });
    }

    // Проверка на достаточное количество на складе
    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ error: `Not enough stock for product ID ${productId}` });
    }

    // Создание заказа
    const newOrder = await Order.create({
      quantity,
      total_price,
      userId,
      productId,
    });

    // Обновление количества товара на складе
    await product.update({ stock: product.stock - quantity });

    // Детали заказа
    const orderDetails = {
      quantity,
      total_price,
      userId,
      productId,
      productName: product.name,
      productPrice: product.price,
      // @ts-ignore:next-line
      images: product.images.map((image: any) => image.imageUrl),
    };

    // Отправка письма с деталями заказа
    sendOrderEmails({
      userEmail: user.email,
      name: user.username,
      // @ts-ignore:next-line
      orders: [orderDetails], // оборачиваем в массив, чтобы сохранить формат
    });

    console.log('Order details:', orderDetails);

    res.json({ success: true, order: orderDetails });
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
