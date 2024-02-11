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
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useCurrentUserContext();

  const handleCategoryClick = (category) => {

    if (isLoggedIn()) {
    onCategoryChange(category); 
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
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
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
    <div className="">
      <Slider {...sliderSettings}>
        {categories.map((category, index) => (
          <button
            className={`text-blue-600 font-bold ${category === selectedCategory ? "bg-blue-300" : ""} rounded-lg text-md sm:text-lg lg:text-xl ${index === 0 ? "" : ""}`}
            key={index}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryHeader;
