import { db } from "../config/firebase"; // ✅ Firestore 인스턴스 가져오기
import { collection, query, getDocs } from "firebase/firestore"; // ✅ Firestore 모듈 가져오기

// 🔥 한 번만 경기 데이터를 가져오기 (getDocs 사용)
export const fetchMatches = async () => {
  const matchesQuery = query(collection(db, "matches"));

  try {
    const querySnapshot = await getDocs(matchesQuery);
    const matches = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      const matchDate = data.matchtime?.toDate
        ? data.matchtime.toDate().toISOString().split("T")[0]
        : "날짜 없음";

      const matchStartTime = data.matchtime?.toDate
        ? data.matchtime.toDate().toLocaleTimeString("ko-KR", {
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

    return matches; // ✅ 데이터를 반환
  } catch (error) {
    console.error("🔥 Firestore 데이터 가져오기 오류:", error);
    return [];
  }
};