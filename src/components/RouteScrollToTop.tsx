import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll lên đầu trang mỗi khi đổi route (click từ trang chủ sang danh mục, đổi danh mục, ...) */
const RouteScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Luôn nhảy lên đầu trang khi đổi route (tương thích mọi browser)
    window.scrollTo(0, 0);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default RouteScrollToTop;
