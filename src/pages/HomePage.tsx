import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/search/SearchBar";
import { useTranslation } from "react-i18next";
import { SearchFormData } from "../components/search/SearchBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PetProfileData } from "../types/userProfile";
import { BsCalendar2Date } from "react-icons/bs";
import { FaPaw } from "react-icons/fa";
import { BsSearchHeart } from "react-icons/bs";
import topImage from "../Images/Homepage-top.jpg";
import {
  Carousel,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const HomePage: React.FC = () => {
  const [randomProfiles, setRandomProfiles] =
    useState<Array<PetProfileData> | null>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPetProfiles = async () => {
    try {
      const response = await axios.get(`${apiURL}/pet`);
      const data = response.data;

      // Randomly select 30 profiles
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 30);

      // Set the selected profiles
      setRandomProfiles(selected);
    } catch (error) {
      console.error("Unable to fetch pet profiles", error);
    }
  };

  useEffect(() => {
    fetchPetProfiles();
  }, []);

  const handleSearchSubmit = async (formData: SearchFormData) => {
    try {
      const queryParams = new URLSearchParams(
        formData as unknown as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${apiURL}/appuser-sitters?${queryParams}`
      );

      navigate("/search_page", { state: { searchResults: data, initialSearch: formData } });
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };

  const steps = [
    {
      title: t("homePage.how_it_works_title_1"),
      description: t("homePage.how_it_works_description_1"),
      icon: <FaPaw className="mx-auto text-2xl text-gray-800" />,
    },
    {
      title: t("homePage.how_it_works_title_2"),
      description: t("homePage.how_it_works_description_2"),
      icon: <BsSearchHeart className="mx-auto text-2xl text-gray-800" />,
    },
    {
      title: t("homePage.how_it_works_title_3"),
      description: t("homePage.how_it_works_description_3"),

      icon: <BsCalendar2Date className="mx-auto text-2xl text-gray-800" />,
    },
  ];

  return (
    <div className="mb-12">
      <div className="bg-white text-center mb-6 pt-10 md:pt-0 md:flex">
        <div className="px-6 md:mb-0 md:content-center md:pl-12">
          <h1 className="text-4xl font-bold text-brown">
            {t("homePage.title")}
          </h1>
          <p className="text-lg text-gray-700 mt-4">{t("homePage.subtitle")}</p>
          <button
            onClick={handleScrollToSearch}
            className="mt-6 bg-[#d87607] text-white py-2 px-6 md:py-3 md:px-8 rounded-lg hover:bg-[#bc560a] transition"
          >
            {t("homePage.search-btn")}
          </button>
        </div>
        <img
          src={topImage}
          alt="Cute pets"
          className="mt-8 md:my-0 my-2 mx-auto w-screen h-auto sm:h-96 md:h-[33rem] 2xl:h-[38rem] md:w-3/4 2xl:w-4/5 md:rounded-bl-full object-cover"
        />
      </div>
      <div ref={searchSectionRef} className="justify-items-center bg-white ">
        <SearchBar
          onSearchSubmit={handleSearchSubmit}
          closeSearchBar={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      {/* Features Section (how  the app works) */}
      <section className="py-12 bg-[#fef6e4]">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("homePage.how_it_works")}
        </h2>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-6 rounded-lg text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-seBtnBg mb-2">
                {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile View: Swiper */}
        <div className="md:hidden h-52">
          <Carousel
            className="rounded-xl w-full mx-auto max-w-[24rem] relative"
            prevArrow={({ loop, handlePrev, firstIndex }) => (
              <button
                onClick={handlePrev}
                disabled={!loop && firstIndex}
                className="!absolute top-2/4 -left-0 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-text-gray-800 hover:bg-gray-800/10 active:bg-gray-800/30 grid place-items-center"
              >
                <ChevronLeftIcon strokeWidth={3} className="-ml-1 h-7 w-7" />
              </button>
            )}
            nextArrow={({ loop, handleNext, lastIndex }) => (
              <button
                onClick={handleNext}
                disabled={!loop && lastIndex}
                className="!absolute top-2/4 -right-0 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-text-gray-800 hover:bg-gray-800/10 active:bg-gray-800/30 grid place-items-center"
              >
                <ChevronRightIcon strokeWidth={3} className="ml-1 h-7 w-7" />
              </button>
            )}
            navigation={({ setActiveIndex, activeIndex, length }) => (
              <div className="absolute bottom-0 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                {new Array(length).fill("").map((_, i) => (
                  <span
                    key={i}
                    className={`block h-3 w-3 cursor-pointer rounded-full transition-colors content-[''] ${
                      activeIndex === i ? "bg-[#d87607]" : "bg-[#d87607]/50"
                    }`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-6 rounded-lg text-center mx-auto w-3/4 h-44 center-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-seBtnBg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("homePage.title_pets")}
        </h2>
        <Carousel
          className="rounded-xl w-full mx-auto max-w-[30rem] relative"
          navigation={() => (
            <div className="hidden"></div> // This hides the navigation dots
          )}
          prevArrow={({ loop, handlePrev, firstIndex }) => (
            <button
              onClick={handlePrev}
              disabled={!loop && firstIndex}
              className="!absolute top-2/4 -left-0 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-text-gray-800 hover:bg-gray-800/10 active:bg-gray-800/30 grid place-items-center"
            >
              <ChevronLeftIcon strokeWidth={3} className="-ml-1 h-7 w-7" />
            </button>
          )}
          nextArrow={({ loop, handleNext, lastIndex }) => (
            <button
              onClick={handleNext}
              disabled={!loop && lastIndex}
              className="!absolute top-2/4 -right-0 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-text-gray-800 hover:bg-gray-800/10 active:bg-gray-800/30 grid place-items-center"
            >
              <ChevronRightIcon strokeWidth={3} className="ml-1 h-7 w-7" />
            </button>
          )}
        >
          {randomProfiles?.map((profile, index) => (
            <Card
              key={index}
              className="max-w-[22rem] overflow-hidden mx-auto w-3/4 h-72 ms:h-96 mb-1"
            >
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 rounded-none h-70 ms:h-94"
              >
                <img
                  src={profile.profile_picture_src}
                  alt="ui/ux review check"
                  className="w-full h-full object-cover"
                />
              </CardHeader>
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {profile.name}
                </Typography>

                <Typography
                  variant="lead"
                  color="gray"
                  className="text-sm sm:text-base font-medium"
                >
                  {profile.subtype}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </Carousel>
        <div className="flex justify-center">
          <button
            onClick={() => {
              navigate("/pet_profiles");
            }}
            className="mt-6 bg-[#d87607] text-white py-2 px-6 rounded-lg hover:bg-[#bc560a] transition"
          >
            {t("homePage.more_pet_view")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
