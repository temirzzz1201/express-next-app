'use client';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { useState, Suspense, useCallback, useMemo } from 'react';
import AppContainer from '@/components/app-container';
import CartItem from '@/components/cart-item';
import CartSummary from '@/components/cart-summary';
import { useCart } from '@/hooks/useCart';
import dynamic from 'next/dynamic';

const AppModal = dynamic(() => import('@/components/app-modal'), {
  ssr: false,
});

const Busket = () => {
  const {
    cartItems,
    updateQuantity,
    removeProduct,
    clearCartItems,
    placeCartOrder,
  } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIncrement = useCallback(
    // @ts-ignore: should type products
    (item) => {
      if (item.quantity < item.product.stock) {
        updateQuantity(item.id, item.quantity + 1);
      }
    },
    [updateQuantity]
  );

  const handleDecrement = useCallback(
    // @ts-ignore: should type products
    (item) => {
      if (item.quantity > 0) {
        updateQuantity(item.id, item.quantity - 1);
      }
    },
    [updateQuantity]
  );

  const totalQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const handleOrder = () => {
    if (totalQuantity > 0) {
      placeCartOrder();
      setIsModalOpen(true);
    }
  };

  const handleClearOrder = () => {
    if (totalQuantity !== 0) {
      clearCartItems();
    }
  };

  return (
    <AppContainer title="Оформление заказа" myClass="justify-center">
      <Suspense fallback={<Box as="div">Загрузка...</Box>}>
        <AppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Заказ оформлен"
          modalSize="xl"
        >
          {cartItems.map((item) => (
            <Box key={item.id} p="10px">
              <Box fontWeight="semibold">Товар: {item.product?.name}</Box>
              <Box>Количество: {item.quantity}</Box>
              <Box>Цена: {item.product?.price} руб.</Box>
            </Box>
          ))}
        </AppModal>
      </Suspense>
      <Stack
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: '3', md: '5' }}
        mb="5"
        align="stretch"
      >
        <CartSummary
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          onOrder={handleOrder}
          onClear={handleClearOrder}
        />
        <Box w="100%">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box mb="5" key={item.id}>
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={() => handleIncrement(item)}
                  onDecrement={() => handleDecrement(item)}
                  onRemove={() => removeProduct(item.id)}
                />
              </Box>
            ))
          ) : (
            <Heading size="lg" textAlign="center">
              Корзина пуста!
            </Heading>
          )}
        </Box>
      </Stack>
    </AppContainer>
  );
};

export default Busket;
