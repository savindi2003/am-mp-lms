import React from "react";

interface CardBoxItemProps<T> {
  data: T[];
  render: (item: T) => React.ReactNode;
}

function CardBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6 2xl:gap-8">
      {children}
    </div>
  );
}

function CardBoxItem<T>({ data, render }: CardBoxItemProps<T>) {
  return <>{data?.map(render)}</>;
}

CardBox.Item = CardBoxItem;

export default CardBox;
