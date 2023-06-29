import Providers from "@/app/Provider";

interface ContractLayoutProps {
  children: React.ReactNode;
}

export default function ContractLayout({ children }: ContractLayoutProps) {
  return <Providers>{children}</Providers>;
}
