import { db } from "../config/firebase"; // ✅ Firestore 인스턴스 가져오기
import { collection, query, getDocs } from "firebase/firestore"; // ✅ Firestore 모듈 가져오기

// 🔥 Firestore에서 경기 데이터를 가져오기
export const fetchMatches = async () => {
  const matchesQuery = query(collection(db, "matches"));

  try {
    const querySnapshot = await getDocs(matchesQuery);
    const matches = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      let matchDateObj;

      // ✅ Firestore Timestamp인지 확인 후 변환
      if (data.matchtime && typeof data.matchtime.toDate === "function") {
        matchDateObj = data.matchtime.toDate(); // Firestore Timestamp -> Date 변환
      } else if (typeof data.matchtime === "string") {
        matchDateObj = new Date(data.matchtime); // ✅ 문자열인 경우 직접 Date 변환
      } else {
        matchDateObj = null;
      }

      const matchDate = matchDateObj
        ? matchDateObj.toISOString().split("T")[0] // YYYY-MM-DD 형식
        : "날짜 없음";

      const matchStartTime = matchDateObj
        ? matchDateObj.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // ✅ 24시간 형식 유지
          })
        : "시간 없음";

      return {
        id: doc.id,
        ...data,
        matchDate,
        matchStartTime,
      };
    });

    console.log("✅ Firestore에서 가져온 데이터:", matches);
    return matches; // ✅ 데이터를 반환
  } catch (error) {
    console.error("🔥 Firestore 데이터 가져오기 오류:", error);
    return [];
  }
};