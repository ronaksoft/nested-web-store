interface IApplication {
  _id: string;
  app_id: string;
  name: string;
  name_fa: string;
  summary: string;
  logo: IFile;
  description: string;
  description_fa: string;
  website: string;
  screenshots: IFile[];
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
  name_fa?: string;
  stared?: boolean;
  order?: number;
}

interface IPermission {
  _id: string;
  value: number;
  name?: string;
  description?: string;
  translations: ITranslations;
}

interface ITranslations {
  fa: ITranslation;
  ar?: ITranslation;
}
interface ITranslation {
  name?: string;
  description?: string;
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

export {IApplication, IFile, ICategory, IUser, IApp, ISelectOption, IPermission};
