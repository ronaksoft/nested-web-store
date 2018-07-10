const Const = {
  CLIENT_ID: '_appstore',
  SERVER_URL: 'https://store.nested.me',
  PERMISSION_DENIED: 0x01,
};

const Config = () => {
  const WindowObj: any = window;
  return {
    SERVER_URL: WindowObj.__SERVER_URL__ || Const.SERVER_URL,
  };
};

export {
  Config,
  Const,
};
