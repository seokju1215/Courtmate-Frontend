import fs from "fs";
import { db } from "../config/firebase.js"; // Firebase 설정 가져오기
import { collection, doc, writeBatch, getDocs, query } from "firebase/firestore";

// matchIds.json 파일 로드
const MATCH_IDS_FILE = "public/matchIds.json";

const loadMatchIds = () => {
  if (fs.existsSync(MATCH_IDS_FILE)) {
    const fileData = fs.readFileSync(MATCH_IDS_FILE, "utf8");
    return JSON.parse(fileData); // JSON 배열로 변환
  }
  return [];
};

const addMatchesToFirestoreBatch = async () => {
  console.log("🔥 Firestore에 매치 데이터 Batch 추가 시작...");

  const matchIds = loadMatchIds(); // matchIds.json에서 불러오기
  if (matchIds.length === 0) {
    console.error("❌ matchIds.json이 비어있거나 존재하지 않습니다.");
    return;
  }

  const matchesCollection = collection(db, "remainingspots");

  // 🔍 Firestore에서 기존 matchId 가져오기
  const existingDocsSnap = await getDocs(query(matchesCollection));
  const existingMatchIds = new Set(existingDocsSnap.docs.map(doc => doc.id));

  // 🔥 Firestore에 데이터 추가 (Batch로 500개씩)
  let batch = writeBatch(db);
  let batchCounter = 0;

  for (const matchId of matchIds) {
    if (existingMatchIds.has(matchId)) {
      console.log(`⚠️ 이미 존재하는 matchId: ${matchId}, 건너뜀`);
      continue; // 이미 존재하면 추가하지 않음
    }

    const matchRef = doc(matchesCollection, matchId);
    batch.set(matchRef, {
      remainingSpots: 10, // 초기값 10명 설정
      createdAt: new Date().toISOString(), // 생성 시간 추가
    });

    batchCounter++;

    // 500개씩 처리
    if (batchCounter >= 500) {
      await batch.commit(); // Batch 쓰기 실행
      console.log(`✅ 500개 데이터 Firestore에 저장 완료`);
      batch = writeBatch(db); // 새로운 Batch 시작
      batchCounter = 0;
    }
  }

  // 남은 데이터 처리
  if (batchCounter > 0) {
    await batch.commit();
    console.log(`✅ 마지막 ${batchCounter}개 데이터 Firestore에 저장 완료`);
  }

  console.log("🔥 Firestore 데이터 추가 완료!");
};

// 실행
addMatchesToFirestoreBatch();