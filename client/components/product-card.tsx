'use client';

/**
 * TODO
 * разбить на компоненты
 */
import { IProductCardProps } from '@/types';
import {
  Box,
  Badge,
  Heading,
  Text,
  Button,
  HStack,
  Input,
  useNumberInput,
  Tooltip,
  Image as CImage,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { formatDate } from '@/utils/dateHelper';
import { EmblaOptionsType } from 'embla-carousel';
import { capitalize } from '@/utils/capitalize';
import Cookies from 'js-cookie';
import busketSrcOrange from '@/assets/images/purchase_orange.svg';
import { addToCart } from '@/actions/clientActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import OrderActions from './order-actions';
import Link from 'next/link';
import { useInfoMessage } from '@/utils/toastHelper';


const AppModal = dynamic(() => import('@/components/app-modal'), {
  ssr: false,
});

// Динамический импорт карусели без SSR
const EmblaCarousel = dynamic(() => import('./carousel/embla-carousel'), {
  ssr: false,
});

const OPTIONS: EmblaOptionsType = { loop: true };

export default function ProductCard({ product }: IProductCardProps) {
  /* eslint-disable */
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [quantity, setQuantity] = useState<number>(0);
  /* eslint-disable */
  const [stock, setStock] = useState<number>(product.stock);
  const { images } = product;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const showInfoMessage = useInfoMessage();
  

  const imageUrls = images!.map(
    (image) => `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`
  );


  const handleOpenProduct = () => setIsProductModalOpen(true);
  const handleCloseProduct = () => setIsProductModalOpen(false);

  const [userId, setUserId] = useState<string | null>(null);
  const userCookie = Cookies.get('user');

  useEffect(() => {
    if (userCookie) {
      const userFromCookie = JSON.parse(userCookie);
      setUserId(userFromCookie.id);
    }
  }, [userId, userCookie]);

  const handleOrder = () => {
    if (!userCookie) {
      showInfoMessage(
              'top',
              'Авторизуйтесь, чтобы сделать заказ!',
              'warning'
            );
      return;
    }

    if (userId === null) {
      showInfoMessage(
        'top',
        'Ошибка: не удалось получить идентификатор пользователя.',
        'error'
      );
      return;
    }

    const newItem = { userId, productId: product.id.toString(), quantity };

    dispatch(addToCart(newItem))
      .unwrap()
      .then(() => {
        showInfoMessage('top', 'Товар добавлен в корзину!', 'success');
      })
      .catch((error) => {
        showInfoMessage(
          'top',
          'Не удалось добавить товар в корзину',
          'error',
          error.message || 'Ошибка сети'
        );

      });
  };

  const goToBusket = () => {
    router.push('/busket');
  };

  const handleResetQuantity = () => {
    setQuantity(0);
  };

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value: quantity,
      min: 0,
      max: stock,
      onChange: (valueAsString, valueAsNumber) => {
        setQuantity(valueAsNumber);
      },
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <Box className={stock === 0 ? 'pointer-events-none' : 'bg-slate-50'}>
      <Suspense fallback={<Box as="div">Загрузка...</Box>}>
        <AppModal
          modalSize="sm"
          isOpen={isProductModalOpen}
          onClose={handleCloseProduct}
          title={capitalize(product.name)}
        >
          <Box mb="4">
            <EmblaCarousel
              slides={imageUrls}
              options={OPTIONS}
              autoPlayFlag
              imageHeightClass="300"
            />
          </Box>
          <Box mb="4">
            <HStack>
              <Button size="sm" {...dec} isDisabled={stock === 0}>
                -
              </Button>
              <Input
                size="sm"
                {...input}
                textAlign="center"
                isDisabled={stock === 0}
              />
              <Button size="sm" {...inc} isDisabled={stock === 0}>
                +
              </Button>
            </HStack>
          </Box>

          <Box mb="5">
            <OrderActions
              quantity={quantity}
              stock={stock}
              handleOrder={handleOrder}
              handleResetQuantity={handleResetQuantity}
              goToBusket={goToBusket}
            />
          </Box>
        </AppModal>
      </Suspense>

      <Box
        p={4}
        bg={stock === 0 ? 'gray.100' : 'white'}
        borderRadius={10}
        as="article"
        border="1px solid #DCDCDC"
        boxShadow="md"
      >
        <Box mb="3">
          <Link href={`/detail/${product.id}`}>
            <CImage
              h="200px"
              objectFit="contain"
              objectPosition="center center"
              w="100%"
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product?.images[0]?.imageUrl}`}
              alt={`изображение ${product.name}`}
              cursor="pointer"
              loading="lazy"
            />
          </Link>
        </Box>
        <Tooltip label={product.name} aria-label="A tooltip">
          <Heading noOfLines={1} size="l" fontWeight="bold">
            {' '}
            {capitalize(product.name)}{' '}
          </Heading>
        </Tooltip>
        <Badge
          my="2"
          borderRadius="full"
          px="2"
          colorScheme={stock === 0 ? 'red' : 'teal'}
        >
          {' '}
          Осталось {stock} шт.
        </Badge>
        <Tooltip label={product.description} aria-label="A tooltip">
          <Text mb="2" fontSize="md" noOfLines={1}>
            {' '}
            {capitalize(product.description)}{' '}
          </Text>
        </Tooltip>
        <Tooltip label="Добавить в корзину" aria-label="A tooltip">
          <Text
            display="flex"
            justifyContent="space-between"
            cursor="pointer"
            mb="2"
            fontWeight="bold"
            onClick={handleOpenProduct}
            sx={{
              transition: 'color 0.3s ease',
              _hover: {
                color: 'orange',
                fontWeight: 'bold',
              },
            }}
          >
            {' '}
            {product.price} руб.{' '}
            <Image
              className="max-w-[20px] hover:fill-orange-400"
              src={busketSrcOrange}
              alt={busketSrcOrange}
            />
          </Text>
        </Tooltip>

        <Text mb="3" fontSize="xs">
          {' '}
          {formatDate(product.createdAt)}{' '}
        </Text>
      </Box>
    </Box>
  );
}
