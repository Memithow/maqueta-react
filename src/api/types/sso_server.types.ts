interface UMOUserInterface {
  session: SessionInterface;
  user: UserInterface;
}

interface UserInterface {
  email: string;
  first_name: string;
  initials: string;
  last_name: string;
  sso: string;
  sso_active: SSOStatusInterface;
}

interface SessionInterface {
  expires_at: Date;
  token: string;
}

interface SSOStatusInterface {
  id: number;
  name: string;
}
