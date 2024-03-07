import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCurrentUserContext } from "../context/CurrentUser";

const CategoryHeader = ({
  onCategoryChange,
  categories = [],
}) => {
  const [selectedCategory, setSelectedCategory ] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useCurrentUserContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategoryClick = (category) => {
    if (isLoggedIn()) {
    onCategoryChange(category);
    setSelectedCategory(category); 
    navigate(`/${category}`);
    } else {
      navigate("/login");
    }
  };

  const sliderSettings = {
    className: "slider",
    centerPadding: "5px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      <Slider {...sliderSettings}>
        {categories.map((category, index) => (
          <button
            className={`text-blue-600 font-bold ${category === selectedCategory ? "bg-blue-300" : ""} rounded-lg text-md sm:text-lg lg:text-xl ${index === 0 ? "" : ""}`}
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
