const EditProfileForm: React.FC = () => {
  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center p-6">
            <img
              src={user.appuser.profile_picture_src}
              alt={`${user.appuser.firstname} ${user.appuser.lastname}`}
              className="h-48 w-48 rounded-full object-cover"
            />
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{`${user.appuser.firstname} ${user.appuser.lastname}`}</h1>
              {/* <p className="text-gray-500">{user.appuser.email}</p> */}
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center">
              <button
                onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
                className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              >
                {showEnquiryForm
                  ? t("sitterProfilePage.close")
                  : t("sitterProfilePage.makeAnEnquiry")}
              </button>
              {showEnquiryForm && (
                <div className="mt-6 w-full sm:w-auto">
                  <EnquiryForm
                    sitterId={id}
                    closeEnquiryForm={handleCloseEnquiryForm}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Account Bio */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">Bio</h2>
            <p>{user.sitter.sitter_profile_bio}</p>
          </div>

          {/* Sitter Details */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t("sitterProfilePage.animalsICareFor")}
            </h2>
            <p className="text-slate-500 text-sm">
              {user.sitter.dogs_ok ? (
                <>
                  <Done /> {t("searchPage.dog")}
                </>
              ) : (
                <>{/* <NotInterested /> {t("searchPage.dog")} */}</>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.cats_ok ? (
                <>
                  <Done /> {t("searchPage.cat")}
                </>
              ) : (
                <>{/* <NotInterested /> {t("searchPage.cat")} */}</>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.fish_ok ? (
                <>
                  <Done /> {t("searchPage.fish")}
                </>
              ) : (
                <>{/* <NotInterested /> {t("searchPage.fish")} */}</>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.birds_ok ? (
                <>
                  <Done /> {t("searchPage.bird")}
                </>
              ) : (
                <>{/* <NotInterested /> {t("searchPage.bird")} */}</>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.rabbits_ok ? (
                <>
                  <Done /> {t("searchPage.rabbit")}
                </>
              ) : (
                <>{/* <NotInterested /> {t("searchPage.rabbit")} */}</>
              )}
            </p>
          </div>
          {/* Profile Details */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t("sitterProfilePage.profileDetails")}
            </h2>
            <ul className="list-none space-y-2 text-left">
              <li>
                <strong>{`${t("sitterProfilePage.location")}:`}</strong>{" "}
                {`${user.appuser.prefecture}, ${user.appuser.city_ward}`}
              </li>
              <li>
                <strong>{`${t("sitterProfilePage.postCode")}:`}</strong>{" "}
                {user.appuser.postal_code}
              </li>
              <li>
                <strong>{`${t("sitterProfilePage.languages")}:`}</strong>{" "}
                {user.appuser.english_ok && user.appuser.japanese_ok
                  ? t("sitterProfilePage.englishJapanese")
                  : user.appuser.english_ok
                  ? t("sitterProfilePage.english")
                  : t("sitterProfilePage.japanese")}
              </li>
              <li>
                <strong>{`${t("sitterProfilePage.accountCreated")}:`}</strong>{" "}
                {user.appuser.account_created
                  ? `${formatDistanceToNow(
                      new Date(user.appuser.account_created)
                    )}`
                  : t("sitterProfilePage.never")}
              </li>
              <li>
                <strong>{`${t("sitterProfilePage.lastLogin")}:`}</strong>{" "}
                {user.appuser.last_login
                  ? `${formatDistanceToNow(new Date(user.appuser.last_login), {
                      addSuffix: true,
                    })}`
                  : t("sitterProfilePage.never")}
              </li>
            </ul>
          </div>
          {/* Reviews */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t("sitterProfilePage.reviews")}
            </h2>
            <ul className="list-none space-y-2 text-left"></ul>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            {t("sitterProfilePage.backToSearchResults")}
          </button>
        </div>
        <div>
          <WriteReview />
        </div>
      </div>

      {/* <div className="flex justify-center px-4 sm:px-6 lg:px-8">
                <ul className="w-full max-w-4xl">
                  <div className="pb-6">
                    <div className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row sm:gap-6">
                      <nav className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:p-6">
                        Image
                        <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
                          <img
                            alt="Petter Sitter Image"
                            // src={sitterProfile.sitter_profile_bio}
                            src={
                              "https://live.staticflickr.com/62/207176169_60738224b6_c.jpg"
                            }
                            className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
                          />
                        </div>
                        Content
                        <div>
                          <h6 className="text-slate-800 font-medium text-base sm:text-lg">
                            {sitterProfile.sitter_profile_bio}
                          </h6>
                          <p className="text-slate-500 text-sm sm:text-base">
                            {sitterProfile.visit_ok ||
                            sitterProfile.sitter_house_ok ||
                            sitterProfile.owner_house_ok
                              ? `${t("searchPage.available")} ${[
                                  sitterProfile.sitter_house_ok &&
                                    t("searchPage.sitter_house"),
                                  sitterProfile.owner_house_ok &&
                                    t("searchPage.owner_house"),
                                  sitterProfile.visit_ok &&
                                    t("searchPage.visits"),
                                ]
                                  .filter(Boolean)
                                  .join(", ")} `
                              : t("searchPage.notAvailable")}
                          </p>
                          <div className="pt-4 pb-4">
                            <p className="text-slate-500 text-sm">
                              {sitterProfile.dogs_ok ? "✅ Dogs" : "❌ Dogs"}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {sitterProfile.cats_ok ? "✅ Cats" : "❌ Cats"}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {sitterProfile.fish_ok ? "✅ Fish" : "❌ Fish"}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {sitterProfile.birds_ok ? "✅ Birds" : "❌ Birds"}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {sitterProfile.rabbits_ok
                                ? "✅ Rabbits"
                                : "❌ Rabbits"}
                            </p>
                          </div>
                          <div></div>
                        </div>
                      </nav>
                    </div>
                  </div>
                </ul>
              </div> */}
    </div>
  );
};

export default EditProfileForm;
