// CategoryHeader.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategoryHeader = ({
  onCategoryChange,
  categories = [],
  onCategoryClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log("Category clicked:", category);
    onCategoryChange(category); // Call the callback function
    onCategoryClick(category); // Call the function to update the homepage
    navigate(`/homepage/${category}`);
  };

  const sliderSettings = {
    className: "slider px-5",
    centerPadding: "5px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
  };

  return (
    <div className="">
      <Slider {...sliderSettings}>
        {categories.map((category, index) => (
          <button
            className={`text-blue-600 ${category === selectedCategory ? "bg-blue-300" : ""} rounded-lg text-sm sm:text-base ${index === 0 ? "" : ""}`}
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
