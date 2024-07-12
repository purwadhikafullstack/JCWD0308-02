import Image from "next/image";
import React, { useState, useRef, useEffect, MutableRefObject } from "react";

const GetCursorPos = ({ children }: { children: (xPos: number, yPos: number, ref: MutableRefObject<HTMLImageElement | null>, isHovering: boolean) => React.ReactElement }) => {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  const updatePos = (e: MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPos([x, y]);
    }
  };

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener("mousemove", updatePos);
      currentRef.addEventListener("mouseenter", () => setIsHovering(true));
      currentRef.addEventListener("mouseleave", () => setIsHovering(false));
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousemove", updatePos);
        currentRef.removeEventListener("mouseenter", () => setIsHovering(true));
        currentRef.removeEventListener("mouseleave", () => setIsHovering(false));
      }
    };
  }, []);

  return children(pos[0], pos[1], ref, isHovering);
};

const ImageHover = ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => {
  const boxSize = 100;
  return (
    <GetCursorPos>
      {(x: number, y: number, ref: MutableRefObject<HTMLImageElement | null>, isHovering: boolean) => (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            ref={ref}
            width={width}
            height={height}
            className="transition-transform duration-100"
            style={{
              transformOrigin: `${Math.floor(x * 100)}% ${Math.floor(y * 100)}%`,
              maxWidth: "min(100%, 650px)",
              height: "auto",
              width: "auto",
              marginInline: "auto",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.5)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
          {isHovering && (
            <div
              className="absolute border-2 border-primary"
              style={{
                left: `calc(${x * 100}% - ${boxSize / 2}px)`,
                top: `calc(${y * 100}% - ${boxSize / 2}px)`,
                width: `${boxSize}px`,
                height: `${boxSize}px`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      )}
    </GetCursorPos>
  );
};

export default ImageHover;
