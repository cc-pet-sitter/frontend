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
  // const [petProfiles, setPetProfiles] = useState<Array<PetProfileData> | null>(
  //   null
  // );
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
      // setPetProfiles(response.data);

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

      console.log(queryParams);

      navigate("/search_page", { state: { searchResults: data } });
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };

  const steps = [
    {
      title: "Create Your Pet Profile",
      description: "Start by adding details about your pet.",
      icon: <FaPaw className="mx-auto text-2xl" />,
    },
    {
      title: "Find the Perfect Sitter",
      description:
        "Search sitters nearby and explore profiles to find the best match.",
      icon: <BsSearchHeart className="mx-auto text-2xl" />,
    },
    {
      title: "Connect & Book",
      description:
        "Send requests, chat with sitters, and confirm your bookings easily.",

      icon: <BsCalendar2Date className="mx-auto text-2xl" />,
    },
  ];

  return (
    <div className="mb-12">
      <div className="bg-white text-center pt-10 ">
        <div className="px-6">
          <h1 className="text-4xl font-bold text-brown">
            {t("homePage.title")}
          </h1>
          <p className="text-lg text-gray-700 mt-4">{t("homePage.subtitle")}</p>
          <button
            onClick={handleScrollToSearch}
            className="mt-6 bg-[#d87607] text-white py-2 px-6 rounded-lg hover:bg-[#bc560a] transition"
          >
            {t("homePage.search-btn")}
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1537151641189-e685b67326c5?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cute pets"
          className="mt-8 my-2 mx-auto w-screen h-auto"
        />
      </div>
      <div ref={searchSectionRef} className="justify-items-center bg-white">
        <SearchBar
          onSearchSubmit={handleSearchSubmit}
          closeSearchBar={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      {/* Features Section (how  the app works) */}
      <section className="py-12 bg-[#fef6e4]">
        <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>

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
                className="!absolute top-2/4 left-2 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-black hover:bg-white/10 active:bg-white/30 grid place-items-center"
              >
                <ChevronLeftIcon strokeWidth={3} className="-ml-1 h-7 w-7" />
              </button>
            )}
            nextArrow={({ loop, handleNext, lastIndex }) => (
              <button
                onClick={handleNext}
                disabled={!loop && lastIndex}
                className="!absolute top-2/4 right-2 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-black hover:bg-white/10 active:bg-white/30 grid place-items-center"
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

      <div className="m-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t("homePage.title_pets")}
        </h2>
        <Carousel
          className="rounded-xl w-full mx-auto max-w-[24rem]"
          navigation={() => (
            <div className="hidden"></div> // This hides the navigation dots
          )}
        >
          {randomProfiles?.map((profile, index) => (
            <Card key={index} className="max-w-[24rem] overflow-hidden m-2">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 rounded-none h-60"
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
        <div className="flex justify-center my-2">
          <button
            onClick={() => {
              navigate("/pet_profiles");
            }}
            className="text-brown underline content-center text-lg"
          >
            <a>{t("homePage.more_pet_view")}</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
