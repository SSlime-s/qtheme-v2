import styled from "@emotion/styled";

const PositionMap = {
  "top-left": 0,
  "top-right": 90,
  "bottom-right": 180,
  "bottom-left": 270,
} as const satisfies Record<string, number>;

interface Props {
  position: keyof typeof PositionMap;
  size?: number;
}
export const TrimMark: React.FC<Props> = ({ position, size = 16 }) => {
  return (
    <Svg
      position={position}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 0 12 H 16 V 0 M 12 0 V 16 H 0" />
    </Svg>
  );
};
const Svg = styled.svg<{ position: keyof typeof PositionMap }>`
  transform: rotate(${(props) => PositionMap[props.position]}deg);
`;

interface GroupProps {
  size?: number;
  margin?: number;
}
export const TrimMarkGroup: React.FC<GroupProps> = ({
  size = 16,
  margin = 16,
}) => {
  return (
    <Group margin={margin}>
      <TrimMark position="top-left" size={size} />
      <TrimMark position="top-right" size={size} />
      <TrimMark position="bottom-left" size={size} />
      <TrimMark position="bottom-right" size={size} />
    </Group>
  );
};
const Group = styled.div<{ margin: number }>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  padding: ${(props) => props.margin}px;
  & > * {
    &:nth-child(1) {
      justify-self: start;
      align-self: start;
    }
    &:nth-child(2) {
      justify-self: end;
      align-self: start;
    }
    &:nth-child(3) {
      justify-self: start;
      align-self: end;
    }
    &:nth-child(4) {
      justify-self: end;
      align-self: end;
    }
  }
`;
