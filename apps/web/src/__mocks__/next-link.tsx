import React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

export default function Link({ href, children, ...props }: Props) {
  return <a href={href} {...props}>{children}</a>;
}
