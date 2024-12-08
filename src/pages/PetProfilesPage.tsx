import axios from "axios";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PetProfileData } from "../types/userProfile";
import { useNavigate } from "react-router-dom";
import { PiCat, PiMedal, PiRabbit, PiBird } from "react-icons/pi";
import { LiaBirthdayCakeSolid, LiaWeightSolid } from "react-icons/lia";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { LuDog, LuFish } from "react-icons/lu";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const PetProfilesPage: React.FC = () => {
  const [petProfiles, setPetProfiles] = useState<Array<PetProfileData> | null>(
    null
  );

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchPetProfiles = async () => {
    try {
      const response = await axios.get(`${apiURL}/pet`);
      const data = response.data;

      // Shuffle the order
      const shuffled = data.sort(() => 0.5 - Math.random());
      setPetProfiles(shuffled);
    } catch (error) {
      console.error("Unable to fetch pet profiles", error);
    }
  };

  useEffect(() => {
    fetchPetProfiles();
  }, []);
  return (
    <div className="mx-4">
      <button onClick={() => navigate("/")} className="mt-6 ml-1 md:ml-20 flex">
        <MdOutlineArrowBackIos className="mr-3 mt-1" />{" "}
        <p>{t("request_details_page.goBack")}</p>
      </button>
      <h2 className="text-center text-2xl font-semibold mt-4">
        {t("homePage.title_pets")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-center md:mx-20">
        {petProfiles?.map((profile) => (
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
                <div className="flex my-1 text-sm">
                  {profile.type_of_animal === "dog" && (
                    <>
                      <LuDog className="mr-3 mt-1 " />
                      {t("PetProfile.typeOfPet", {
                        animal: t("PetProfile.dog"),
                      })}
                    </>
                  )}
                  {profile.type_of_animal === "cat" && (
                    <>
                      <PiCat className="mr-3 mt-1 " />
                      {t("PetProfile.typeOfPet", {
                        animal: t("PetProfile.cat"),
                      })}
                    </>
                  )}
                  {profile.type_of_animal === "rabbit" && (
                    <>
                      <PiRabbit className="mr-3 mt-1" />
                      {t("PetProfile.typeOfPet", {
                        animal: t("PetProfile.rabbit"),
                      })}
                    </>
                  )}
                  {profile.type_of_animal === "bird" && (
                    <>
                      <PiBird className="mr-3 mt-1 " />
                      {t("PetProfile.typeOfPet", {
                        animal: t("PetProfile.bird"),
                      })}
                    </>
                  )}
                  {profile.type_of_animal === "fish" && (
                    <>
                      <LuFish className="mr-3 mt-1 " />
                      {t("PetProfile.typeOfPet", {
                        animal: t("PetProfile.fish"),
                      })}
                    </>
                  )}
                </div>
                <div className="flex my-1 text-sm">
                  <LiaBirthdayCakeSolid className="mr-3 mt-1 " />
                  {t("PetProfile.birthday")}
                  {new Date(profile.birthday).toLocaleDateString("ja-JP")}
                </div>

                {profile.weight && (
                  <div className="flex my-1 text-sm">
                    <LiaWeightSolid className="mr-3 mt-1" />
                    {t("PetProfile.weight", { weight: profile.weight })}
                  </div>
                )}
                {profile.subtype && (
                  <div className="flex my-1 text-sm">
                    <PiMedal className="mr-3 mt-1" />
                    {t("PetProfile.breed")}
                    {profile.subtype}
                  </div>
                )}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PetProfilesPage;
