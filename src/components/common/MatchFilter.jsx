import React from "react";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  margin-right: 10px;
`;

const FilterSelect = styled.select`
  padding: 5px;
  font-size: 14px;
`;

// ✅ 구 필터 컴포넌트
const MatchFilter = ({ districts, selectedDistrict, onSelectDistrict }) => {
  return (
    <FilterContainer>
      <FilterSelect id="district" value={selectedDistrict} onChange={(e) => onSelectDistrict(e.target.value)}>
        <option value="">전체</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </FilterSelect>
    </FilterContainer>
  );
};

export default MatchFilter;