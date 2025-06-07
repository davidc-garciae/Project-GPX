import React from "react";
import { LogOut, BadgeCheck, Car, Shield } from "lucide-react";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/molecules/basic/dropdown-menu";

interface HeaderUserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    admin?: boolean;
  };
  onLogout: () => void;
}

export const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  user,
  onLogout,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="flex items-center transition-colors border rounded-lg shadow bg-background/80 hover:bg-primary/10 border-border"
        aria-label="Menú de usuario"
      >
        <UserAvatar
          src={user.avatar}
          fallback={user.name?.[0] ?? "U"}
          className="w-8 h-8 rounded-lg"
          alt={user.name}
        />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      className="rounded-lg min-w-56"
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserAvatar
            src={user.avatar}
            fallback={user.name?.[0] ?? "U"}
            className="w-8 h-8 rounded-lg"
            alt={user.name}
          />
          <div className="grid flex-1 text-sm leading-tight text-left">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-xs truncate text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => (window.location.href = "/perfil")}
          className="cursor-pointer"
        >
          <BadgeCheck className="w-4 h-4 mr-2" /> Cuenta
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (window.location.href = "/vehiculos")}
          className="cursor-pointer"
        >
          <Car className="w-4 h-4 mr-2" /> Vehículos
        </DropdownMenuItem>
        {user.admin && (
          <DropdownMenuItem
            onClick={() => (window.location.href = "/admin")}
            className="cursor-pointer"
          >
            <Shield className="w-4 h-4 mr-2" /> Administración
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
        <LogOut className="w-5 h-5 mr-2" /> Cerrar sesión
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
