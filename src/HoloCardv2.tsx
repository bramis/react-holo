import React, {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  RefObject,
  useEffect
} from "react";
import styled, { css } from "styled-components";
import { useRef } from "react";
import styles from "./HoloCardv2.module.scss";
import getPercentage from "./utils/getPercentage";

const DRIVE_URL = "https://drive.google.com/uc?export=view&id=";

interface useHoloOptions {
  flipCardRef: RefObject<HTMLDivElement>;
  glowEffectRef: RefObject<HTMLDivElement>;
  rarity?: number;
}

type UseHolo = (options: useHoloOptions) => void;

const useHolo: UseHolo = ({ flipCardRef, glowEffectRef, rarity = 1 }) => {
  useEffect(() => {
    const flipCardRefCopy = flipCardRef.current;
    const glowEffectRefCopy = glowEffectRef.current;

    const handleMouseMoveFlipCard = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        if (flipCardRefCopy) {
          const box = flipCardRefCopy.getBoundingClientRect();
          const calc = {
            X: -(e.clientY - box.y - box.height / 2) / 20,
            Y: (e.clientX - box.x - box.width / 2) / 20
          };
          flipCardRefCopy.style.transform = `perspective(600px) rotateX(${
            calc.X * -1
          }deg) rotateY(${calc.Y * -1}deg) translate3d(${calc.Y}px, ${
            calc.X
          }px, 0px) scale(1)`;

          flipCardRefCopy.style.transition = "transform 0s ease-in";
        }
      });
    };
    const handleMouseOutFlipCard = () => {
      window.requestAnimationFrame(() => {
        if (flipCardRefCopy) {
          flipCardRefCopy.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg)
        translate3d(0px, 0px, 0px) scale(1)`;

          flipCardRefCopy.style.transition = "transform 0.5s ease-out 0.15s";
        }
      });
    };
    const handleMouseMoveGlow = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        if (glowEffectRefCopy) {
          const my = getPercentage(e.offsetY, glowEffectRefCopy.clientHeight);
          const mx = getPercentage(e.offsetX, glowEffectRefCopy.clientWidth);
          const CSSProps = {
            posx: Math.round(50 + mx / 4 - 12.5),
            posy: Math.round(50 + my / 3 - 16.67),
            hyp: Math.sqrt((my - 50) * (my - 50) + (mx - 50) * (mx - 50)) / 50
          };

          const textures = [
            "",
            "",
            `url(${DRIVE_URL}1jVWbHaSnvxUWnVyxYQEwC3dfFc2GINQU)`,
            `url(${DRIVE_URL}1o_OFVIIHK0uYt4kALD5GENkY5OkdV7aE)`,
            `url(${DRIVE_URL}1uM7x4p_gLWS3lfhNxXnjbfB8bG_tuYDc)`
          ];

          glowEffectRefCopy.style.setProperty("--o", `1`);
          glowEffectRefCopy.style.setProperty("--mx", `${mx}%`);
          glowEffectRefCopy.style.setProperty("--my", `${my}%`);
          glowEffectRefCopy.style.setProperty("--posx", `${CSSProps.posx}%`);
          glowEffectRefCopy.style.setProperty("--posy", `${CSSProps.posy}%`);
          glowEffectRefCopy.style.setProperty("--hyp", `${CSSProps.hyp}`);
          glowEffectRefCopy.style.setProperty("--textures", textures[rarity]);

          glowEffectRefCopy.style.transition = "all 1s ease-out";
        }
      });
    };
    const handleMouseLeaveGlow = () => {
      window.requestAnimationFrame(() => {
        if (glowEffectRefCopy) {
          glowEffectRefCopy.style.setProperty("--o", `0`);
          glowEffectRefCopy.style.setProperty("--mx", `50%`);
          glowEffectRefCopy.style.setProperty("--my", `50%`);
          glowEffectRefCopy.style.setProperty("--posx", `50%`);
          glowEffectRefCopy.style.setProperty("--posy", `50%`);
          glowEffectRefCopy.style.setProperty("--hyp", `0`);

          glowEffectRef.current.style.transition = "all .75s ease-out";
        }
      });
    };

    if (flipCardRefCopy && glowEffectRefCopy) {
      flipCardRefCopy.addEventListener("mousemove", handleMouseMoveFlipCard);
      flipCardRefCopy.addEventListener("mouseout", handleMouseOutFlipCard);
      glowEffectRefCopy.addEventListener("mousemove", handleMouseMoveGlow);
      glowEffectRefCopy.addEventListener("mouseout", handleMouseLeaveGlow);
    }

    return () => {
      if (flipCardRefCopy && glowEffectRefCopy) {
        flipCardRefCopy.removeEventListener(
          "mousemove",
          handleMouseMoveFlipCard
        );
        flipCardRefCopy.removeEventListener("mouseout", handleMouseOutFlipCard);
        glowEffectRefCopy.removeEventListener("mousemove", handleMouseMoveGlow);
        glowEffectRefCopy.removeEventListener("mouseout", handleMouseLeaveGlow);
      }
    };
  }, [flipCardRef, glowEffectRef, rarity]);
};

interface HoloCardProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  rarity?: number;
}

const StyledHoloCard = styled.div`
  perspective: 1000px;
  transition: transform 0.2s ease-out;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  overflow: hidden;
  box-shadow: 0 10px 30px -15px #000;

  ${({ width, height }: HoloCardProps) => {
    return css`
      width: ${width ? `${width}px` : "100%"};
      height: ${height ? `${height}px` : "100%"};
    `;
  }}
`;

const HoloCard: FC<HoloCardProps> = ({
  alt = "",
  rarity = 1,
  width,
  height,
  children,
  ...imgProps
}) => {
  const flipCardRef = useRef<HTMLDivElement>(null);
  const glowEffectRef = useRef<HTMLDivElement>(null);

  useHolo({ flipCardRef, glowEffectRef });

  return (
    <StyledHoloCard
      className={`${styles.FlipCard}`}
      ref={flipCardRef}
      width={width}
      height={height}
    >
      <img
        className={styles.CardImg}
        alt={alt}
        width={width}
        height={height}
        {...imgProps}
      />
      <div
        className={styles.glowEffect}
        data-rarity={rarity}
        ref={glowEffectRef}
      />
    </StyledHoloCard>
  );
};

export default HoloCard;
