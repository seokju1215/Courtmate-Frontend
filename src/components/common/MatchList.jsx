import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchMatches } from "../../api/fetchMatches.js";
import { useNavigate } from "react-router-dom";
import MatchFilter from "./MatchFilter.jsx";

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
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatches = async () => {
      const fetchedMatches = await fetchMatches();
      setMatches(fetchedMatches);
      setLoading(false);
    };
    loadMatches();
  }, []);

  
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();

  const formattedSelectedDate = (() => {
    if (!selectedDate) return "날짜 없음";
    const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    return isNaN(dateObj.getTime()) ? "날짜 없음" : dateObj.toISOString().split("T")[0];
  })();

  // ✅ 오늘 이전 날짜는 필터링
  const filteredMatches = matches
    .map((match) => {
      let displayDate = match.matchDate;
      let displayTime = match.matchStartTime;

      if (displayTime === "00:00") {
        // ✅ 날짜를 하루 전으로 변경 (한국 시간 기준)
        const prevDate = new Date(displayDate);
        prevDate.setDate(prevDate.getDate() - 1);

        // ✅ 한국 시간 기준으로 YYYY-MM-DD 형식 유지
        const year = prevDate.getFullYear();
        const month = String(prevDate.getMonth() + 1).padStart(2, "0");
        const day = String(prevDate.getDate()).padStart(2, "0");
        displayDate = `${year}-${month}-${day}`;

        // ✅ 00:00을 24:00으로 변경
        displayTime = "24:00";
      }

      return {
        ...match,
        displayDate,
        displayTime,
      };
    })
    .filter((match) => {
      // ✅ match.matchDate 대신 match.displayDate 기준으로 필터링
      if (match.displayDate !== formattedSelectedDate) {
        return false;
      }

      // ✅ 현재 날짜인 경우, 현재 시간보다 1시간 이후 경기만 표시
      if (formattedSelectedDate === now.toISOString().split("T")[0]) {
        const [matchHours, matchMinutes] = match.displayTime.split(":").map(Number);
        const matchTotalMinutes = matchHours * 60 + matchMinutes;
        const nowTotalMinutes = nowHours * 60 + nowMinutes;

        if (matchTotalMinutes <= nowTotalMinutes + 60) {
          return false; // 현재 시간보다 1시간 이내면 리스트에서 제외
        }
      }

      return true;
    })
    // ✅ 경기 시작 시간순 정렬 (오름차순)
    .sort((a, b) => {
      const [aHours, aMinutes] = a.displayTime.split(":").map(Number);
      const [bHours, bMinutes] = b.displayTime.split(":").map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });

  const handleApply = (match) => {
    navigate(`/form/${match.courtId}/${match.id}`, {
      state: { 
        courtName: match.courtName,
        matchDate: match.displayDate,  
        matchTime: match.displayTime,
      },
    });
  };

  if (loading) {
    return <ListContainer> 데이터를 불러오는 중...</ListContainer>;
  }

  return (
    <ListContainer>

      {filteredMatches.length > 0 ? (
        filteredMatches.map((match) => {
          const isClosed = match.remainingCount === 0;

          return (
            <MatchItem key={match.id} isClosed={isClosed}>
              <TimeColumn isClosed={isClosed}>
                <strong>{match.displayTime}</strong>
              </TimeColumn>

              <InfoColumn>
                <MatchTitle isClosed={isClosed}>{match.courtName || "알 수 없는 경기장"}</MatchTitle>
                <MatchDetails> 남자 5:5 매치 / 참가비 5,000원</MatchDetails>
              </InfoColumn>

              <ActionColumn>
                <ApplyButton
                  disabled={isClosed}
                  onClick={() => handleApply(match)}
                >
                  {isClosed ? "마감" : "참가하기"}
                </ApplyButton>
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