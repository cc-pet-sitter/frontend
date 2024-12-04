import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/search/SearchBar";
import { useTranslation } from "react-i18next";
import { SearchFormData } from "../components/search/SearchBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PetProfileData } from "../types/userProfile";
import {
  Carousel,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

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
  return (
    <div className="mb-12">
      <div className="bg-white text-center py-12 ">
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
          className="mt-8 mx-auto w-screen h-auto"
        />
      </div>
      <div
        ref={searchSectionRef}
        className="justify-items-center  bg-[#fef6e4]"
      >
        {/* <div className="my-6"> */}
        {/* <img src={bannerImage} /> */}
        {/* <h1 className="text-center text-2xl font-semibold">
            {t("homePage.subtitle")}
          </h1>
        </div>
        <h3 className="italic">{t("homePage.searchLabel")}</h3> */}
        <SearchBar
          onSearchSubmit={handleSearchSubmit}
          closeSearchBar={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      {/* Features Section (will change later) */}
      {/* <div className="bg-[#fef6e4] py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🐾",
              title: "Experienced Sitters",
              description: "Only the best for your pets!",
            },
            {
              icon: "📅",
              title: "Easy Booking",
              description: "Schedule care with ease.",
            },
            {
              icon: "🔒",
              title: "Secure Payments",
              description: "Your money is safe with us.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-md rounded-lg text-center hover:shadow-lg transition"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-lg font-bold mt-4">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div> */}
      <div className="m-10">
        <h2 className="text-center text-2xl font-semibold">
          {t("homePage.titel_pets")}
        </h2>
        <Carousel
          className="rounded-xl w-full mx-auto max-w-[24rem]"
          navigation={() => (
            <div className="hidden"></div> // This hides the navigation dots
          )}
        >
          {randomProfiles?.map((profile) => (
            <Card className="max-w-[24rem] overflow-hidden m-2">
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
