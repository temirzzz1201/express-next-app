'use client';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { register } from '@/actions/clientActions';
import {
  FormControl,
  FormLabel,
  Button,
  FormHelperText,
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IFormValues } from '@/types';
import AppContainer from '@/components/app-container';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Too Short!')
    .max(50, 'Too Long!')
    .required('name is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('password is required'),
  email: Yup.string().email('Invalid email').required('email is required'),
});

export default function Register() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((store) => store.auth);
  const toast = useToast();

  return (
    <AppContainer title="Страница регистрации" myClass="justify-center">
      <FormControl className="max-w-[500px]">
        <FormLabel fontSize="24px" mb="5" color="blue.600">
          Пожалуйста зарегестрируйтесь
        </FormLabel>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values: IFormValues) => {
            dispatch(register(values))
              .then((val) => {
                // @ts-ignore: can be undefined
                const username = val?.payload?.user?.username;
                if(username) {
                  toast({
                    title: `Вы успешно зарегестрировались, ${username}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                  });
                }
                else {
                  toast({
                    // @ts-ignore: error oblect problem
                    title: error,
                    status: 'error',
                    duration: 3000,
                    isClosable: false,
                  });
                }
              })
              .catch((error) => {
                toast({
                  title: error.payload || 'Упс... Что-то пошло не так!',
                  status: 'error',
                  duration: 3000,
                  isClosable: false,
                });
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col">
              <Field
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                className="border rounded-sm mb-2 h-10 p-1"
                placeholder="Имя"
              />
              <small className="text-red-700">
                {errors.username && touched.username && errors.username}
              </small>
              <Field
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className="border rounded-sm mb-2 h-10 p-1"
                placeholder="Эл.почта"
              />
              <small className="text-red-700">
                {errors.email && touched.email && errors.email}
              </small>
              <Field
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="border rounded-sm mb-4 h-10 p-1"
                placeholder="Пароль"
              />
              <small className="text-red-700">
                {errors.password && touched.password && errors.password}
              </small>
              <Button
                mt={4}
                isLoading={isLoading}
                loadingText="Submitting"
                colorScheme="teal"
                variant="outline"
                type="submit"
              >
                Зарегестрироваться
              </Button>
              <FormHelperText>
                Есть аккаунт?{' '}
                <Link className="underline" href="/login">
                  авторизация
                </Link>
              </FormHelperText>
            </Form>
          )}
        </Formik>
      </FormControl>
    </AppContainer>
  );
}
