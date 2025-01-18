import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div style={{ marginInline: 16 }}>{children}</div>;
};

export default Layout;
