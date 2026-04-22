import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll lên đầu trang mỗi khi đổi route (click từ trang chủ sang danh mục, đổi danh mục, ...) */
const RouteScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Chỉ cuộn lên đầu khi đổi pathname/hash, không cuộn khi chỉ đổi query (vd: ?tab=...)
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
};

export default RouteScrollToTop;
