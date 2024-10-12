import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // 광고 스크립트 로드
    if (typeof window !== 'undefined') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  return (
    <div className="course-card"> {/* CourseCard와 동일한 클래스 적용 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YourAdClientID" // 자신의 AdSense Publisher ID로 교체
        data-ad-slot="YourAdSlotID"           // 생성한 광고 단위의 Ad Slot ID로 교체
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
