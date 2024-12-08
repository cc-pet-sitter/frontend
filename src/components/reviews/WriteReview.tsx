import { useForm } from "react-hook-form";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import { Inquiry, Review } from "../../types/userProfile";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface WriteReviewProps {
  booking: Inquiry;
  onClose: () => void;
  recipientType: string;
}

interface ReviewForm {
  comment: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({
  booking,
  onClose,
  recipientType,
}) => {
  const { register, handleSubmit } = useForm<ReviewForm>();
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [ratingError, setRatingError] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { currentUser } = useAuth();

  const { t } = useTranslation();

  console.log(booking);

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 text-lg　mb-2 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block tracking-wide text-gray-700 font-bold mb-2 mt-2 text-lg";

  const onReviewSubmit = async (data: ReviewForm) => {
    if (ratingValue === null) {
      setRatingError(true);
      return;
    }

    setRatingError(false);
    const isReviewOfSitter = recipientType === "sitter";
    const authorID = isReviewOfSitter
      ? booking.owner_appuser_id
      : booking.sitter_appuser_id;
    const recipientID = isReviewOfSitter
      ? booking.sitter_appuser_id
      : booking.owner_appuser_id;

    const review: Review = {
      id: 0,
      author_appuser_id: authorID,
      recipient_appuser_type: recipientType,
      recipient_appuser_id: recipientID,
      comment: data.comment,
      score: ratingValue || 0,
      submission_date: new Date(),
    };

    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${apiURL}/appuser/${recipientID}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // alert("Review submitted succesfully.");
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Cannot leave zero stars");
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form
        onSubmit={handleSubmit(onReviewSubmit)}
        className="w-full max-w-lg "
        noValidate
      >
        <div className="flex flex-col items-center md:items-start">
          <label className={`${labelClass} block`}>
            {t("review_input_page.rating")}
          </label>
          <div className="w-full flex justify-center p-2">
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(_event, ratingValue) => {
                setRatingValue(ratingValue);
              }}
              size={"large"}
            />
          </div>
          {ratingError && (
            <p className="text-red-500 text-xs italic">
              {t("review_input_page.rating_required")}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className={`${labelClass} block`} htmlFor="comment">
            {t("review_input_page.comment")}
          </label>
          <textarea
            id="comment"
            className={inputClass}
            rows={4}
            cols={40}
            {...register("comment")}
          />
        </div>

        <div className="flex justify-center">
          <div className="md:w-1/2 flex justify-center">
            <button type="submit" className="btn-primary">
              {t("review_input_page.submit")}
            </button>
          </div>
        </div>
      </form>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg font-semibold">
              {t("review_input_page.review_submitted")}
            </p>
            <button
              className="btn-primary mt-4"
              onClick={() => {
                setShowPopup(false);
                onClose();
              }}
            >
              {t("review_input_page.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteReview;
