import Image from 'next/image';
import Link from 'next/link';

interface IThumbnailCard {
  redirectUrl: string;
  imageUrl: string;
  hoverAnim?: boolean | undefined;
  text?: string | undefined;
}

export const ThumbnailCard = ({
  redirectUrl,
  imageUrl,
  hoverAnim,
  text,
}: IThumbnailCard) => {
  return (
    <Link href={redirectUrl}>
      <div className="group relative border h-[120px] sm:h-[150px] xl:h-[200px] rounded-lg overflow-hidden">
        <div className="relative brightness-[.60] h-full w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            width={100}
            height={100}
            alt="Category"
            priority
            unoptimized
            className={
              hoverAnim
                ? 'group-hover:scale-110 h-full w-full object-cover rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-110'
                : `h-full w-full object-cover rounded-lg`
            }
          />
        </div>
        {text && (
          <div className="shadow-md absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center w-full h-full text-white text-3xl font-semibold">
              {text}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
