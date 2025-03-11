import React from "react";
import styled from "styled-components";
import sampleMatchData from "../../data/sampleMatchData";

const ListContainer = styled.div`
  padding: 20px;
`;

const MatchItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ApplyButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const MatchList = ({ selectedDate }) => {
  const filteredMatches = sampleMatchData.filter(
    (match) => match.matchDate === selectedDate
  );

  return (
    <ListContainer>
      {filteredMatches.length > 0 ? (
        filteredMatches.map((match) => (
          <MatchItem key={match.id}>
            <div>
              <strong>{match.matchStartTime}</strong> - {match.courtId}번 코트
            </div>
            <ApplyButton>신청 가능</ApplyButton>
          </MatchItem>
        ))
      ) : (
        <p>해당 날짜에 경기 일정이 없습니다.</p>
      )}
    </ListContainer>
  );
};

export default MatchList;