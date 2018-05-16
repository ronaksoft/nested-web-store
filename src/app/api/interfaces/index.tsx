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
  permissions: IPermission[];
  categories: ICategory[];
  official: boolean;
  stared: boolean;
  status: number;
  lang: string[];
  created_by?: IUser;
  created_by_name?: string;
  created_at?: number;
}
interface IApplicationValidation {
  _id: IValidation;
  app_id: IValidation;
  name: IValidation;
  summary: IValidation;
  logo: IValidation;
  desc: IValidation;
  website: IValidation;
  screenshots: IValidation;
  translations?: IValidation;
  permissions: IValidation;
  categories: IValidation;
  official: IValidation;
  stared: IValidation;
  status: IValidation;
  lang: IValidation;
  created_by?: IValidation;
  created_by_name?: IValidation;
  created_at?: IValidation;
}

interface IValidation {
  isValid: boolean;
  message?: string;
}

interface IFile {
  _id: string;
  name?: string;
  path?: string;
  type?: string;
  created_at?: number;
  tmp?: boolean;
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
  code?: number;
  name?: string;
  desc?: string;
  icon?: IFile;
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
  data?: any;
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

export {IApplication, IApplicationTrans, IFile, ICategory, IUser, IApp, ISelectOption, IPermission,
  IApplicationValidation, IValidation};
