interface IApplication {
  _id: string;
  app_id: string;
  name: string;
  summary: string;
  logo: IFile;
  desc: string;
  website: string;
  screenshots: IFile[];
  translations?: IApplicationTrans[];
  permissions: number[];
  categories: ICategory[];
  official: boolean;
  stared: boolean;
  status: number;
  lang: string[];
  created_by?: IUser;
  created_by_name?: string;
  created_at?: number;
}

interface IFile {
  _id: string;
  name?: string;
  path?: string;
  type?: string;
  created_at?: number;
}

interface ICategory {
  _id: string;
  name?: string;
  translations?: ICategoryTrans[];
  stared?: boolean;
  order?: number;
  slug?: string;
}

interface ICategoryTrans {
  locale: string;
  name: string;
}

interface IPermission {
  _id: string;
  code: number;
  name?: string;
  desc?: string;
  translations?: IPermissionTrans[];
}

interface IPermissionTrans {
  locale: string;
  name?: string;
  desc?: string;
}

interface ISelectOption {
  value: string;
  label: string;
}

interface IUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  nested: string;
  apps: IApp[];
  admin: boolean;
  developer: boolean;
  created_at: number;
}

interface IApp {
  _id: string;
  url: string;
  id: string;
  name: string;
  token: string;
  created_by: number;
}

interface IApplicationTrans {
  locale: string;
  name: string;
  desc: string;
}

export {IApplication, IApplicationTrans, IFile, ICategory, IUser, IApp, ISelectOption, IPermission};
