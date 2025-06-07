import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";

interface UserAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
  alt?: string;
}

export function UserAvatar({
  src,
  fallback = "U",
  className,
  alt = "Avatar",
}: UserAvatarProps) {
  // Función para determinar la URL correcta de la imagen
  const getImageUrl = (imageSrc: string | undefined): string | undefined => {
    if (!imageSrc) return undefined;

    // Si es una URL completa (Google, etc.), usarla directamente
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      return imageSrc;
    }

    // Si es una ruta local (uploads/...), construir la URL del backend
    if (imageSrc.startsWith("uploads/")) {
      // Usar la URL del backend desde las variables de entorno
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      return `${backendUrl}/${imageSrc}`;
    }

    // Si es una ruta relativa, asumir que es del servidor actual
    return imageSrc;
  };

  const imageUrl = getImageUrl(src);

  return (
    <Avatar className={className}>
      <AvatarImage
        src={imageUrl}
        alt={alt}
        onError={(e) => {
          // Si la imagen falla al cargar, mostrar el fallback
          console.warn("Error loading avatar image:", imageUrl);
        }}
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
