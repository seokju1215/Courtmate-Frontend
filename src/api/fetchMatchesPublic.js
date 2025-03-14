export const fetchMatchesPublic = async () => {
    try {
      
      const response = await fetch("/matches.json");
      if (!response.ok) {
        throw new Error("❌ matches.json을 불러오는데 실패했습니다.");
      }
  
      const matches = await response.json();
  
      // ✅ Firestore에서 변환하던 방식대로 matchtime을 파싱
      const processedMatches = matches.map((match) => {
        let matchDateObj = new Date(match.matchtime);
        let matchDate = matchDateObj.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        let matchStartTime = matchDateObj.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // ✅ 00:00을 24:00으로 변환 & 날짜를 하루 감소
        if (matchStartTime === "00:00") {
          matchStartTime = "24:00"; // ✅ 00:00 → 24:00 변경
          
          // ✅ 날짜 하루 감소 (사용자가 24:00이 이전 날짜 경기로 인식하도록)
          const prevDate = new Date(matchDateObj);
          prevDate.setDate(prevDate.getDate() - 1);
          matchDate = prevDate.toISOString().split("T")[0]; 
        }

        return {
          id: match.matchId, // ✅ Firestore의 doc.id 대신 matchId 사용
          ...match,
          matchDate,
          matchStartTime,
        };
      });

      
      return processedMatches;
    } catch (error) {
      console.error("❌ matches.json 데이터 가져오기 오류:", error);
      return [];
    }
  };
  
export default fetchMatchesPublic;