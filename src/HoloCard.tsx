import React, {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  RefObject,
  useEffect
} from "react";
import { useRef } from "react";
import styles from "./HoloCard.module.scss";
import getPercentage from "./utils/getPercentage";

interface useHoloOptions {
  flipCardRef: RefObject<HTMLDivElement>;
  cardFrontRef: RefObject<HTMLDivElement>;
  glowEffectRef: RefObject<HTMLDivElement>;
  rarity?: number;
}

type UseHolo = (options: useHoloOptions) => void;

const useHolo: UseHolo = ({
  flipCardRef,
  cardFrontRef,
  glowEffectRef,
  rarity = 1
}) => {
  useEffect(() => {
    const flipCardRefCopy = flipCardRef.current;
    const cardFrontRefCopy = cardFrontRef.current;
    const glowEffectRefCopy = glowEffectRef.current;

    const handleMouseMoveFlipCard = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        if (cardFrontRefCopy) {
          const box = cardFrontRefCopy.getBoundingClientRect();
          const calc = {
            X: -(e.clientY - box.y - box.height / 2) / 20,
            Y: (e.clientX - box.x - box.width / 2) / 20
          };
          cardFrontRefCopy.style.transform = `perspective(600px) rotateX(${
            calc.X * -1
          }deg) rotateY(${calc.Y * -1}deg) translate3d(${calc.Y}px, ${
            calc.X
          }px, 0px) scale(1)`;

          cardFrontRefCopy.style.transition = "transform 0s ease-in";
        }
      });
    };
    const handleMouseOutFlipCard = () => {
      window.requestAnimationFrame(() => {
        if (cardFrontRefCopy) {
          cardFrontRefCopy.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg)
        translate3d(0px, 0px, 0px) scale(1)`;

          cardFrontRefCopy.style.transition = "transform 0.5s ease-out 0.15s";
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

          const textures = {
            1: "",
            2: ""
          };

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
  }, [flipCardRef, cardFrontRef, glowEffectRef, rarity]);
};

interface HoloCardProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  rarity?: number;
}

const HoloCard: FC<HoloCardProps> = ({ alt = "", rarity = 1, ...imgProps }) => {
  const flipCardRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const glowEffectRef = useRef<HTMLDivElement>(null);

  useHolo({ flipCardRef, cardFrontRef, glowEffectRef });

  return (
    <div className={`${styles.FlipCard}`} ref={flipCardRef}>
      <div className={styles.CardInner}>
        <div className={styles.CardFront} ref={cardFrontRef}>
          {/* <div className={`${styles.plop} ${styles.toto}`}>Hello World</div> */}
          <img className={styles.plop} alt={alt} {...imgProps} />
          <div
            className={styles.glowEffect}
            data-rarity={rarity}
            ref={glowEffectRef}
          />
        </div>
        {/* <div className={styles.CardBack}>
          <div className={styles.logo} />
        </div> */}
      </div>
    </div>
  );
};

export default HoloCard;
