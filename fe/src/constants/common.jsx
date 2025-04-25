import { CiCircleInfo } from 'react-icons/ci';
import { MdOutlineTitle } from 'react-icons/md';
import { PiUserListThin } from 'react-icons/pi';
import { FaLocationArrow } from 'react-icons/fa';
import { MdFamilyRestroom } from 'react-icons/md';
import { MdRememberMe } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa6';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import { IoChatboxEllipses } from 'react-icons/io5';

export const NavMenuTitle = {
  PROFILE: {
    title: 'Profile',
    key: '/product',
    icon: <CiCircleInfo />,
  },
  PRODUCT_MANAGEMENT: {
    title: 'Product Management',
    key: '/product',
    icon: <FaLocationArrow />,
  },
};

export const authMessage = {
  LOGIN_SUCCESS: 'Login success',
  LOGIN_FAIL: 'Login Failed',
  LOGOUT_SUCCESS: 'Logout success',
  AUTH_NOT_ALLOW: 'Auth not allow',
  REFRESH_TOKEN_EXPIRED: 'Login expired',
  REGISTER_SUCCESS: 'Register success',
  REGISTER_FAIL: 'Register failed',
};

export const EXCLUDE_MEMBER = {
  OWNER: 'owner',
  MEMBER: 'member',
};

export const USER_ERRORS = {};

export const PERMISSIONS_CONST = {};
