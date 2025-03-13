import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase"; // ✅ Firestore 설정 가져오기
import courtData from "../../data/courtData"; // ✅ 경기장 정보 가져오기
import DesktopLayout from "../../layout/DesktopLayout";
import FormInput from "../../components/form/FormInput";
import FormRadioGroup from "../../components/form/FormRadioGroup";
import FormButton from "../../components/form/FormButton";
import styled from "styled-components";

const FormContainer = styled.div`
backgroud-color : #FFF2E7,
padding: 10px;
display : flex;
flex-direction: column;
justify-content : center;
max-width: 500px; /* 폼의 최대 너비 설정 */
margin: 0 auto; 
`

const RemainingSeats = styled.div`
  font-size: 12px;
  color: ${(props) => (props.isClosed ? "#888" : "red")};
  text-align: center;
  margin-left : 58%;
  margin-top : -1px;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const Image = styled.img`
  width: 90%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const NoticeContainer = styled.div`
  text-align: left;
  margin-top: 1px;
  font-size: 14px;
  color: #333;
  margin-bottom : 20px;
`;

const NoticeItem = styled.p`
  margin: 5px 0;
  font-size: 13px;
  color: black;
  font-weight:  normal;
`;


const FormPage = () => {
  const { courtId, matchId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { courtName, matchDate, matchTime } = location.state || {};
  const [remainingSeats, setRemainingSeats] = useState(null);

  const courtInfo = courtData[courtId];
  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId) return;
      const matchRef = doc(db, "matches", matchId);
      const matchSnap = await getDoc(matchRef);

      if (matchSnap.exists()) {
        setRemainingSeats(matchSnap.data().remainingCount); // ✅ Firestore에서 남은 자리 가져오기
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!courtId || !matchId) {
      alert("올바른 경기 정보가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const matchRef = doc(db, "matches", matchId);
      const matchSnap = await getDoc(matchRef);

      if (!matchSnap.exists()) {
        alert("경기 정보를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      const matchData = matchSnap.data();
      const { registeredCount, remainingCount } = matchData;

      if (remainingCount <= 0) {
        alert("이 경기의 신청이 마감되었습니다.");
        setLoading(false);
        return;
      }

      // ✅ 신청 정보 Firestore에 저장
      await addDoc(collection(db, "match_registrations"), {
        matchId,
        courtId,
        ...formData,
        createdAt: new Date(),
      });

      await updateDoc(matchRef, {
        registeredCount: registeredCount + 1,
        remainingCount: remainingCount - 1,
      });

      alert("신청이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("신청 저장 실패:", error);
      alert("신청 저장에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <DesktopLayout>
      <FormContainer>
        {courtInfo ? (
          <>
            <h2 style={{ marginTop: "40px" }}>{courtInfo.name}</h2>
            <p>주소 : {courtInfo.address}</p>
            <Image src={courtInfo.image} alt={`${courtInfo.name} 이미지`} style={{ marginBottom: "10px"}} />
            <div style={{width : "100%"}}>
              <p style={{ fontSize: "16px", fontWeight: "bold", marginTop: "0px", marginBottom: "-10px", display: "flex", flexDirection: "row" }}>
                {courtInfo.price || "5,000원"}
                <span style={{ fontSize: "12px", color: "#888", marginTop : "2px",marginLeft: "5px", display: "flex", flexDirection: "row", width : "80%" }}>
                  / {courtInfo.duration || "1시간"}
                  {remainingSeats !== null && (
                    <RemainingSeats remainingCount={remainingSeats} >
                      {remainingSeats > 0 ? `남은 자리: ${remainingSeats}자리` : "신청이 마감되었습니다."}
                    </RemainingSeats>
                  )}
                </span>

              </p>
            </div>
            <p style={{ fontSize: "12px", color: "#666" }}>
              남자 5 VS 5
            </p>
          </>
        ) : (
          <p>경기장 정보를 불러올 수 없습니다.</p>
        )}
        {/* 신청 폼 */}
        <p>{matchDate} {matchTime}</p>
        <FormInput label="성함을 입력하세요" type="text" name="name" value={formData.name} onChange={handleChange} />
        <FormRadioGroup
          label="성별을 선택하세요"
          name="gender"
          options={[
            { value: "male", label: "남성" },
            { value: "female", label: "여성" },
          ]}
          selected={formData.gender}
          onChange={handleChange}
        />
        <FormInput label="나이를 입력하세요" type="text" name="age" value={formData.age} onChange={handleChange} />
        <FormInput label="전화번호를 입력하세요" type="tel" name="phone" value={formData.phone} onChange={handleChange} />

        {courtInfo ? (
          <>
            <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>주의사항</p>
            <NoticeContainer>
              {courtInfo.notice.map((line, index) => (
                <NoticeItem key={index} isHeader={index === 0}>
                  {line}
                </NoticeItem>
              ))}
            </NoticeContainer>
          </>
        ) : (
          <p >경기장 정보를 불러올 수 없습니다.</p>
        )}
        <FormButton text={loading ? "신청 중..." : "신청 완료"} onClick={handleSubmit} disabled={loading} />
      </FormContainer>
    </DesktopLayout>
  );
};

export default FormPage;