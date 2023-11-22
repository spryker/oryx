import { ElementDefinition } from '@spryker-oryx/core';

const icon = (fill = 'white') =>
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 42' fill='${fill}'><g part='symbol' ><path d='M15.5029 38.3474C15.4004 38.416 15.2766 38.4874 15.1497 38.5687C15.0233 38.6458 14.9023 38.7299 14.7873 38.8207C14.6817 38.9009 14.593 38.9982 14.5258 39.1078C14.4681 39.2095 14.4529 39.327 14.483 39.4383C14.483 39.4607 14.4953 39.4803 14.5014 39.5013L14.5243 39.5615L14.5503 39.6217L14.5778 39.6805C14.4953 39.7925 14.4249 39.9088 14.3561 40.0166C14.2945 40.1192 14.224 40.2171 14.1451 40.3092C14.0716 40.3939 13.9787 40.4628 13.8729 40.5109C13.7476 40.5617 13.6106 40.5838 13.4739 40.5753C13.3179 40.5692 13.1636 40.5438 13.0152 40.4997C12.868 40.456 12.7261 40.3987 12.5916 40.3289C12.4514 40.2558 12.3166 40.1744 12.188 40.0852C12.0565 39.9956 11.9265 39.899 11.8011 39.8051C11.8011 39.7897 11.8011 39.7757 11.7904 39.7617C11.7797 39.7477 11.7904 39.7337 11.7797 39.7183C11.769 39.7029 11.7797 39.6903 11.7675 39.6749C11.7552 39.6595 11.7568 39.6455 11.7537 39.6315C11.7173 39.5277 11.6659 39.4287 11.6008 39.3374C11.5325 39.2484 11.4541 39.1663 11.3669 39.0924C11.2788 39.018 11.1853 38.9492 11.0871 38.8865C10.9892 38.8249 10.8868 38.7661 10.7812 38.7129C10.7818 38.7157 10.7818 38.7185 10.7812 38.7213V38.7297V38.7381V38.7465L10.7965 38.7983C10.7965 38.8151 10.8072 38.8319 10.8134 38.8501C10.8195 38.8683 10.8241 38.8851 10.8302 38.9033C10.8363 38.9215 10.8424 38.9383 10.8501 38.9565C10.9631 39.2361 11.1197 39.4993 11.3149 39.7379C11.4983 39.9738 11.7147 40.1866 11.9586 40.3709C12.1963 40.5511 12.4603 40.7001 12.743 40.8134C13.0202 40.9252 13.3168 40.9916 13.6191 41.0094C13.9103 41.0265 14.2019 40.9815 14.4708 40.8778C14.7374 40.7722 14.9732 40.6105 15.1589 40.4059C15.3609 40.1823 15.5042 39.9193 15.5778 39.6371C15.6614 39.3108 15.664 38.9716 15.5855 38.6443L15.5075 38.3474' /><path d='M3.48798 24.5851L3.39318 24.6257L3.29991 24.6705L3.20664 24.7196L3.1149 24.7742C2.94518 24.8764 2.78769 24.9772 2.63937 25.085C2.49133 25.1905 2.35276 25.3066 2.225 25.4323C2.08766 25.5678 1.96478 25.7151 1.85804 25.872C1.73126 26.0571 1.62131 26.2515 1.5293 26.4531C1.81993 26.4159 2.1148 26.4159 2.40543 26.4531C2.71496 26.4925 3.01798 26.5668 3.30756 26.6744C3.62864 26.7942 3.93595 26.9429 4.22497 27.1183C4.5493 27.3172 4.85605 27.5391 5.14239 27.782L3.91917 24.4535L3.80908 24.4787L3.70052 24.5081L3.59195 24.5431L3.48492 24.5837' /><path d='M4.48242 24.4044L5.68882 27.6447L8.36921 27.6811C8.10889 27.2001 7.80777 26.7384 7.46861 26.3004C7.18338 25.9307 6.85697 25.589 6.49462 25.281C6.19522 25.0249 5.8562 24.8107 5.48852 24.6453C5.17431 24.5039 4.83203 24.4224 4.48242 24.4058' /><path d='M6.07129 28.6674C6.51279 29.1502 6.91693 29.6607 7.28075 30.1951C7.70021 30.8088 8.08155 31.4437 8.42293 32.0967C8.7899 32.7969 9.13699 33.5475 9.45961 34.3498C9.78224 35.1522 10.085 36.019 10.3541 36.9236C10.374 36.5301 10.3786 36.1254 10.3709 35.7137C10.3633 35.302 10.3403 34.8834 10.3021 34.4605C10.2639 34.0376 10.215 33.6105 10.1492 33.1806C10.0835 32.7507 9.9963 32.3208 9.90609 31.8895C9.84085 31.6001 9.77051 31.3172 9.69508 31.0409C9.62016 30.7608 9.54218 30.4962 9.4535 30.2329C9.36481 29.9697 9.27919 29.7148 9.18592 29.4683C9.09265 29.2219 8.99326 28.9824 8.89387 28.75L6.07129 28.6674Z' /><path d='M0 4.81104C0.0774707 5.47665 0.164116 6.1502 0.259935 6.83169C0.355754 7.51317 0.460237 8.20259 0.573385 8.89995C0.688572 9.59451 0.812933 10.2979 0.946468 11.0102C1.08 11.7225 1.22322 12.4399 1.37612 13.1625C1.57999 14.1082 1.79202 15.0338 2.0122 15.9393C2.23238 16.8449 2.4653 17.7317 2.71096 18.5999C2.95459 19.4672 3.20943 20.3074 3.47548 21.1205C3.74153 21.9336 4.01064 22.7271 4.2828 23.501C4.40167 23.484 4.52182 23.4756 4.64213 23.4758C4.76457 23.4772 4.88673 23.4871 5.00756 23.5052C5.13247 23.5243 5.25565 23.5519 5.37606 23.5878C5.50213 23.627 5.62523 23.6738 5.74455 23.7279C5.46117 23.1164 5.1834 22.4886 4.91123 21.8444C4.63907 21.2003 4.37404 20.5426 4.11614 19.8714C3.85926 19.1993 3.6085 18.5122 3.36386 17.8101C3.11922 17.1081 2.87967 16.3963 2.64522 15.6747C2.33941 14.7262 2.05654 13.7833 1.79661 12.846C1.53667 11.9088 1.29712 10.9873 1.07796 10.0818C0.858803 9.17721 0.65952 8.28381 0.480114 7.40161C0.300709 6.51942 0.14067 5.65589 0 4.81104Z' /><path d='M23.8852 18.6493C23.7323 18.6731 23.5703 18.6998 23.4128 18.7306C23.2553 18.7614 23.107 18.7936 22.9449 18.83C22.7828 18.8664 22.6391 18.9056 22.4862 18.9462C22.3333 18.9868 22.1804 19.033 22.0275 19.0862L21.5244 23.1976C22.0244 22.6791 22.5558 22.1868 23.1161 21.723C23.65 21.2795 24.2116 20.8648 24.7981 20.481C25.3628 20.1098 25.9515 19.7704 26.561 19.4643C27.1504 19.1705 27.7591 18.9104 28.3836 18.6857C28.0384 18.5887 27.685 18.518 27.3271 18.4743C26.9794 18.4324 26.6288 18.4137 26.2782 18.4183C25.9219 18.4183 25.558 18.4463 25.1773 18.4841C24.7965 18.5219 24.3929 18.5765 23.9663 18.6367H23.9449H23.925H23.9051H23.8852'/><path d='M20.0486 24.8976L13.5304 27.8662C13.4417 28.1958 13.3683 28.5295 13.3102 28.8675C13.2521 29.2054 13.2088 29.5485 13.1803 29.8967C13.1512 30.244 13.139 30.5969 13.1451 30.9469C13.1512 31.297 13.1711 31.6583 13.2108 32.014C13.2694 32.5375 13.3665 33.0568 13.5014 33.5683C13.6323 34.0649 13.8009 34.5524 14.0059 35.0274C14.2063 35.4903 14.4424 35.9396 14.7123 36.3717C14.9767 36.7942 15.2741 37.1985 15.6022 37.5816C15.6527 35.1998 16.0987 32.8389 16.9248 30.5801C17.3058 29.5412 17.7683 28.529 18.3086 27.5512C18.8172 26.6306 19.3983 25.7452 20.0471 24.9018' /><path opacity='0.7' d='M18.0837 0C18.3028 0.760402 18.4789 1.53067 18.6112 2.30772C18.7519 3.1143 18.8574 3.95168 18.9369 4.81988C19.0164 5.68807 19.0745 6.60948 19.1143 7.55329C19.154 8.4971 19.1785 9.50253 19.1968 10.5262C19.2397 12.9067 19.0439 14.8237 18.703 16.4229C18.4159 17.8177 17.9429 19.1749 17.2947 20.4642C16.7717 21.4524 16.1924 22.4148 15.5593 23.3474C14.9966 24.224 14.5027 25.0474 14.1954 26.008C14.1847 26.0332 14.174 26.057 14.1633 26.0808C14.1526 26.1046 14.1404 26.1298 14.1296 26.1537L14.0975 26.2265C14.0868 26.2517 14.0761 26.2755 14.0654 26.3007L20.2305 23.5869C20.5454 21.7777 20.7488 20.0861 20.8604 18.5009C20.9705 16.9606 20.998 15.5239 20.969 14.1866C20.9384 12.8787 20.8528 11.666 20.732 10.5458C20.6112 9.42551 20.4613 8.43269 20.2947 7.51688C20.1693 6.82373 20.0256 6.14598 19.8681 5.48363C19.7106 4.82128 19.5378 4.18414 19.3513 3.5568C19.1647 2.92946 18.966 2.32732 18.7534 1.73639C18.5409 1.14546 18.3192 0.560125 18.0837 0Z' /></g></svg>`;

/**
 * Icons for both light and dark mode.
 *
 * The icons are in (base64) SVG, so that they will scale to different sizes. The default icon is used by
 * various OS specific features, such as pinned tabs, taskbars, etc.
 */
export const iconMeta = (): ElementDefinition[] => [
  {
    name: 'link',
    attrs: {
      rel: 'icon',
      href: icon('black'),
    },
  },
  {
    name: 'link',
    attrs: {
      rel: 'icon',
      href: icon('white'),
      media: '(prefers-color-scheme: dark)',
    },
  },
];

export const fontMeta = (): ElementDefinition[] => [
  {
    name: 'link',
    attrs: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
      media: 'all',
    },
  },
];

export const bodyStyles = (
  config: { fontSize: string } = { fontSize: '14px' }
): ElementDefinition[] => [
  {
    name: 'style',
    attrs: { text: `:root{font-size:${config.fontSize}}body {margin: 0;}` },
  },
];
