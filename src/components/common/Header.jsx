import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
  z-index: 100;
`;

const Logo = styled.img`
  height: 40px;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo src="/assets/react.svy" alt="로고" />
    </HeaderContainer>
  );
};

export default Header;