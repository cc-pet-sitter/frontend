import React, { useState, useEffect } from "react";
import SearchBar from "../components/search/SearchBar";
import { useTranslation } from "react-i18next";
import { SearchFormData } from "../components/search/SearchBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PetProfileData } from "../types/userProfile";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

import {
  Carousel,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const HomePage: React.FC = () => {
  const [petProfiles, setPetProfiles] = useState<Array<PetProfileData> | null>(
    null
  );
  const [randomProfiles, setRandomProfiles] =
    useState<Array<PetProfileData> | null>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchPetProfiles = async () => {
    try {
      const response = await axios.get(`${apiURL}/pet`);
      const data = response.data;
      setPetProfiles(response.data);

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

  useEffect(() => {
    console.log(petProfiles);
  }, [petProfiles]);

  const handleSearchSubmit = async (formData: SearchFormData) => {
    try {
      const queryParams = new URLSearchParams(
        formData as Record<string, string>
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
      <div className="justify-items-center bg-white">
        <div className="my-6">
          <h1 className="text-center text-2xl font-semibold">
            {t("homePage.subtitle")}
          </h1>
        </div>
        <h3 className="italic">{t("homePage.searchLabel")}</h3>
        {/* <SignUpForm /> */}
        <SearchBar onSearchSubmit={handleSearchSubmit} />
      </div>
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
