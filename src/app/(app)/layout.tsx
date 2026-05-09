import NavBarServer from "@/modules/shared/components/NavBar.server";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="m-auto max-w-7xl px-2 sm:px-15 lg:px-10 py-5 bg-white">
      <div className=" flex items-center px-5 py-2 justify-end">
        <NavBarServer />
      </div>
      {children}
    </div>
  );
}

export default AppLayout;
