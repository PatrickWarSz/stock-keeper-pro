import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
}

export function NavLink({ className, activeClassName, ...rest }: Props) {
  return (
    <RouterNavLink
      {...rest}
      className={({ isActive }) =>
        cn(className, isActive && activeClassName)
      }
    />
  );
}
