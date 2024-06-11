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

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle category click
  const handleCategoryClick = async (category) => {
    try {
      // If user is logged in, navigate to the category page
      // Otherwise, navigate to the login page
      const path = isLoggedIn()
        ? `/category?category=${encodeURIComponent(category)}`
        : "/login";
      onCategoryChange(category);
      await navigate(path);
    } catch (error) {
      console.error(error);
    }
  };

  // Settings for the slider component
  const sliderSettings = {
    className: "slider pt-2",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 0,
    centerPadding: 100,
    swipetoSlie: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          className: "",
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          className: "",
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          className: "",
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          className: "",
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 361,
        settings: {
          className: "",
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <>
      <div className="w-full px-5">
        <Slider {...sliderSettings}>
          {categories.map((category, index) => (
            <button
              className="cursor-pointer text-center text-blue-600 bg-white focus:text-newsRed focus:italic hover:text-newsRed  font-bold rounded-lg text-md sm:text-lg lg:text-xl"
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
      </div>
    </>
  );
};

export default CategoryHeader;
