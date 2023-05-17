import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { windowWidthState, isMobileState } from "../atoms";

export const IsDeviceMobile = () => {
  const [mobileState, setMobileState] = useRecoilState(isMobileState);

  useEffect(() => {
    function isMobile() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileKeywords = [
        /android/i,
        /webos/i,
        /iphone/i,
        /ipad/i,
        /ipod/i,
        /blackberry/i,
        /windows phone/i,
      ];

      return mobileKeywords.some((keyword) => userAgent.match(keyword));
    }

    setMobileState(isMobile());
  }, []);
};

export const UseWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useRecoilState(windowWidthState);

  useEffect(() => {
    if (windowWidth === 0) {
      setWindowWidth(window.innerWidth);
    }
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
};
