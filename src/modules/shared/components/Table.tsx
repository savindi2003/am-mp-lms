"use client";

import { createContext, type JSX, type ReactNode } from "react";

type TableContextValue = Record<string, never>;
const TableContext = createContext<TableContextValue | null>(null);

type TableProps = { children: ReactNode };
type HeaderProps = { children: ReactNode; styles?: string };
type RowProps = { children: ReactNode; styles?: string };
type FooterProps = { children?: ReactNode };
type BodyProps<T> = {
  data?: T[];
  render: (item: T, index: number) => ReactNode;
};

type TableComponent = React.FC<TableProps> & {
  Header: React.FC<HeaderProps>;
  Body: <T>(props: BodyProps<T>) => JSX.Element;
  Row: React.FC<RowProps>;
  Footer: React.FC<FooterProps>;
};

const Table: TableComponent = ({ children }) => {
  return (
    <TableContext.Provider value={null}>
      <div role="table" className="overflow-hidden bg-white">
        {children}
      </div>
    </TableContext.Provider>
  );
};

const Header: React.FC<HeaderProps> = ({ children, styles }) => (
  <div role="rowgroup" className="bg-gray-100">
    <header role="row" className={styles}>
      {children}
    </header>
  </div>
);

const Body = <T,>({ data, render }: BodyProps<T>) => (
  <div role="rowgroup">{data?.map(render)}</div>
);

const Row: React.FC<RowProps> = ({ children, styles }) => (
  <div
    role="row"
    className={` border-t border-t-slate-300 pt-2 md:p-2 ${styles ?? ""}`}
  >
    {children}
  </div>
);

const Footer: React.FC<FooterProps> = ({ children }) => (
  <footer className="border-t border-slate-100">{children}</footer>
);

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
