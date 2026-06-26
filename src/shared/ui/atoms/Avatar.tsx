export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}

export function Avatar({ src, alt = "User avatar", className = "", ...props }: AvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`w-8 h-8 rounded-full border border-[#ebebeb] object-cover ${className}`}
      {...props}
    />
  );
}
