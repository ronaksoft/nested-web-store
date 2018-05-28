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
  starred: boolean;
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
  starred: IValidation;
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
  starred?: boolean;
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
  file_id?: string;
  icon?: string;
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
  nested_domain?: string;
  nested_username?: string;
  nested_admin?: boolean;
  avatar?: IFile;
  apps: IApp[];
  admin: boolean;
  developer: boolean;
  created_at: number;
  picture?: string;
}

interface IApp {
  _id: string;
  url: string;
  id: string;
  name: string;
  token: string;
  created_by: string;
}

interface IApplicationTrans {
  locale: string;
  name: string;
  desc: string;
}

interface IReview {
  _id?: string;
  rate: number;
  title?: string;
  body: string;
  response?: string;
  response_at?: number;
  response_by?: string;
  app_id?: string;
  status?: number;
  user?: IUser;
  created_by?: string;
  created_by_name?: string;
  created_at?: number;
}

interface IReport {
  _id?: string;
  app_id?: string;
  reason?: number;
  comment?: string;
  user?: IUser;
  created_by?: string;
  created_at?: number;
  status?: number;
}

interface IPurchase {
  _id?: string;
  app_id?: string;
  status?: number;
}

export {
  IApplication, IApplicationTrans, IFile, ICategory, IUser, IApp, ISelectOption, IPermission,
  IApplicationValidation, IValidation, IReview, IPurchase, IReport,
};
