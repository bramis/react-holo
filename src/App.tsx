import styled from "styled-components";

import HoloCardV1 from "./HoloCard";
import HoloCard from "./HoloCardv2";

import styles from "./App.module.scss";

function getPercentage(value: number, totalValue: number = 100) {
  const fixedValue = ((value * 100) / totalValue).toFixed(2);
  return parseFloat(fixedValue);
}

// let options = { frequency: 60, referenceFrame: 'device' };
// let gyroscope = new AbsoluteOrientationSensor(options);
// let gyroscope = new RelativeOrientationSensor(options);

// gyroscope.addEventListener('reading', (e) => {
//   console.log(`Angular velocity along the X-axis ${gyroscope.quaternion}`);
// });
// gyroscope.start();

const StyledHoloCard = styled(HoloCard)`
  border-radius: 15px;
`;

export default function App() {
  const src =
    "https://www.pojo.com/harrypotter/ccg/PromoCardImages/PromoIllegibilus.jpg";
  const puissance = 0;
  const attack = 0;

  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: "black" }}>
      <HoloCard src={src} width="360" height="570" />
      <HoloCard src={src} width="360" height="570" rarity={2} />
      <HoloCard src={src} width="360" height="570" rarity={3} />
      <HoloCard src={src} width="360" height="570" rarity={4} />
      <HoloCard src={src} width="360" height="570" rarity={5} />
      {/* <HoloCardV1 src={src} width="370" height="550" />
      <HoloCardV1 src={src} width="370" height="550" rarity={2} /> */}
    </div>
  );
}
