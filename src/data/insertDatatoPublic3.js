import fs from 'fs';
import crypto from 'crypto'; // 랜덤 ID 생성용
import courtData from './courtData.js';

// 기존 matches.json 파일 경로
const MATCHES_FILE = 'public/matches.json';
const MATCH_IDS_FILE = 'public/matchIds.json';

// 기존 JSON 파일 로드 함수
const loadExistingData = (filePath) => {
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  }
  return []; // 파일이 없으면 빈 배열 반환
};

// 기존 데이터를 로드
const existingMatches = loadExistingData(MATCHES_FILE);
const existingMatchIds = loadExistingData(MATCH_IDS_FILE);

// 매치 설정
const START_DATE = new Date('2025-03-14'); // 시작 날짜
const END_DATE = new Date('2025-03-23'); // 종료 날짜
const weekendDays = [16, 23]; // 주말 날짜 리스트 (3월)

// 랜덤 문자열 생성 함수 (6자리)
const generateShortId = () => crypto.randomBytes(3).toString('hex'); // 6글자 랜덤 ID

// 새 매치 데이터 저장할 배열
const newMatchData = [];
const newMatchIdList = [];

// 날짜 반복
for (let d = new Date(START_DATE); d <= END_DATE; d.setDate(d.getDate() + 1)) {
  const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  const day = d.getDate(); // 날짜 추출
  const isWeekend = weekendDays.includes(day); // 주말 여부 확인

  const startHour = isWeekend ? 6 : 16; // 주말이면 06시 시작, 평일이면 16시 시작
  const endHour = 23; // ✅ 24시는 별도 추가

  // 코트별 매치 생성
  Object.keys(courtData).forEach((courtId) => {
    for (let hour = startHour; hour <= endHour; hour++) {
      let matchDate = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:00:00.000Z`);
      matchDate.setHours(matchDate.getHours() - 9); // ✅ 한국 시간(KST) 기준으로 변환

      // **Invalid Date 방지: 유효한 날짜인지 체크 후 저장**
      if (isNaN(matchDate.getTime())) {
        console.error(`❌ 유효하지 않은 날짜: ${dateStr} ${hour}:00`);
        continue; // **유효하지 않은 경우 해당 데이터 건너뜀**
      }

      // 짧은 랜덤 matchId 생성 (예: "7-a1b2c3")
      const matchId = `${courtId}-${generateShortId()}`;

      // 중복 데이터 방지 (matchtime이 기존 matches.json에 있는지 확인)
      const matchTimeISO = matchDate.toISOString();
      if (!existingMatches.some((match) => match.matchtime === matchTimeISO && match.courtId === Number(courtId))) {
        // 매치 데이터 추가
        newMatchData.push({
          matchId,
          courtId: Number(courtId),
          courtName: courtData[courtId].name,
          matchtime: matchTimeISO, // ✅ 한국 시간 기준으로 저장
        });

        // matchId 리스트에 저장
        newMatchIdList.push(matchId);
      }
    }

    // ✅ 24:00 (자정) 데이터 추가
    let midnightDate = new Date(`${dateStr}T00:00:00.000Z`); // 00:00:00로 설정
    midnightDate.setDate(midnightDate.getDate() + 1); // 날짜 하루 증가
    midnightDate.setHours(midnightDate.getHours() - 9); // ✅ 한국 시간(KST) 변환

    const midnightMatchId = `${courtId}-${generateShortId()}`;
    const midnightMatchTimeISO = midnightDate.toISOString();

    if (!existingMatches.some((match) => match.matchtime === midnightMatchTimeISO && match.courtId === Number(courtId))) {
      newMatchData.push({
        matchId: midnightMatchId,
        courtId: Number(courtId),
        courtName: courtData[courtId].name,
        matchtime: midnightMatchTimeISO,
      });

      newMatchIdList.push(midnightMatchId);
    }
  });
}

// 기존 데이터와 새 데이터를 병합
const updatedMatches = [...existingMatches, ...newMatchData];
const updatedMatchIds = [...existingMatchIds, ...newMatchIdList];

// JSON 파일로 저장
fs.writeFileSync(MATCHES_FILE, JSON.stringify(updatedMatches, null, 2));
fs.writeFileSync(MATCH_IDS_FILE, JSON.stringify(updatedMatchIds, null, 2));

console.log('✅ 기존 matches.json에 새로운 매치 데이터가 추가되었습니다! (24시 포함)');