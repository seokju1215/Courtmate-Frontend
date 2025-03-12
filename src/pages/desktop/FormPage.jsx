import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
padding: 20px;
display : flex;
flex-direction: column;
justify-content : center;
max-width: 500px; /* 폼의 최대 너비 설정 */
margin: 0 auto; 
`

const Image = styled.img`
  width: 90%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const NoticeContainer = styled.div`
  text-align: left;
  margin-top: 10px;
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
  const { courtId, matchId } = useParams(); // ✅ URL에서 courtId, matchId 가져오기
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ courtId에 해당하는 경기장 정보 가져오기
  const courtInfo = courtData[courtId];

  // ✅ 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Firestore에 사용자 신청 정보 저장 및 `matches` 문서 업데이트
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
            <h2 style={{marginTop : "40px"}}>{courtInfo.name}</h2>
            <p>주소 : {courtInfo.address}</p>
            <Image src={courtInfo.image} alt={`${courtInfo.name} 이미지`} />
            <NoticeContainer>
              {courtInfo.notice.map((line, index) => (
                <NoticeItem key={index} isHeader={index === 0}>
                  {line}
                </NoticeItem>
              ))}
            </NoticeContainer>
          </>
        ) : (
          <p>경기장 정보를 불러올 수 없습니다.</p>
        )}

        {/* 신청 폼 */}
        <FormInput label="성함을 입력하세요" type="text" name="name" value={formData.name} onChange={handleChange} />
        <FormRadioGroup
          label="성별을 선택하세요"
          name = "gender"
          options={[
            { value: "male", label: "남성" },
            { value: "female", label: "여성" },
          ]}
          selected={formData.gender}
          onChange={handleChange}
        />
        <FormInput label="나이를 입력하세요" type="number" name="age" value={formData.age} onChange={handleChange} />
        <FormInput label="전화번호를 입력하세요" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        <FormButton text={loading ? "신청 중..." : "신청 완료"} onClick={handleSubmit} disabled={loading} />
      </FormContainer>
    </DesktopLayout>
  );
};

export default FormPage;