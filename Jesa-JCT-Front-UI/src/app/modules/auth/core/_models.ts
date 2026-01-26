export enum UserRoles {
  CostControl = "Cost Control",
  ProjectManager = "Project Manager",
  PortfolioManager = "Portfolio Manager",
  PCMProgram = "PCM Program",
  ProgramManager = "Program Manager",
  PMO = "Pmo",
  BUH = "BU Head",
  FPA = "Fp&a",
  MD = "Managing Director",
  Admin = "Admin",
  SALES = "Sales",
}

export interface AuthModel {
  token: string;
  userId: string;
  email: string;
  roles: UserRoles[];
  selectedRole: UserRoles;
}

export interface UserModel {
  id: number;
  UserName: string;
  UserId: string;
  jti: string;
  email: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
  firstName: string;
  lastName: string;
  exp: number;
  iss: string;
  aud: string;
}
