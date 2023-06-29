import Providers from "../Provider";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return <Providers>{children}</Providers>;
}
