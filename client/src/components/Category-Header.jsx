import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCurrentUserContext } from "../context/CurrentUser";

const CategoryHeader = ({ onCategoryChange, categories = [] }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useCurrentUserContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategoryClick = (category) => {
    if (isLoggedIn()) {
      onCategoryChange(category);
      navigate(`/${category}`);
    } else {
      navigate("/login");
    }
  };

  const sliderSettings = {
    className: "slider px-10",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          className: "px-8",
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          className: "px-6",
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          className: "px-4",
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          className: "px-3",
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 361,
        settings: {
          className: "px-3",
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...sliderSettings}>
        {categories.map((category, index) => (
          <button
            className="text-blue-600 bg-white hover:bg-blue-300 font-bold rounded-lg text-md sm:text-lg lg:text-xl"
            key={index}
            onClick={() => {
              handleCategoryClick(category);
              if (isSidebarOpen) {
                toggleSidebar();
              }
            }}
          >
            {category}
          </button>
        ))}
      </Slider>
    </>
  );
};

export default CategoryHeader;
