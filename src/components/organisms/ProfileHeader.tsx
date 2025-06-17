import { User } from "@/types/auth.types";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { Separator } from "@/components/atoms/separator";
import { ProfilePhotoManager } from "@/components/molecules/ProfilePhotoManager";

interface ProfileHeaderProps {
  user?: User;
  updating?: boolean;
  onUrlChange: (url: string) => void;
  onRemovePhoto: () => void;
}

export function ProfileHeader({
  user,
  updating = false,
  onUrlChange,
  onRemovePhoto,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6 space-x-4">
        <UserAvatar
          src={user?.picture}
          fallback={`${user?.firstName?.charAt(0) || ""}${
            user?.lastName?.charAt(0) || ""
          }`}
          className="w-20 h-20"
          alt="Foto de perfil"
        />
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Administra tu información personal y preferencias
          </p>
          {user && (
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <div className="ml-auto">
          <ProfilePhotoManager
            hasPhoto={!!user?.picture}
            onUrlChange={onUrlChange}
            onRemove={onRemovePhoto}
            updating={updating}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
}
