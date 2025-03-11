import React from "react";
import styled from "styled-components";
import sampleMatchData from "../../data/sampleMatchData";
import sampleCourtData from "../../data/sampleCourtData"; // ✅ 코트 데이터 가져오기

const ListContainer = styled.div`
  padding: 20px;
`;

const MatchItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  color: ${(props) => (props.isClosed ? "#888" : "black")}; /* ✅ 마감이면 글자 색 회색 */
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MatchTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  color: ${(props) => (props.isClosed ? "#888" : "black")};
`;

const RemainingSeats = styled.div`
  font-size: 14px;
  color: ${(props) => (props.isClosed ? "#888" : "red")}; 
  margin-top: 5px;
`;

const ApplyButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#ddd" : "#F2821F")};
  color: ${(props) => (props.disabled ? "#888" : "white")};
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const MatchList = ({ selectedDate }) => {
  const filteredMatches = sampleMatchData.filter(
    (match) => match.matchDate === selectedDate
  );

  // ✅ 코트 ID를 기반으로 코트 이름 가져오는 함수
  const getCourtName = (courtId) => {
    const court = sampleCourtData.find((court) => court.id === courtId);
    return court ? court.name : "알 수 없는 코트";
  };

  // ✅ 시간을 24시간 형식(14:00)으로 변환
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`; // 24시간 형식 유지
  };

  return (
    <ListContainer>
      {filteredMatches.length > 0 ? (
        filteredMatches.map((match) => {
          const isClosed = match.remainingCount === 0; // ✅ 마감 여부 체크

          return (
            <MatchItem key={match.id} isClosed={isClosed}>
              <MatchInfo>
                <MatchTitle isClosed={isClosed}>
                  <strong>{formatTime(match.matchStartTime)}</strong> - {getCourtName(match.courtId)}
                </MatchTitle>
                {match.remainingCount > 0 ? (
                  <RemainingSeats>⚠️ {match.remainingCount}자리 남았어요!</RemainingSeats>
                ) : (
                  <RemainingSeats isClosed={isClosed}>마감되었습니다</RemainingSeats>
                )}
              </MatchInfo>
              <ApplyButton disabled={isClosed}>
                {isClosed ? "마감" : "신청 가능"}
              </ApplyButton>
            </MatchItem>
          );
        })
      ) : (
        <p>해당 날짜에 경기 일정이 없습니다.</p>
      )}
    </ListContainer>
  );
};

export default MatchList;