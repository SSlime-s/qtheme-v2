import styled from "@emotion/styled";

import { GlassmorphismStyle } from "@/components/Glassmorphism";

import type { NextPage } from "next";

const Test: NextPage = () => {
  return (
    <Wrap>
      <Card>
        <h2>Test</h2>
      </Card>
    </Wrap>
  );
};
export default Test;

const Card = styled.div`
  ${GlassmorphismStyle}
  padding: 80px;
`;

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(116.36deg, #156cee 0%, #f04545 100%);
`;
