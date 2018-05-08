interface IApplication {
  _id: string;
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
  created_by: IUser;
  created_by_name: string;
  created_at: number;
}

interface IFile {
  _id: string;
  name: string;
  path: string;
  type: string;
  created_at: number;
}

interface ICategory {
  _id: string;
  name: string;
  name_fa: string;
  stared: boolean;
  order: number;
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

export {IApplication, IFile, ICategory, IUser, IApp};
