import React from "react";
import styled from "styled-components";
import courtmateLogo from "../../assets/courtmate.png";

const HeaderContainer = styled.header`
  width: 100%;
  height: 90px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
  z-index: 100;
`;

const Logo = styled.img`
  height: 60px;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo src={courtmateLogo} alt="로고" />
    </HeaderContainer>
  );
};

export default Header;