import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchMatches } from "../../api/fetchMatches.js"; // ✅ Firestore에서 실시간 데이터 가져오기

// 🔥 `Column`을 `styled.div`로 정의 (가장 위에서 선언)
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;

const ListContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  font-size: 16px;

  @media (min-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
  }
`;

const MatchItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 15px 10px;
  border-bottom: 1px solid #ddd;
  color: ${(props) => (props.isClosed ? "#888" : "#000")};
  gap: 15px;
`;

const TimeColumn = styled(Column)`
  flex: 0.5;
  font-size: 17px;
  font-weight: bold;
  color: ${(props) => (props.isClosed ? "#888" : "#000")};
  text-align: left;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;

const InfoColumn = styled(Column)`
  flex: 3;
  text-align: left;
`;

const MatchTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => (props.isClosed ? "#888" : "#000")};

  @media (min-width: 768px) {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const MatchDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 3px;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 17px;
  }
`;

const ActionColumn = styled(Column)`
  justify-content: center;
  flex: 0.5;
  align-items: center;
  text-align: center;
`;

const RemainingSeats = styled.div`
  font-size: 10px;
  color: ${(props) => (props.isClosed ? "#888" : "red")};
  margin-top: 5px;
  text-align: center;
  width: 100%;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const ApplyButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#ddd" : "#F2821F")};
  color: ${(props) => (props.disabled ? "#888" : "white")};
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-width: 70px;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 16px;
    padding: 8px 14px;
    min-width: 90px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
    padding: 10px 16px;
    min-width: 100px;
  }
`;

const MatchList = ({ selectedDate }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    console.log("🔥 selectedDate 값:", selectedDate);

    const loadMatches = async () => {
      const fetchedMatches = await fetchMatches();
      setMatches(fetchedMatches);
      setLoading(false);
    };
    loadMatches(); // 함수 실행

  }, [])
  const formattedSelectedDate = (() => {
    if (!selectedDate) return "날짜 없음";
    const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    return isNaN(dateObj.getTime()) ? "날짜 없음" : dateObj.toISOString().split("T")[0];
  })();

  const filteredMatches = matches.filter(
    (match) => match.matchDate === formattedSelectedDate
  );

  if (loading) {
    return <ListContainer>📡 데이터를 불러오는 중...</ListContainer>;
  }

  return (
    <ListContainer>
      {filteredMatches.length > 0 ? (
        filteredMatches.map((match) => {
          const isClosed = match.remainingCount === 0;

          return (
            <MatchItem key={match.id} isClosed={isClosed}>
              <TimeColumn isClosed={isClosed}>
                <strong>{match.matchStartTime}</strong>
              </TimeColumn>

              <InfoColumn>
                <MatchTitle isClosed={isClosed}>{match.courtName || "알 수 없는 경기장"}</MatchTitle>
                <MatchDetails> 남자 5:5 매치 / 참가비 10,000원</MatchDetails>
              </InfoColumn>

              <ActionColumn>
                <ApplyButton disabled={isClosed}>
                  {isClosed ? "마감" : "참가하기"}
                </ApplyButton>
                {match.remainingCount > 0 ? (
                  <RemainingSeats>{match.remainingCount}자리 남았어요</RemainingSeats>
                ) : (
                  <RemainingSeats isClosed={isClosed}>마감되었습니다</RemainingSeats>
                )}
              </ActionColumn>
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