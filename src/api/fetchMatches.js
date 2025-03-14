import { db } from "../config/firebase"; // ✅ Firestore 인스턴스 가져오기
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore"; // ✅ Firestore 모듈 가져오기

// 🔥 Firestore에서 경기 데이터를 가져오기
export const fetchMatches = async () => {
  try {
    // ✅ 오늘 날짜 이후의 경기만 가져오기
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayFilter;

    // ✅ Firestore에서 `matchtime` 필드 타입이 `Timestamp`인지 확인 (첫 번째 문서 확인)
    const firstQuery = query(collection(db, "matches"), orderBy("matchtime", "asc"), limit(1));
    const firstDocSnapshot = await getDocs(firstQuery);

    if (!firstDocSnapshot.empty) {
      const firstMatch = firstDocSnapshot.docs[0].data();
      if (firstMatch.matchtime && typeof firstMatch.matchtime.toDate === "function") {
        todayFilter = Timestamp.fromDate(today); // ✅ Firestore Timestamp 사용
      } else {
        todayFilter = today.toISOString(); // ✅ 문자열로 저장된 경우
      }
    } else {
      console.warn("⚠ Firestore에 경기 데이터가 없습니다.");
      return [];
    }

    console.log("🔥 Firestore에서 한 번의 요청으로 데이터 가져오기...");
    console.log("📌 필터 기준 (오늘 이후):", todayFilter);

    // ✅ Firestore 쿼리: 오늘 이후 경기만 가져오기
    const matchesQuery = query(
      collection(db, "matches"),
      where("matchtime", ">=", todayFilter), // ✅ 오늘 이후 경기만 필터링
      orderBy("matchtime", "asc"), // ✅ 시작 시간 기준 정렬
      limit(1000) // ✅ 한 번의 요청으로 최대 1000개 가져오기
    );

    // ✅ Firestore 요청 실행 (한 번만 요청)
    const querySnapshot = await getDocs(matchesQuery);

    console.log(`📌 가져온 문서 개수: ${querySnapshot.size}`);

    if (querySnapshot.empty) {
      console.warn("⚠ Firestore에 경기 데이터가 없습니다.");
      return [];
    }

    // ✅ 결과 변환 (Firestore Timestamp → Date 변환)
    const matches = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let matchDateObj = null;

      if (data.matchtime && typeof data.matchtime.toDate === "function") {
        matchDateObj = data.matchtime.toDate();
      } else if (typeof data.matchtime === "string") {
        matchDateObj = new Date(data.matchtime);
      }

      const matchDate = matchDateObj ? matchDateObj.toISOString().split("T")[0] : "날짜 없음";
      const matchStartTime = matchDateObj
        ? matchDateObj.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
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
    console.error("❌ Firestore 데이터 가져오기 오류:", error);
    return [];
  }
};